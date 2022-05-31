import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "app/shared/components";

import { DashboardDetailsModalComponent, DashboardLayoutComponent } from "./components";

const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: DashboardLayoutComponent,
        children: [
          {
            path: "details",
            data: {
              modalComponent: DashboardDetailsModalComponent
            }
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
export class DashboardRoutingModule { }
