import { startCase } from "lodash-es";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startCase",
})
export class StartCasePipe implements PipeTransform {

  public transform(value?: string, insertSpaceBeforeDigits = false) {
    let label = startCase(value || "");

    return insertSpaceBeforeDigits
      ? label
      : label.replace(/\s(\d)/g, "$1");
  }
}
