import { Directive, ElementRef, OnDestroy } from "@angular/core";

@Directive({
  selector: "[preventClickOnSelection]",
})
export class PreventClickOnSelectionDirective implements OnDestroy {

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
    elementRef.nativeElement.addEventListener("click", this.clickHandler, { capture: true });
  }

  public ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener("click", this.clickHandler, { capture: true });
  }

  private clickHandler = (event: MouseEvent) => {
    if (!!document.getSelection()?.toString()?.replace("\n", "")) {
      event.stopPropagation();
    }
  };
}
