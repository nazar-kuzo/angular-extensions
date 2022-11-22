import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "groupBy"
})
export class GroupByPipe implements PipeTransform {

  /**
   * Groups collection of items by property selector
   *
   * @param items Collection of items
   * @param key Property selector or property name
   * @returns Collection of grouped items, see {@link Group} for more details
   */
  public transform<TValue, TKey = TValue[keyof TValue]>(
    items: TValue[],
    key: keyof TValue | ((item: TValue) => TKey)
  ): Group<TKey, TValue>[] {
    let propertySelector: (item: TValue) => TKey;

    if (typeof key == "function") {
      propertySelector = key;
    }
    else {
      propertySelector = (item: TValue) => item[key] as any as TKey;
    }

    return items.groupBy(propertySelector);
  }
}
