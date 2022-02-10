import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "trustedHtml"
})
export class TrustedHtmlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  /**
   * Bypass security and trust the given value to be safe HTML.
   * Only use this when the bound HTML is unsafe (e.g. contains script tags) and the code should be executed.
   *
   * @param html HTML string
   * @returns SafeHtml string, details {@link SafeHtml}
   */
  public transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
