import { HttpParams } from "@angular/common/http";

/**
 * Generic representation of Angular SimpleChange
 */
export type SimpleChange<TValue> = {
  previousValue: TValue;
  currentValue: TValue;
  firstChange: boolean;

  isFirstChange(): boolean;
};

/**
 * Generic representation of Angular SimpleChanges
 */
export type SimpleChanges<TComponent> = {
  [key in keyof TComponent]?: SimpleChange<TComponent[key]>;
};

/**
 * Patches Angular HttpParams "toString()" method to handle empty array query params properly
 */
export function patchAngularHttpParams() {
  let httpParamsToStringOriginal = HttpParams.prototype.toString;

  HttpParams.prototype.toString = function () {
    return httpParamsToStringOriginal
      .apply(this)
      .replace(/&{2,}/g, "&")
      .replace(/^&|&$/g, "");
  };
}
