import type { MatDateFormats } from "@angular/material/core";

/**
 * Provides consolidated application's default date formats
 */
export const MAT_DATE_APP_FORMATS: MatDateFormats = {
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
