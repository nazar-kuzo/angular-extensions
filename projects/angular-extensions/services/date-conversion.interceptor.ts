import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";

import { parseDateProperty, parseDates } from "angular-extensions/core";

/**
 * Parses all date-like strings into actual Date objects
 */
@Injectable()
export class DateConversionInterceptor implements HttpInterceptor {

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(request)
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (typeof event.body == "string") {
            parseDateProperty(event, "body");
          }
          else if (typeof event.body == "object") {
            parseDates(event.body);
          }
        }
      }));
  }
}
