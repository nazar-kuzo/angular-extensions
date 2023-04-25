import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatSnackBarConfig, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { enableEnhancedTooltipDisplay, extendRouterConfigWithStatefulModals } from "angular-extensions/core/material";
import { NgxControlsModule } from "angular-extensions";

import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { HomePageComponent } from "./components";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    NgxControlsModule.configure({  }),
  ],
  declarations: [
    AppLayoutComponent,
    HomePageComponent,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 1000 * 50,
        verticalPosition: "top",
        horizontalPosition: "right",
      } as MatSnackBarConfig
    },
  ],
  exports: [
    CommonModule,
    RouterModule,
    NgxControlsModule,
  ],
})
export class SharedModule {

  constructor(
    router: Router,
  ) {
    extendRouterConfigWithStatefulModals(router);

    enableEnhancedTooltipDisplay();
  }
}
