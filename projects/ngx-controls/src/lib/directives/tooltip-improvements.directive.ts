import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[matTooltip]"
})
export class TooltipImprovementsDirective {

  // prevents text selection when long-press on tooltip
  @HostListener("touchstart")
  public touchStart() {
    document.body.classList.add("no-selection");
  }

  // prevents text selection when long-press on tooltip
  @HostListener("touchend")
  public touchEnd() {
    document.body.classList.remove("no-selection");
  }
}
