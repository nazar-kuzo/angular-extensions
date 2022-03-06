import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardLayoutComponent } from "./components";
import { DashboardApiService } from "./services";
import { NgxFileControlModule } from "angular-extensions";


@NgModule({
  imports: [
    SharedModule,
    NgxFileControlModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboardLayoutComponent,
  ],
  providers: [
    DashboardApiService,
  ]
})
export class DashboardModule { }
