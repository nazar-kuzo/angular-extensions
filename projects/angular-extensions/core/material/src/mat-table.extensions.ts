import type { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { overrideFunction } from "angular-extensions/core";

/**
 * Extends MatDataSource with custom filter function
 */
export type CustomFilterPredicate<T> = (
  data: T,
  filter: string,
  defaultFilterPredicate: ((data: T, filter: string) => boolean),
) => boolean;

/**
 * Extends MatDataSource with data sort function
 */
export type CustomSortData<T> = (
  data: T[],
  sort: MatSort,
  defaultSortData: (data: T[], sort: MatSort) => T[],
) => T[];

/**
 * Extends MatTableDataSource with custom filter function
 */
export class CustomMatTableDataSource<T> extends MatTableDataSource<T> {

  constructor(
    initialData?: T[],
    options?: {
      customSortData?: CustomSortData<T>;
      customFilterPredicate?: CustomFilterPredicate<T>;
    },
  ) {
    super(initialData);

    overrideFunction(
      this,
      dataSource => dataSource._filterData,
      (_, dataSource, data) => {
        dataSource.filteredData = data.filter((item: T) => dataSource.filterPredicate(item, dataSource.filter));

        if (dataSource.paginator) {
          dataSource._updatePaginator(dataSource.filteredData.length);
        }

        return dataSource.filteredData;
      });

    if (options) {
      Object.assign(this, options);
    }
  }

  /**
   * Forces data source to refresh {@link filteredData} field based on {@link customFilterPredicate}
   */
  public filterData() {
    this.filter = this.filter;
  }

  /**
   * Sets custom data sort function
   */
  public set customSortData(sortData: CustomSortData<T>) {
    let defaultSortData = this.sortData;

    this.sortData = (data, sort) => sortData(data, sort, defaultSortData);
  }

  /**
   * Sets custom filter predicate
   */
  public set customFilterPredicate(filterPredicate: CustomFilterPredicate<T>) {
    let defaultFilterPredicate = this.filterPredicate;

    this.filterPredicate = (data, filter) => filterPredicate(data, filter, defaultFilterPredicate);
  }
}
