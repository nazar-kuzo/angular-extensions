import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMaskModule } from "ngx-mask";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { TextControlComponent } from "./text-control.component";
import { NgxMaskDirective } from "./mask.directive";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    TextControlComponent,
    NgxMaskDirective,
  ],
  exports: [
    CommonModule,
    NgxBaseControlModule,
    NgxMaskModule,

    TextControlComponent,
  ]
})
export class NgxTextControlModule { }
