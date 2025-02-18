import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatPseudoCheckboxModule } from "@angular/material/core";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { SelectControlComponent } from "./select-control.component";
import { CustomMatOptionDirective } from "./custom-mat-option.directive";
import { MatSelectSearchComponentDirective } from "./ngx-mat-select-search.directive";
import { TruncateDirective } from "./truncate.directive";

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatPseudoCheckboxModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    NgxBaseControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxBaseControlModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    SelectControlComponent,
    NgxDirectivesModule,
  ],
  declarations: [
    SelectControlComponent,
    CustomMatOptionDirective,
    MatSelectSearchComponentDirective,
    TruncateDirective,
  ]
})
export class NgxSelectControlModule { }
