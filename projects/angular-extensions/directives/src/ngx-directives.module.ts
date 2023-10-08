import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomPaginatorDirective } from "./custom-paginator.directive";
import { FormatDirective } from "./format.directive";
import { MatEnhancedTooltipDirective } from "./mat-enhanced-tooltip.directive";
import { PreventClickOnSelectionDirective } from "./prevent-click-on-selection.directive";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CustomPaginatorDirective,
    FormatDirective,
    MatEnhancedTooltipDirective,
    PreventClickOnSelectionDirective,
  ],
  exports: [
    CommonModule,

    CustomPaginatorDirective,
    FormatDirective,
    MatEnhancedTooltipDirective,
    PreventClickOnSelectionDirective,
  ]
})
export class NgxDirectivesModule { }
