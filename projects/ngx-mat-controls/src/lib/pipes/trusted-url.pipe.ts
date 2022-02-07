import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({
  name: "trustedUrl"
})
export class TrustedUrlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
  ) {
  }

  /**
   * Bypass security and trust the given value to be a safe style URL,
   * i.e. a value that can be used in hyperlinks or <img src>.
   * @param url URL string
   * @param isResourceUrl Indicated whether URL string is resource URL
   * @returns SafeUrl string, details: {@link SafeUrl}
   */
  public transform(url: string, isResourceUrl?: boolean): SafeUrl {
    return isResourceUrl
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
