import { Pipe, PipeTransform } from "@angular/core";

import { toStartCase } from "angular-extensions/core";

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
   * @param insertSpaceAfterDigits Should insert a space after digit present in string. E.g. "calculate10e" => "Calculate 10 e"
   * @param capitalizeSingleLetters Should make single letter part present in string. E.g. "pH" => "PH"
   * @returns Formatted string
   */
  public transform(
    value?: string,
    insertSpaceBeforeDigits = false,
    insertSpaceBeforeAbbreviations = false,
    insertSpaceAfterDigits = false,
    capitalizeSingleLetters = false,
  ) {
    return toStartCase.call(value ?? "", {
      insertSpaceBeforeDigits,
      insertSpaceAfterDigits,
      insertSpaceBeforeAbbreviations,
      capitalizeSingleLetters,
    });
  }
}
