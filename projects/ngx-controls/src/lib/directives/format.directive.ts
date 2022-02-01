import { Directive, Input, OnInit, Optional } from "@angular/core";
import { MatDatepickerInput } from "@angular/material/datepicker";
import { MatDateFormats } from "@angular/material/core";
import { NgxMatDatetimeInput } from "@angular-material-components/datetime-picker";

interface DatePickerAdapter {
  _dateFormats: MatDateFormats;

  value: Date;

  _formatValue(date: Date): void;
}

@Directive({
  selector: "input[format]"
})
export class FormatDirective implements OnInit {

  @Input()
  public format: string;

  private get picker(): DatePickerAdapter {
    return (this.datePicker || this.dateTimePicker) as any;
  }

  constructor(
    @Optional() private datePicker: MatDatepickerInput<Date>,
    @Optional() private dateTimePicker: NgxMatDatetimeInput<Date>,
  ) {
  }

  public ngOnInit() {
    this.picker._dateFormats = Object.assign(
      {},
      this.picker._dateFormats,
      {
        display: { dateInput: this.format }
      } as MatDateFormats);

    // trigger formatting for existing value
    if (this.picker.value) {
      this.picker._formatValue(this.picker.value);
    }
  }
}
