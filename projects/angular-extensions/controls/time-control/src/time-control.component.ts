import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDatepicker, MatDatepickerContent } from "@angular/material/datepicker";

import { ControlBase } from "angular-extensions/controls/base-control";
import { overrideFunction } from "angular-extensions/core";
import { AppMatDatepicker } from "angular-extensions/models";

import { NgxMatTimepickerComponent } from "./ngx-mat-timepicker/timepicker.component";

export interface AppNgxMatTimepickerComponent<T> extends Omit<NgxMatTimepickerComponent<T>, "_model"> {

  _model: T;

  hour: number;

  minute: number;

  second: number;

  _updateModel(): void;

  _getNextValueByProp(property: string, up?: boolean): number;
}

function addTimepickerNullableModelSupport() {
  // disable dead-loop of model => view and view <= model change events
  overrideFunction(
    NgxMatTimepickerComponent.prototype,
    timePicker => timePicker.ngOnInit,
    () => { });

  // ensure timepicker model is set when user performs interaction
  overrideFunction(
    NgxMatTimepickerComponent.prototype as any as AppNgxMatTimepickerComponent<any>,
    timePicker => timePicker._updateModel,
    (updateModel, timePicker) => {
      if (!timePicker._model) {
        timePicker._model = new Date();
      }

      return updateModel();
    });

  overrideFunction(
    NgxMatTimepickerComponent.prototype as any as AppNgxMatTimepickerComponent<any>,
    timePicker => timePicker.writeValue,
    (writeValue, timePicker, value) => {
      if (!value) {
        timePicker._model = value;

        Object.values(timePicker.form.controls).forEach((control, index) => {
          control.setValue(String(timePicker.defaultTime?.[index] || 0).padStart(2, "0"));
        });
      }
      else {
        writeValue(value);
      }
    });
}

function improveTimepickerStepper() {
  overrideFunction(
    NgxMatTimepickerComponent.prototype as any as AppNgxMatTimepickerComponent<any>,
    timePicker => timePicker._getNextValueByProp,
    (getNextValueByProp, timePicker, property, up) => {
      let keyProp = property[0].toUpperCase() + property.slice(1);

      let result = getNextValueByProp(property, up);

      if (up != null) {
        result -= result % (timePicker as any)[`step${keyProp}`] as number;
      }

      return result;
    });
}

improveTimepickerStepper();

addTimepickerNullableModelSupport();

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
    if (!this.timePicker._model) {
      this.timePicker._model = new Date();
    }
  }
}
