import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "map"
})
export class MapPipe implements PipeTransform {

  public transform<T, TResult>(value: T, formatter: (value: T) => TResult) {
    return formatter(value);
  }
}
