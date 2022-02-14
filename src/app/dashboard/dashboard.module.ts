import { NgModule } from "@angular/core";

import { SharedModule } from "app/shared/shared.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardLayoutComponent } from "./components";
import { DashboardApiService } from "./services";


@NgModule({
  imports: [
    SharedModule,
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
