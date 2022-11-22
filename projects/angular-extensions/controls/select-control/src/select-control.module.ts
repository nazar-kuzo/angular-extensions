import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { SelectControlComponent } from "./select-control.component";
import { CustomMatOptionDirective } from "./custom-mat-option.directive";

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    NgxBaseControlModule,
  ],
  exports: [
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxBaseControlModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    SelectControlComponent,
  ],
  declarations: [
    SelectControlComponent,
    CustomMatOptionDirective,
  ]
})
export class NgxSelectControlModule { }
