import { Component, ComponentRef, ElementRef, Inject, Input, OnChanges } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { MatCalendarView, MatDatepicker, MatDatepickerContent } from "@angular/material/datepicker";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";

import { SimpleChanges } from "angular-extensions/core";
import { Field } from "angular-extensions/models";

@Component({
  selector: "date-control",
  templateUrl: "./date-control.component.html",
  styleUrls: ["./date-control.component.scss"]
})
export class DateControlComponent implements OnChanges {

  @Input()
  public field: Field<Date>;

  @Input()
  public fieldClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public targetView: "month" | "day" = "day";

  @Input()
  public startView: MatCalendarView = "month";

  @Input()
  public format: string;

  @Input()
  public clearable: boolean;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) {
    this.format = dateFormats.display.dateInput;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public ngOnChanges(changes: SimpleChanges<DateControlComponent>) {
    if (changes.targetView) {
      if (changes.targetView.currentValue == "month") {
        this.startView = "year";
        this.format = this.dateFormats.display.monthYearA11yLabel;
      }
      else if (changes.targetView.currentValue == "day") {
        this.startView = "month";
        this.format = this.dateFormats.display.dateInput;
      }
    }
  }

  public monthSelected(month: Date, datePicker: MatDatepicker<Date>) {
    if (this.targetView == "month") {
      this.field.value = month.asUtcDate();

      datePicker.close();

      // hide content since we cannot prevent currentView showing month view
      this.getCalendarElement(datePicker).style.display = "none";
    }
  }

  public viewChanged(view: MatCalendarView, datePicker: MatDatepicker<Date>) {
    // fix issue when clicking on year selector it shows "month" view which is not correct
    if (this.targetView == "month" && view == "month") {
      this.getCalendar(datePicker).currentView = "multi-year";
    }
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.value = null as any;

      event.preventDefault();
      event.stopImmediatePropagation();
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
