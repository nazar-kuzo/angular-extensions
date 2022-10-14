import { tap } from "rxjs/operators";
import { Inject, Injectable, Optional } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";

import { parseDateProperty, parseDates } from "angular-extensions/core";
import { API_CONFIG, ApiConfig } from "./api.service";

/**
 * Parses all date-like strings into actual Date objects
 */
@Injectable()
export class DateConversionInterceptor implements HttpInterceptor {

  constructor(
    @Optional() @Inject(API_CONFIG) private config: ApiConfig,
  ) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next
      .handle(request)
      .pipe(tap(event => {
        if (event instanceof HttpResponse) {
          if (typeof event.body == "string") {
            parseDateProperty(event, "body");
          }
          else if (typeof event.body == "object") {
            parseDates(event.body, this.config.dateConversionExcludePaths);
          }
        }
      }));
  }
}
