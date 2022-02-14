import { NgModule } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Routes, RouterModule, Router } from "@angular/router";
import {
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
  }
}