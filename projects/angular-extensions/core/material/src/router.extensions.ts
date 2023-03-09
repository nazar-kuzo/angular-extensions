import { MatDialog } from "@angular/material/dialog";
import { ApplicationRef, Injector, Type, ViewContainerRef } from "@angular/core";
import {
  ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd,
  NavigationStart, Router, LoadedRouterConfig, IsActiveMatchOptions, GuardsCheckEnd,
} from "@angular/router";

import { flatten } from "angular-extensions/core";

let statefulModalsInitialized = false;

const routeMatchOptions: IsActiveMatchOptions = {
  paths: "exact",
  matrixParams: "exact",
  queryParams: "ignored",
  fragment: "ignored"
};

interface ModalNavigationExtras {
  shouldOpenModal?: boolean;
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
  if (statefulModalsInitialized) {
    return;
  }

  router.events.subscribe(event => {
    if (event instanceof ActivationEnd && event.snapshot.data?.modalComponent) {
      let shouldOpenModal = router.getLastSuccessfulNavigation() == null ||
        !router.isActive(router.getCurrentNavigation().initialUrl, routeMatchOptions);

      if (!shouldOpenModal) {
        return;
      }

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
        let shouldCloseModal = !router.isActive(router.getCurrentNavigation().extractedUrl, routeMatchOptions);

        if (routerEvent instanceof GuardsCheckEnd && routerEvent.shouldActivate && shouldCloseModal) {
          dialogRef.close();
          subscription.unsubscribe();
        }
      });
    }
  });

  statefulModalsInitialized = true;
}

function getActivatedRouteInjector(snapshot: ActivatedRouteSnapshot): Injector {
  let injector: Injector;

  do {
    injector = ((snapshot.routeConfig as any)?._loadedConfig as LoadedRouterConfig)?.module.injector;

    snapshot = snapshot.parent as ActivatedRouteSnapshot;

  } while (!injector && snapshot.parent);

  return injector;
}
