import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {

  public transform<T>(items: T[], predicate: (value: T, filter: string) => boolean, query: string = "") {
    return (items || []).filter(item => predicate(item, query));
  }
}
