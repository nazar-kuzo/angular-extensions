import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import {
  addGetLastSuccessfulNavigation,
  addOnRouteRetainedEvent,
  SequentialRouteData,
  extendParamMapWithTypedParameters, extendRouteConfigWithNavigationExtras, SequentialGuard,
} from "angular-extensions";

import { FirstGuard, SecondGuard } from "./core/guards";
import { HomePageComponent } from "./shared/components/home-page/home-page.component";

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
  },
  {
    path: "dashboard",
    canActivate: [SequentialGuard],
    canActivateChild: [SequentialGuard],
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
    data: {
      canActivateSequence: [FirstGuard, SecondGuard],
      canActivateChildSequence: [FirstGuard, SecondGuard],
    } as SequentialRouteData
  },
  {
    path: "other-dashboard",
    canActivate: [SequentialGuard],
    canActivateChild: [SequentialGuard],
    loadChildren: () => import("./other-dashboard/other-dashboard.module").then(m => m.OtherDashboardModule),
    data: {
      canActivateSequence: [FirstGuard, SecondGuard],
      canActivateChildSequence: [FirstGuard, SecondGuard],
    } as SequentialRouteData
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor(
    router: Router,
  ) {
    extendRouteConfigWithNavigationExtras(router);

    extendParamMapWithTypedParameters(router);

    addOnRouteRetainedEvent(router);

    addGetLastSuccessfulNavigation(router);
  }
}
