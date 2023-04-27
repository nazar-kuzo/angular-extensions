import { startCase } from "lodash-es";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startCase",
})
export class StartCasePipe implements PipeTransform {

  /**
   * Converts string to start case. See {@link startCase} for details.
   *
   * @example "fooBar" => "Foo Bar", "--foo-bar--"" => "Foo Bar"
   * @param value Input string
   * @param insertSpaceBeforeDigits Should insert a space before digit present in string. E.g. "every10Month" => "Every 10 Month"
   * @param insertSpaceBeforeAbbreviations Should insert a space before abbreviation present in string. E.g. "FaceID" => "Face ID"
   * @returns Formatted string
   */
  public transform(value?: string, insertSpaceBeforeDigits = false, insertSpaceBeforeAbbreviations = false) {
    let label = startCase(value || "");

    if (!insertSpaceBeforeDigits) {
      label = label.replace(/\s(\d)/g, "$1");
    }

    if (!insertSpaceBeforeAbbreviations) {
      label = label.replace(/\s([A-Z]{2,})/g, "$1");
    }

    return label;
  }
}
