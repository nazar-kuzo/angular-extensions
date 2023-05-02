import { NgModule } from "@angular/core";
import { NgxFileControlModule } from "angular-extensions";

import { SharedModule } from "app/shared/shared.module";
import { OtherDashboardRoutingModule } from "./other-dashboard-routing.module";
import { OtherDashboardDetailsModalComponent, OtherDashboardLayoutComponent } from "./components";
import { OtherDashboardApiService } from "./services";


@NgModule({
  imports: [
    SharedModule,
    NgxFileControlModule,
    OtherDashboardRoutingModule,
  ],
  declarations: [
    OtherDashboardLayoutComponent,
    OtherDashboardDetailsModalComponent,
  ],
  providers: [
    OtherDashboardApiService,
  ]
})
export class OtherDashboardModule { }
