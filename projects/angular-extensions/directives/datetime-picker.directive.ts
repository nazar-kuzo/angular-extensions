import { Directive } from "@angular/core";
import { NgxMatDatetimePicker } from "@angular-material-components/datetime-picker";

import { overrideFunction } from "angular-extensions/core";

/**
 * Overrides cancel behavior for DateTime picker
 */
@Directive({
  selector: "ngx-mat-datetime-picker"
})
export class DateTimePickerDirective {

  constructor(
    dateTimePicker: NgxMatDatetimePicker<Date>,
  ) {
    overrideFunction(dateTimePicker, context => context.cancel, (_, context) => {
      context.ok();
    });
  }
}
