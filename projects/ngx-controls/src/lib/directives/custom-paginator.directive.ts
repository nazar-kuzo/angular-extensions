import { Directive, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";

@Directive({
  selector: "[customPaginator]"
})
export class CustomPaginatorDirective {

  @Input()
  public set length(length: number) {
    if (length != null && this.paginator.pageIndex * this.paginator.pageSize >= length) {
      this.paginator.pageIndex -= 1;
    }
  }

  constructor(
    private paginator: MatPaginator
  ) { }
}
