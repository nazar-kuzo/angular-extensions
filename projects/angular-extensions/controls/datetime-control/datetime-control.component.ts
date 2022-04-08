import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, ViewEncapsulation } from "@angular/core";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";

import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "datetime-control",
  templateUrl: "./datetime-control.component.html",
  styleUrls: ["./datetime-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeControlComponent extends ControlBase<Date> {

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  @Input()
  public disableMinute = false;

  @Input()
  public showSeconds = true;

  @Input()
  public format: string;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) dateFormats: MatDateFormats,
  ) {
    super();

    this.format = `${dateFormats.display.dateInput} HH:mm:ss`;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.control.enabled && this.field.value != null) {
      this.field.value = null as any;

      this.field.control.markAsTouched();

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
