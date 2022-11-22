import { MatTableDataSource } from "@angular/material/table";
import { overrideFunction } from "angular-extensions/core";

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
  }

  /**
   * Sets custom filter predicate
   */
  public set customFilterPredicate(filterPredicate: CustomFilterPredicate<T>) {
    let defaultFilterPredicate = this.filterPredicate;

    this.filterPredicate = (data, filter) => filterPredicate(data, filter, defaultFilterPredicate);
  }
}
