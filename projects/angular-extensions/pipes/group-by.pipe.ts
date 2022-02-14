import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "groupBy"
})
export class GroupByPipe implements PipeTransform {

  /**
   * Groups collection of items by property selector
   *
   * @param items Collection of items
   * @param property Property selector or property name
   * @returns Collection of groupped items, see {@link Group} for more details
   */
  public transform<T>(items: T[], property: keyof T | ((item: T) => T[keyof T])): Group<T>[] {
    let propertySelector: (item: T) => T[keyof T];

    if (typeof property == "function") {
      propertySelector = property;
    }
    else {
      propertySelector = (item: T) => item[property];
    }

    return items.groupBy(propertySelector);
  }
}
