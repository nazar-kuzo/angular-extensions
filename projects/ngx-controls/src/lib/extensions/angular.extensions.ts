import {} from "@angular/core";

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
