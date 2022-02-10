import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { TextAreaControlComponent } from "./textarea-control.component";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
  ],
  declarations: [
    TextAreaControlComponent,
  ],
  exports: [
    CommonModule,
    NgxBaseControlModule,

    TextAreaControlComponent,
  ]
})
export class NgxTextAreaControlModule { }
