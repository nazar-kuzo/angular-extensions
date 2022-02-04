import { startCase } from "lodash-es";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startCase",
})
export class StartCasePipe implements PipeTransform {

  /**
   * Converts string to start case. See {@link startCase} for details.
   * @example "fooBar" => "Foo Bar", "--foo-bar--"" => "Foo Bar"
   * @param value Input string
   * @param insertSpaceBeforeDigits Should inserta space before digit present in string. E.g. "every10Month" => "Every 10 Month"
   * @returns Formatted string
   */
  public transform(value?: string, insertSpaceBeforeDigits = false) {
    let label = startCase(value || "");

    return insertSpaceBeforeDigits
      ? label
      : label.replace(/\s(\d)/g, "$1");
  }
}
