import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "time-control",
  templateUrl: "./time-control.component.html",
  styleUrls: ["./time-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeControlComponent<TValue> extends ControlBase<TValue> {

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    ) {
    super();

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.value = null;

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
