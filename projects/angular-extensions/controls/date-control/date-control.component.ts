import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ComponentRef, ElementRef, Inject, Input, OnChanges, ViewChild,
} from "@angular/core";
import {
  MatCalendarHeader, MatCalendarView, MatDatepicker,
  MatDatepickerContent, MatSingleDateSelectionModel,
} from "@angular/material/datepicker";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";
import type { CdkPortalOutlet } from "@angular/cdk/portal";

import { overrideFunction, SimpleChanges } from "angular-extensions/core";
import { ControlBase } from "angular-extensions/controls/base-control";

interface AppMatDatepicker<T> {

  _model: MatSingleDateSelectionModel<T>;

  _componentRef?: ComponentRef<MatDatepickerContent<T>>;

  _popupComponentRef?: ComponentRef<MatDatepickerContent<T>>;
}

@Component({
  selector: "date-control",
  templateUrl: "./date-control.component.html",
  styleUrls: ["./date-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateControlComponent<TOption, TOptionGroup, TFormattedValue, TControlValue>
  extends ControlBase<Date, TOption, TOptionGroup, TFormattedValue, TControlValue>
  implements OnChanges {

  @Input()
  public targetView: "year" | "month" | "day" = "day";

  @Input()
  public startView: MatCalendarView = "month";

  @Input()
  public format: string;

  @Input()
  public clearable: boolean;

  @ViewChild(MatDatepicker, { static: true })
  public datePicker: MatDatepicker<any>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) {
    super();

    this.format = dateFormats.display.dateInput;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public ngOnChanges(changes: SimpleChanges<DateControlComponent<TOption, TOptionGroup, TFormattedValue, TControlValue>>) {
    if (changes.targetView) {
      if (changes.targetView.currentValue == "year") {
        this.startView = "multi-year";
        this.format = "yyyy";
      }
      else if (changes.targetView.currentValue == "month") {
        this.startView = "year";
        this.format = this.dateFormats.display.monthYearA11yLabel;
      }
      else if (changes.targetView.currentValue == "day") {
        this.startView = "month";
        this.format = this.dateFormats.display.dateInput;
      }

      this.changeDetectorRef.markForCheck();
    }
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-form-field-flex").contains(event.target as HTMLElement)) {
      this.datePicker.open();
    }

    event.preventDefault();
  }

  public dateSelected(date: Date, datePicker: MatDatepicker<Date>, isTargetView = false) {
    if (isTargetView) {
      (this.datePicker as any as AppMatDatepicker<Date>)._model.add(date.withoutTimezone());

      datePicker.close();

      // hide content since we cannot prevent currentView showing next view
      if (this.getDatepickerContent(datePicker as any)) {
        (this.getDatepickerContent(datePicker as any)._elementRef.nativeElement as HTMLElement).style.display = "none";
      }

      this.changeDetectorRef.markForCheck();
    }
  }

  public viewChanged(view: MatCalendarView, datePicker: MatDatepicker<Date>) {
    // fix issue when clicking on year selector it shows "month" view which is not correct
    if (this.targetView == "month" && view == "month") {
      if (this.getDatepickerContent(datePicker as any)) {
        this.getDatepickerContent(datePicker as any)._calendar.currentView = "multi-year";
      }

      this.changeDetectorRef.markForCheck();
    }
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.control.setValue(null);

      this.blur();

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }

  public datePickerOpened() {
    let datePickerContent = this.getDatepickerContent(this.datePicker as any);

    setTimeout(() => {
      this.tryPatchPeriodButton(datePickerContent);
    });
  }

  public blur() {
    (this.datePicker.datepickerInput as any)._formField._control.focused = false;
  }

  private getDatepickerContent(datePicker: AppMatDatepicker<Date>): MatDatepickerContent<Date> | null {
    return (datePicker._componentRef || datePicker._popupComponentRef)?.instance;
  }

  private tryPatchPeriodButton(datePickerContent: MatDatepickerContent<Date, Date>) {
    let calendarHeader = (((datePickerContent
      ._calendar
      ._calendarHeaderPortal as any)
      ._attachedHost as CdkPortalOutlet)
      .attachedRef as ComponentRef<MatCalendarHeader<Date>>)
      .instance;

    overrideFunction(
      calendarHeader,
      header => header.currentPeriodClicked,
      currentPeriodClicked => {
        if (this.targetView == "year") {
        }
        else if (this.targetView == "month") {
          calendarHeader.calendar.currentView = calendarHeader.calendar.currentView == "year" ? "multi-year" : "year";
        }
        else {
          currentPeriodClicked();
        }
      });
  }
}
