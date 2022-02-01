import { format as formatDate } from "date-fns";
import { Inject, Pipe, PipeTransform } from "@angular/core";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";

@Pipe({
  name: "dateTime",
})
export class DateTimePipe implements PipeTransform {

  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) {
  }

  public transform(dateTime?: Date, format?: string) {
    return dateTime
      ? formatDate(dateTime, format || `${this.dateFormats.display.dateInput} HH:mm`)
      : "";
  }
}
