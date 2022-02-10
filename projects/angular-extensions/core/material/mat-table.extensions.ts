import { MatTableDataSource } from "@angular/material/table";

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
