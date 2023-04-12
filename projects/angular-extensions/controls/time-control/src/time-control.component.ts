import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDatepicker, MatDatepickerContent } from "@angular/material/datepicker";
import { NgxMatTimepickerComponent } from "@angular-material-components/datetime-picker";

import { ControlBase } from "angular-extensions/controls/base-control";
import { AppMatDatepicker, AppNgxMatTimepickerComponent } from "angular-extensions/models";

@Component({
  selector: "time-control",
  templateUrl: "./time-control.component.html",
  styleUrls: ["./time-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeControlComponent<TValue> extends ControlBase<TValue, any, any, any, Date> {

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  @Input()
  public disableMinute = false;

  @Input()
  public showSeconds = false;

  @Input()
  public format = "HH:mm";

  @ViewChild(MatDatepicker, { static: true })
  public datePicker: AppMatDatepicker<Date>;

  @ViewChild(NgxMatTimepickerComponent, { static: true })
  public timePicker: AppNgxMatTimepickerComponent<Date>;

  private get datepickerContent(): MatDatepickerContent<Date> | null {
    return (this.datePicker._componentRef || this.datePicker._popupComponentRef)?.instance;
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();

    // avoid datepicker input blur while popup is open
    elementRef
      .nativeElement
      .addEventListener("blur", event => this.datepickerContent && event.stopPropagation(), { capture: true });
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-form-field-flex").contains(event.target as HTMLElement)) {
      this.datePicker.open();
    }

    event.preventDefault();
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.control.enabled && this.field.value != null) {
      this.field.control.setValue(null);

      this.field.control.markAsTouched({ onlySelf: true });

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }
    else {
      this.focus();
    }
  }

  public datePickerOpened() {
    if (!this.timePicker._model) {
      this.timePicker._model = new Date();
    }
  }
}
