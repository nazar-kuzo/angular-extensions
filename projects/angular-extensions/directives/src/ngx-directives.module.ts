import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomPaginatorDirective } from "./custom-paginator.directive";
import { DateTimePickerDirective } from "./datetime-picker.directive";
import { FormatDirective } from "./format.directive";
import { TooltipImprovementsDirective } from "./tooltip-improvements.directive";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ],
  exports: [
    CommonModule,

    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ]
})
export class NgxDirectivesModule { }
