import {} from "@angular/core";
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

export type CustomFilterPredicate<T> = (
  data: T,
  filter: string,
  defaultFilterPredicate?: ((_data: T, _filter: string) => boolean)
) => boolean;

export class CustomMatTableDataSource<T> extends MatTableDataSource<T> {

  constructor(initialData?: T[]) {
    super(initialData);
  }

  public set customFilterPredicate(filterPredicate: CustomFilterPredicate<T>) {
    // fixing issue with filterPredicate not working is filter query is empty
    this.filter = "true";

    let defaultFilterPredicate = this.filterPredicate;

    this.filterPredicate = (data, filter) => filterPredicate(data, filter, defaultFilterPredicate);
  }
}
