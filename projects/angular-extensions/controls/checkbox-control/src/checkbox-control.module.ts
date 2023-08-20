import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    MatCheckboxModule,
  ],
  exports: [
    NgxBaseControlModule,
    MatCheckboxModule,
    CheckboxControlComponent,
  ],
  declarations: [
    CheckboxControlComponent,
  ]
})
export class NgxCheckboxControlModule { }
