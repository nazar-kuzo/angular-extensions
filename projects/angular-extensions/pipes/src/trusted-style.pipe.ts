import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Pipe({
  name: "trustedStyle"
})
export class TrustedStylePipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * @param html HTML string with inline styles or <styles> tag
   * @returns SafeStyle string, details {@link SafeStyle}
   */
  public transform(html: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(html);
  }
}
