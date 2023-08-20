import { NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Routes, RouterModule, Router } from "@angular/router";
import {
  addGetLastSuccessfulNavigation,
  addOnRouteRetainedEvent, bindRouteConfigTitle,
  extendParamMapWithTypedParameters, extendRouteConfigWithNavigationExtras,
} from "angular-extensions";

import { HomePageComponent } from "./shared/components/home-page/home-page.component";

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
  },
  {
    path: "dashboard",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
  },
  {
    path: "other-dashboard",
    loadChildren: () => import("./other-dashboard/other-dashboard.module").then(m => m.OtherDashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor(
    router: Router,
    title: Title,
  ) {
    extendRouteConfigWithNavigationExtras(router);

    bindRouteConfigTitle(router, title, "Angular Extensions");

    extendParamMapWithTypedParameters(router);

    addOnRouteRetainedEvent(router);

    addGetLastSuccessfulNavigation(router);
  }
}
