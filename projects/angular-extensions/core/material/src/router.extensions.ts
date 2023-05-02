import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ApplicationRef, Injector, NgModuleRef, Type, ViewContainerRef } from "@angular/core";
import {
  ActivatedRoute, ActivationEnd, Router, IsActiveMatchOptions, GuardsCheckEnd, Route, Data,
} from "@angular/router";

import { flatten } from "angular-extensions/core";

let routeInjectors: Map<Route, Injector>;

const routeMatchOptions: IsActiveMatchOptions = {
  paths: "exact",
  matrixParams: "exact",
  queryParams: "ignored",
  fragment: "ignored"
};

interface ModalNavigationExtras {
  shouldOpenModal?: boolean;
}

interface LazyLoadedRoute extends Route {
  _loadedConfig?: {
    module: NgModuleRef<any>;

    routes: Route[];
  };
}

function isLazyLoadedRoute(route: Route): route is LazyLoadedRoute {
  return (route as LazyLoadedRoute)._loadedConfig != undefined;
}

function isRouteModalData(data: Data | null): data is RouteModalData {
  return (data as RouteModalData)?.modalComponent != undefined;
}

export interface RouteModalData extends Data {
  modalComponent: Type<any>;

  modalOptions?: MatDialogConfig;
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
 */
export function extendRouterConfigWithStatefulModals(router: Router) {
  if (!routeInjectors) {
    routeInjectors = new Map<Route, Injector>();

    router.events.subscribe(event => {
      if (event instanceof ActivationEnd && isRouteModalData(event.snapshot.data)) {
        let shouldOpenModal = router.getLastSuccessfulNavigation() == null ||
          !router.isActive(router.getCurrentNavigation().initialUrl, routeMatchOptions);

        if (!shouldOpenModal) {
          return;
        }

        let component = event.snapshot.data.modalComponent;
        let scopedInjector = getActivatedRouteInjector(router, event.snapshot.routeConfig);
        let activatedRoute = scopedInjector.get<ActivatedRoute>(ActivatedRoute);
        let dialog = scopedInjector.get<MatDialog>(MatDialog);

        let viewContainerRef = scopedInjector.get<ApplicationRef>(ApplicationRef)
          .components
          .first()
          .injector
          .get<ViewContainerRef>(ViewContainerRef);

        let dialogRef = dialog.open(
          component,
          Object.assign(event.snapshot.data.modalOptions || {}, {
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
          let shouldCloseModal = !router.isActive(router.getCurrentNavigation().extractedUrl, routeMatchOptions);

          if (routerEvent instanceof GuardsCheckEnd && routerEvent.shouldActivate && shouldCloseModal) {
            dialogRef.close();
            subscription.unsubscribe();
          }
        });
      }
    });
  }
}

function getActivatedRouteInjector(router: Router, route: Route): Injector | undefined {
  let injector = routeInjectors.get(route);

  if (!injector) {
    setRouteInjectors(router.config, ((router as any).ngModule as NgModuleRef<any>).injector);

    injector = routeInjectors.get(route);
  }

  return injector;
}

function setRouteInjectors(routes: Route[], injector: Injector) {
  routes.forEach(route => {
    if (isRouteModalData(route.data)) {
      routeInjectors.set(route, injector);
    }

    if (isLazyLoadedRoute(route)) {
      setRouteInjectors(route._loadedConfig.routes, route._loadedConfig.module.injector);
    }
    else if (route.children?.length > 0) {
      setRouteInjectors(route.children, injector);
    }
  });
}
