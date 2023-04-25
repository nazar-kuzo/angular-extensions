import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "app/shared/components";

import { OtherDashboardDetailsModalComponent, OtherDashboardLayoutComponent } from "./components";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: OtherDashboardLayoutComponent,
        children: [
          {
            path: "details",
            data: {
              modalComponent: OtherDashboardDetailsModalComponent
            },
            children: [],
          },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherDashboardRoutingModule { }
