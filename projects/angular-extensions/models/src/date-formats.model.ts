import { format } from "date-fns";
import { Type } from "@angular/core";
import { NativeDateAdapter, MatDateFormats, DateAdapter } from "@angular/material/core";

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
 export interface NgxDateTimeConfig {

  /**
   * Date adapter used between AngularMaterial and NgxMatDatePicker, by default {@link NgxDateAdapter}
   */
  dateAdapterType: Type<DateAdapter<Date>>;

  /**
   * Date locale, by default "en-GB"
   */
  dateLocale: string;

  /**
   * Date/time formats, by default {@link NGX_DATE_FORMATS}
   */
  dateFormats: MatDateFormats;
}

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

export class NgxDateAdapter extends NativeDateAdapter {

  public getFirstDayOfWeek(): number {
    return 1;
  }

  public format(date: Date, displayFormat: string): string {
    return format(date, displayFormat);
  }
}

export const dateTimeConfigDefaults: NgxDateTimeConfig = {
  dateFormats: NGX_DATE_FORMATS,
  dateAdapterType: NgxDateAdapter,
  dateLocale: "en-GB",
};
