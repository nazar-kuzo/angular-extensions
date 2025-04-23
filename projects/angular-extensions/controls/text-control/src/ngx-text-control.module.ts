import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from "ngx-mask";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { TextControlComponent } from "./text-control.component";
import { AppMaskDirective } from "./mask.directive";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  declarations: [
    TextControlComponent,
    AppMaskDirective,
  ],
  providers: [
    provideNgxMask(),
  ],
  exports: [
    CommonModule,
    NgxBaseControlModule,

    TextControlComponent,
  ]
})
export class NgxTextControlModule { }
