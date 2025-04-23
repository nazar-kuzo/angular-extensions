import { Directive, Input } from "@angular/core";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";

@Directive({
  selector: "[customPaginator]"
})
export class CustomPaginatorDirective {

  /**
   * Fixes problem with pagination when it is not updating page after items were filtered
   */
  @Input()
  public set length(length: number) {
    if (length != null && this.paginator.pageIndex * this.paginator.pageSize >= length) {
      this.paginator.pageIndex = this.paginator.pageIndex - 1;
    }
  }

  constructor(
    private paginator: MatPaginator
  ) { }
}
