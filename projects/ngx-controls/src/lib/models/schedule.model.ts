import { DecimalPipe } from "@angular/common";
import { format } from "date-fns";

export enum TimePart {
  Second,

  Minute,

  Hour,

  Day,

  Month,
}

export enum DayOfWeek {
  Monday = 1,

  Tuesday = 2,

  Wednesday = 3,

  Thursday = 4,

  Friday = 5,

  Saturday = 6,

  Sunday = 0,
}

export class TimeOfDay {

  public hour: number;

  public minute: number;

  public second?: number;

  constructor(timeOfDay: Partial<TimeOfDay>) {
    this.hour = timeOfDay?.hour || 0;
    this.minute = timeOfDay?.minute || 0;
    this.second = timeOfDay?.second || 0;
  }

  public static toTimeString(timeOfDay: TimeOfDay) {
    let decimalPipe = new DecimalPipe("en-GB");

    return `${decimalPipe.transform(timeOfDay.hour, "2.0")}:${decimalPipe.transform(timeOfDay.minute, "2.0")}`;
  }

  public static toLocalDate(timeOfDay: TimeOfDay) {
    return new Date(`${format(new Date(), "yyyy-MM-dd")}T${TimeOfDay.toTimeString(timeOfDay)}:00`);
  }

  public static parse(value: string | Date) {
    if (value instanceof Date) {
      return new TimeOfDay({
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
      });
    }
    else {
      let [hour, minute, second] = value?.split(":") || ["0", "0", "0"];

      return new TimeOfDay({
        hour: Number.parseInt(hour, 10),
        minute: Number.parseInt(minute, 10),
        second: Number.parseInt(second, 10),
      });
    }
  }

  public toLocal() {
    let localTime = new Date(`${format(new Date(), "yyyy-MM-dd")}T${TimeOfDay.toTimeString(this)}:00Z`);

    return new TimeOfDay({
      hour: localTime.getHours(),
      minute: localTime.getMinutes()
    });
  }

  public toUtc() {
    let utcTime = new Date(`${format(new Date(), "yyyy-MM-dd")}T${TimeOfDay.toTimeString(this)}:00`).toUtcDate();

    return new TimeOfDay({
      hour: utcTime.getHours(),
      minute: utcTime.getMinutes()
    });
  }
}

export interface DailySchedule {
  days: DayOfWeek[];

  timeOfDay: TimeOfDay;
}
