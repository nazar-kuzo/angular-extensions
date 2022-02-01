import { startCase } from "lodash-es";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startCase",
})
export class StartCasePipe implements PipeTransform {

  public transform(value?: string) {
    return startCase(value || "").replace(/\s(\d)/g, "$1");
  }
}
