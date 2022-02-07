import { parseISO } from "date-fns";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { NgModuleRef, ApplicationRef, Injector, Type, ViewContainerRef } from "@angular/core";
import {
  ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, ActivationStart,
  Navigation, NavigationStart, ParamMap, Router, LoadedRouterConfig,
} from "@angular/router";

import { flatten } from "./array.extensions";
import { isDate, parseDates } from "./object.extensions";

declare module "@angular/router" {
  export interface ParamMap {
    /**
     * Parses Url Parameter to specified Type
     *
     * @template T Parameter Type
     * @param name Parameter Name
     * @returns Parameter casted to specified Type
     */
    getAs<T = string>(name: string): T | null;
  }

  export interface Router {
    /**
     * Provides ability to subscribe to Navigation event for activated routes
     *
     * @param route Activated Route Navigation occurred to
     * @param isTarget Indicates whether specified route is target route navigation occurres to
     * @returns Information about a navigation operation.
     */
    onRouteRetained(route: ActivatedRoute, isTarget?: boolean): Observable<Navigation>;
  }

  export interface LoadedRouterConfig {
    module: NgModuleRef<any>;
  }
}

/**
 * Extends route config with navigation extras.
 *
 * @example Route config:
  {
    path: "..",
    data: { extras: { skipLocationChange: true } as NavigationExtras }
  },
 * @param router Angular Router
 */
export function extendRouteConfigWithNavigationExtras(router: Router) {
  router.events.subscribe(event => {
    // extend existing routes with NavigationExtras property
    if (event instanceof ActivationStart && event.snapshot.data?.extras) {
      Object.assign(router.getCurrentNavigation()?.extras, event.snapshot.data?.extras);
    }
  });
}

/**
 * Binds route config title to website title.
 *
 * @example Route config:
 * {
      path: "..",
      data: { title: string | (route: ActivatedRouteSnapshot) => string }
   }
 * @param router Angular Router
 * @param title Angular Title
 * @param prefix Application title prefix
 */
export function bindRouteConfigTitle(router: Router, title: Title, prefix: string) {
  router.events.subscribe(event => {
    // set website title
    if (event instanceof ActivationEnd) {
      if (event.snapshot.children.length == 0) {
        let routeTitle = event.snapshot.data?.title;

        if (typeof routeTitle == "function") {
          routeTitle = (routeTitle as (route: ActivatedRouteSnapshot) => string)(event.snapshot);
        }

        title.setTitle(routeTitle ? `${prefix} - ${routeTitle}` : prefix);
      }
    }
  });
}

/**
 * Extends param map with typed parameters.
 * Determines value type based on structure and parses it.
 *
 * @example (route as ActivatedRoute).snapshot.queryParamMap.getAs<Date>("fromDate");
 * @param router Angular Router
 */
export function extendParamMapWithTypedParameters(router: Router) {
  // extending ParamMap class to have ability to consume parsed types
  (router.routerState.snapshot.root.paramMap.constructor.prototype as ParamMap).getAs = function (this: ParamMap, name: string) {
    let isNumber = new RegExp(/.\./);
    let isJsonObject = new RegExp(/^{(.+)}$/);

    let value = this.get(name);

    switch (true) {
      case value == null:
      case value == "null":
        return null;

      case value === "true":
        return true;

      case value === "false":
        return false;

      case isDate(value as string):
        return parseISO(value || "") as any;

      case isJsonObject.test(value || ""):
        let model = JSON.parse(value || "null");

        if (model) {
          parseDates(model);
        }

        return model as any;

      case isNumber.test(value || ""):
        return parseFloat(value || "");

      case isFinite(value as any):
        return parseInt(value || "", 10) as any;

      default:
        return value;
    }
  };
}

/**
 * Adds OnRouteRetained event. When navigation occurs to already activated route,
 * then OnRouteRetained event will trigger.
 *
 * @example (router as Router).onRouteRetained(route, isTarget).subscribe(navigation => {});
 * @param router Angular Router
 */
export function addOnRouteRetainedEvent(router: Router) {
  (router.constructor.prototype as Router).onRouteRetained = function (this: Router, route: ActivatedRoute, isTarget = true) {
    return this.events
      .pipe(
        filter(event =>
          event instanceof ActivationEnd &&
          event.snapshot.routeConfig == route.snapshot.routeConfig &&
          (!isTarget || route.snapshot.children.length == 0)),
        map(() => this.getCurrentNavigation() as Navigation));
  };
}

/**
 * Extends router config with stateful modals support.
 *
 * @example Route config:
 * {
      path: "..",
      data: { modalComponent: ModalComponent }
   }
 * @param router Angular Router
 * @param injector Angular Injector
 */
export function extendRouterConfigWithStatefulModals(router: Router, injector: Injector) {
  router.events.subscribe(event => {
    // render statefull modal component
    if (event instanceof ActivationEnd && event.snapshot.data?.modalComponent) {
      let component = event.snapshot.data?.modalComponent;
      let scopedInjector = getActivatedRouteInjector(event.snapshot) || injector;
      let activatedRoute = scopedInjector.get<ActivatedRoute>(ActivatedRoute);
      let dialog = scopedInjector.get<MatDialog>(MatDialog);

      let viewContainerRef = scopedInjector.get<ApplicationRef>(ApplicationRef)
        .components
        .first()
        .injector
        .get<ViewContainerRef>(ViewContainerRef);

      let dialogRef = dialog.open(
        component as Type<any>,
        Object.assign(event.snapshot.data?.modalOptions || {}, {
          viewContainerRef: {
            createComponent: viewContainerRef.createComponent.bind(viewContainerRef),
            injector: Injector.create({
              parent: (dialog as any)._injector,
              providers: [
                {
                  provide: ActivatedRoute,
                  useValue: flatten(activatedRoute.children, route => route.children)
                    .find(route => route.snapshot.data.modalComponent == component)
                },
              ]
            })
          } as ViewContainerRef,
        }));

      let subscription = router.events.subscribe(routerEvent => {
        if (routerEvent instanceof NavigationStart) {
          dialogRef.close();
          subscription.unsubscribe();
        }
      });
    }
  });
}

function getActivatedRouteInjector(snapshot: ActivatedRouteSnapshot): Injector {
  let injector: Injector;

  do {
    injector = ((snapshot.routeConfig as any)?._loadedConfig as LoadedRouterConfig)?.module.injector;

    snapshot = snapshot.parent as ActivatedRouteSnapshot;

  } while (!injector && snapshot.parent);

  return injector;
}
