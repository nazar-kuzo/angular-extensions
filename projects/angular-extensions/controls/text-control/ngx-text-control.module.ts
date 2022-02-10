import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMaskModule } from "ngx-mask";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { TextControlComponent } from "./text-control.component";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    NgxMaskModule.forChild(),
  ],
  declarations: [
    TextControlComponent,
  ],
  exports: [
    CommonModule,
    NgxBaseControlModule,
    NgxMaskModule,

    TextControlComponent,
  ]
})
export class NgxTextControlModule { }
