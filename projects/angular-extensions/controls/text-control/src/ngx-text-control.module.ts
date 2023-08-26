import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { TextControlComponent } from "./text-control.component";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
  ],
  declarations: [
    TextControlComponent,
  ],
  exports: [
    CommonModule,
    NgxBaseControlModule,

    TextControlComponent,
  ]
})
export class NgxTextControlModule { }
