import { NgxMatDatetimePicker } from "@angular-material-components/datetime-picker";
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, Inject, Input, ViewChild, ViewEncapsulation,
} from "@angular/core";
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

  @ViewChild(NgxMatDatetimePicker, { static: true })
  public dateTimePicker: NgxMatDatetimePicker<any>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) dateFormats: MatDateFormats,
  ) {
    super();

    this.format = `${dateFormats.display.dateInput} HH:mm:ss`;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-form-field-flex").contains(event.target as HTMLElement)) {
      this.dateTimePicker.open();
    }

    event.preventDefault();
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.control.enabled && this.field.value != null) {
      this.field.control.setValue(null);

      this.field.control.markAsTouched({ onlySelf: true });

      (this.dateTimePicker.datepickerInput as any)._formField._control.focused = false;

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
