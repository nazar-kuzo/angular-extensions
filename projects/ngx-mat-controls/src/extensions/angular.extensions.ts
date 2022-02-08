import {} from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { MatTableDataSource } from "@angular/material/table";

declare module "@angular/core" {
  export type SimpleChangeGeneric<TValue> = {
    previousValue: TValue;
    currentValue: TValue;
    firstChange: boolean;

    isFirstChange(): boolean;
  };

  export type SimpleChangesGeneric<TComponent> = {
    [key in keyof TComponent]?: SimpleChangeGeneric<TComponent[key]>;
  };
}

/**
 * Extends MatDataSource with custom filter function
 */
export type CustomFilterPredicate<T> = (
  data: T,
  filter: string,
  defaultFilterPredicate?: ((_data: T, _filter: string) => boolean)
) => boolean;

/**
 * Extends MatTableDataSource with custom filter function
 */
export class CustomMatTableDataSource<T> extends MatTableDataSource<T> {

  constructor(initialData?: T[]) {
    super(initialData);
  }

  /**
   * Sets custom filter predicate
   */
  public set customFilterPredicate(filterPredicate: CustomFilterPredicate<T>) {
    // fixing issue with filterPredicate not working is filter query is empty
    this.filter = "true";

    let defaultFilterPredicate = this.filterPredicate;

    this.filterPredicate = (data, filter) => filterPredicate(data, filter, defaultFilterPredicate);
  }
}

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
