import { switchMap } from "rxjs/operators";
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation,
} from "@angular/core";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker, MatDatepickerContent } from "@angular/material/datepicker";

import { overrideFunction } from "angular-extensions/core";
import { AppMatDatepicker, Field } from "angular-extensions/models";
import { ControlBase, ActionableControl } from "angular-extensions/controls/base-control";
import { AppNgxMatTimepickerComponent, NgxMatTimepickerComponent } from "angular-extensions/controls/time-control";

@Component({
  selector: "datetime-control",
  templateUrl: "./datetime-control.component.html",
  styleUrls: ["./datetime-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeControlComponent extends ControlBase<Date> implements ActionableControl, OnInit {

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  @Input()
  public disableMinute = false;

  @Input()
  public showSeconds = false;

  @Input()
  public format: string;

  @Input()
  public actionButtonVisible = true;

  @Input()
  public actionButtonIcon?: string;

  @Input()
  public actionButtonTooltip?: string;

  @Output()
  public actionButton = new EventEmitter<Field<Date>>();

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
    @Inject(MAT_DATE_FORMATS) dateFormats: MatDateFormats,
  ) {
    super();

    this.format = `${dateFormats.display.dateInput} HH:mm${this.showSeconds ? ":ss" : ""}`;

    // avoid datepicker input blur while popup is open
    elementRef
      .nativeElement
      .addEventListener("blur", event => this.datepickerContent && event.stopPropagation(), { capture: true });
  }

  public ngOnInit() {
    // NgxMatTimepickerComponent updates value without "emitModelToViewChange", so this listener propagate those events instead
    this.field$
      .pipe(switchMap(field => field.control.valueChanges))
      .subscribe(value => {
        for (let callback of this.field.control._onChange) {
          callback(value, false);
        }
      });
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-mdc-form-field-flex").contains(event.target as HTMLElement)) {
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
    overrideFunction(
      this.datepickerContent,
      content => content._handleUserSelection,
      (handleUserSelection, _, event) => {
        handleUserSelection(event);

        let timeValues = [this.timePicker.hour, this.timePicker.minute, this.timePicker.second];

        this.timePicker._dateAdapter.setTimeByDefaultValues(event.value, timeValues);

        this.timePicker._model = event.value;
        this.datePicker._model.add(event.value);
      });
  }
}
