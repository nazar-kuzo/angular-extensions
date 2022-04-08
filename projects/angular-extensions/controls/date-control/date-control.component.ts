import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, Inject, Input, OnChanges } from "@angular/core";
import { MatCalendarView, MatDatepicker, MatDatepickerContent } from "@angular/material/datepicker";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";

import { SimpleChanges } from "angular-extensions/core";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "date-control",
  templateUrl: "./date-control.component.html",
  styleUrls: ["./date-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateControlComponent extends ControlBase<Date> implements OnChanges {

  @Input()
  public targetView: "year" | "month" | "day" = "day";

  @Input()
  public startView: MatCalendarView = "month";

  @Input()
  public format: string;

  @Input()
  public clearable: boolean;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) {
    super();

    this.format = dateFormats.display.dateInput;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public ngOnChanges(changes: SimpleChanges<DateControlComponent>) {
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

  public dateSelected(date: Date, datePicker: MatDatepicker<Date>, isTargetView = false) {
    if (isTargetView) {
      this.field.value = date.asUtcDate();

      datePicker.close();

      // hide content since we cannot prevent currentView showing next view
      this.getCalendarElement(datePicker).style.display = "none";

      this.changeDetectorRef.markForCheck();
    }
  }

  public viewChanged(view: MatCalendarView, datePicker: MatDatepicker<Date>) {
    // fix issue when clicking on year selector it shows "month" view which is not correct
    if (this.targetView == "month" && view == "month") {
      this.getCalendar(datePicker).currentView = "multi-year";

      this.changeDetectorRef.markForCheck();
    }
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.value = null as any;

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }

  private getCalendar(datePicker: MatDatepicker<Date>) {
    return ((datePicker as any)._popupComponentRef as ComponentRef<MatDatepickerContent<Date>>)
      .instance
      ._calendar;
  }

  private getCalendarElement(datePicker: MatDatepicker<Date>) {
    return ((datePicker as any)._popupComponentRef as ComponentRef<MatDatepickerContent<Date>>)
      .instance
      ._elementRef
      .nativeElement as HTMLElement;
  }
}
