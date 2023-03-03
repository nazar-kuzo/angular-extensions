import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomPaginatorDirective } from "./custom-paginator.directive";
import { FormatDirective } from "./format.directive";
import { TooltipImprovementsDirective } from "./tooltip-improvements.directive";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CustomPaginatorDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ],
  exports: [
    CommonModule,

    CustomPaginatorDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ]
})
export class NgxDirectivesModule { }
