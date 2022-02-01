import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "groupBy"
})
export class GroupByPipe implements PipeTransform {

  public transform<T>(items: T[], property: (item: T) => T[keyof T]) {
    return items.groupBy(property);
  }
}
