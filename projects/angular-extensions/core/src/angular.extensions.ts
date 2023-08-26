import { HttpParams } from "@angular/common/http";
import type { ChangeDetectorRef, ElementRef } from "@angular/core";
import type { MatOption } from "@angular/material/core";
import type { _MatSelectBase as MatSelectBase, MatSelectChange as _MatSelectChange } from "@angular/material/select";

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

declare module "@angular/forms" {
  export interface FormControl<TValue = any> {
    _onChange: ((newValue: any, emitModelEvent: boolean) => void)[];

    _onDisabledChange: ((disabled: boolean) => any)[];
  }
}

declare module "@angular/material/core" {
  export interface AppMatOption<T = any> extends Omit<MatOption<T>, "_element" | "_selected" | "_changeDetectorRef"> {
    _element: ElementRef<HTMLElement>;

    _selected: boolean;

    _changeDetectorRef: ChangeDetectorRef;
  }
}

declare module "@angular/material/select" {
  export interface AppMatSelect extends Omit<MatSelectBase<any>, "_propagateChanges" | "_changeDetectorRef"> {
    _value: any;

    _changeDetectorRef: ChangeDetectorRef;

    panel: ElementRef<HTMLElement>;

    _canOpen(): boolean;

    _propagateChanges(fallbackValue?: any): void;

    _onSelect(matOption: MatOption<any>, isUserInput: boolean): void;

    _getChangeEvent(value: any): _MatSelectChange;

    _initializeSelection(): void;
  }
}
