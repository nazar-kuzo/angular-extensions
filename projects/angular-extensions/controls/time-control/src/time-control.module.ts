import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxDateTimeControlModule } from "angular-extensions/controls/datetime-control";
import { NgxDirectivesModule } from "angular-extensions/directives";

import { TimeControlComponent } from "./time-control.component";

@NgModule({
  imports: [
    CommonModule,
    NgxMatTimepickerModule,

    NgxBaseControlModule,
    NgxDateTimeControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    NgxMatTimepickerModule,

    NgxBaseControlModule,
    NgxDateTimeControlModule,
    NgxDirectivesModule,

    TimeControlComponent,
  ],
  declarations: [
    TimeControlComponent,
  ]
})
export class NgxTimeControlModule { }
