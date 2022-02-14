import { Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { extendRouterConfigWithStatefulModals } from "angular-extensions/core/material";
import { ControlsModule } from "angular-extensions";

import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { HomePageComponent } from "./components";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
  ],
  declarations: [
    AppLayoutComponent,
    HomePageComponent,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ControlsModule,
  ],
})
export class SharedModule {

  constructor(
    router: Router,
    injector: Injector,
  ) {
    extendRouterConfigWithStatefulModals(router, injector);
  }
}
