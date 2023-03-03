import type { ComponentRef } from "@angular/core";
import type { MatDateFormats } from "@angular/material/core";
import type { MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatSingleDateSelectionModel } from "@angular/material/datepicker";
import type { NgxMatTimepickerComponent } from "@angular-material-components/datetime-picker";

/**
 * Provides consolidated application's default date formats
 */
export const NGX_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "yyyy-MM-dd",
    monthYearLabel: "MMM yyyy",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM yyyy",
  },
};

export interface AppNgxMatTimepickerComponent<T> extends Omit<NgxMatTimepickerComponent<T>, "_model"> {

  _model: T;

  hour: number;

  minute: number;

  second: number;

  _updateModel(): void;

  _getNextValueByProp(property: string, up?: boolean): number;
}

export interface AppMatDatepicker<T> extends Omit<MatDatepicker<T>, "_model"> {

  _model: MatSingleDateSelectionModel<T>;

  _componentRef?: ComponentRef<MatDatepickerContent<T>>;

  _popupComponentRef?: ComponentRef<MatDatepickerContent<T>>;
}

export interface AppMatDatepickerInput<T> extends Omit<MatDatepickerInput<T>, "_dateFormats"> {
  _dateFormats: MatDateFormats;

  value: T;

  _formatValue(date: T): void;
}
