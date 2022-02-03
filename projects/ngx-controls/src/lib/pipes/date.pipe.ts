import { format as formatDate } from "date-fns";
import { Inject, Pipe, PipeTransform } from "@angular/core";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";

@Pipe({
  name: "date",
})
export class DatePipe implements PipeTransform {

  constructor(
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
  ) {
  }

  public transform(date?: Date, format?: string) {
    return date
      ? formatDate(date, format || this.dateFormats.display.dateInput)
      : "";
  }
}
