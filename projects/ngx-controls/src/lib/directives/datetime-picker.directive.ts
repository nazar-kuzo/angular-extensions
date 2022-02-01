import { Directive } from "@angular/core";
import { NgxMatDatetimePicker } from "@angular-material-components/datetime-picker";

import { overrideFunction } from "../extensions";

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
