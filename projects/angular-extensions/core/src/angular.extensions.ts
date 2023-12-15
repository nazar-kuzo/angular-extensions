import { HttpParameterCodec, HttpParams } from "@angular/common/http";
import type { ChangeDetectorRef, ElementRef } from "@angular/core";
import type { AppMatOption, MatOption } from "@angular/material/core";
import type { MatSelect as MatSelectBase, MatSelectChange as MatSelectChangeEvent } from "@angular/material/select";

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

export class DefaultHttpParamEncoder implements HttpParameterCodec {
  public encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  public encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  public decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  public decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

declare module "@angular/forms" {
  export interface FormControl<TValue = any> {
    _onChange: ((newValue: any, emitModelEvent: boolean) => void)[];

    _onDisabledChange: ((disabled: boolean) => any)[];
  }
}

declare module "@angular/material/core" {
  export interface AppMatOption<T = any> extends Omit<MatOption, "value" | "_element" | "_selected" | "_changeDetectorRef"> {
    _element: ElementRef<HTMLElement>;

    value: T;

    _selected: boolean;

    _changeDetectorRef: ChangeDetectorRef;
  }
}

declare module "@angular/material/select" {
  export interface AppMatSelect extends Omit<MatSelectBase, "_propagateChanges" | "_changeDetectorRef"> {
    _value: any;

    _changeDetectorRef: ChangeDetectorRef;

    panel: ElementRef<HTMLElement>;

    _canOpen(): boolean;

    _propagateChanges(fallbackValue?: any): void;

    _onSelect(matOption: AppMatOption<any>, isUserInput: boolean): void;

    _getChangeEvent(value: any): MatSelectChangeEvent;

    _initializeSelection(): void;
  }
}
