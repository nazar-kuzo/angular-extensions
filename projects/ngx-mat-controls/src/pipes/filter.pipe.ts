import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {

  /**
   * Provides ability to filter collection of objects with string predicate
   * @param items Collection of items
   * @param predicate Function that accepts string predicate and matches items from collection
   * @param query String predicate
   * @returns Filtered collection of items
   */
  public transform<T>(items: T[], predicate: (value: T, filter: string) => boolean, query: string = "") {
    return (items || []).filter(item => predicate(item, query));
  }
}
