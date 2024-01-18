import { Directive, ElementRef, Input, OnInit, OnDestroy, HostListener } from "@angular/core";
import { MatTooltip } from "@angular/material/tooltip";

@Directive({
  selector: "[matTooltip],[matTooltipDisabled],[matTooltipEnabled]",
})
export class MatEnhancedTooltipDirective extends MatTooltip implements OnInit, OnDestroy {

  /**
   * Tooltip message shown only when element (button, link etc.) is enabled
   */
  @Input()
  public matTooltipEnabled: string;

  /**
   * Tooltip message shown only when element (button, link etc.) is disabled
   */
  @Input()
  public matTooltipDisabled: string;

  @Input()
  public override set disabled(disabled: boolean) {
    // tooltip should be always enabled
    super.disabled = false;

    this.tooltipDisabled = disabled;

    setTimeout(() => {
      this.elementRef.nativeElement.classList.toggle("disabled", disabled);

      if (this.elementRef.nativeElement.attributes.getNamedItem("disabled")) {
        this.elementRef.nativeElement.attributes.removeNamedItem("disabled");
      }
    });
  }

  public override get message() {
    return this.tooltipDisabled ? this.matTooltipDisabled : this.matTooltipEnabled;
  }

  public override set message(value: string) {
    super.message = value;
  }

  private tooltipDisabled: boolean;

  private get elementRef() {
    return (this as any)._elementRef as ElementRef<HTMLElement>;
  }

  /**
   * Prevents text selection when long-press on tooltip
   */
  @HostListener("touchstart")
  public touchStart() {
    document.body.classList.add("no-selection");
  }

  /**
   * Prevents text selection when long-press on tooltip
   */
  @HostListener("touchend")
  public touchEnd() {
    document.body.classList.remove("no-selection");
  }

  public ngOnInit() {
    this.elementRef.nativeElement.addEventListener("click", event => {
      if (this.tooltipDisabled) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, { capture: true });
  }
}
