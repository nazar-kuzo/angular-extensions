import { AfterViewInit, Directive, Input } from "@angular/core";
import { MatSelectSearchComponent } from "ngx-mat-select-search";

@Directive({
  selector: "ngx-mat-select-search"
})
export class MatSelectSearchComponentDirective implements AfterViewInit {

  private get checkbox() {
    return (this.selectSearchComponent.innerSelectSearch.nativeElement as HTMLElement)
      .querySelector("mat-checkbox") as HTMLElement;
  }

  private get searchIcon() {
    return (this.selectSearchComponent.innerSelectSearch.nativeElement as HTMLElement)
      .querySelector("mat-icon") as HTMLElement;
  }

  @Input()
  public set toggleAllCheckboxDisabled(disabled: boolean) {
    if (!this.checkbox) {
      return;
    }

    this.checkbox.style.display = disabled ? "none" : null;
    this.searchIcon.style.display = disabled ? null : "none";
  }

  constructor(
    private selectSearchComponent: MatSelectSearchComponent,
  ) {
  }
  public ngAfterViewInit(): void {
    if (this.checkbox) {
      this.checkbox.insertAdjacentHTML("afterend", `<mat-icon
        class="material-icons"
        style="padding-left: 12px; margin-right: -4px; display: none; color: #999;"
        >search</mat-icon>`);

      this.toggleAllCheckboxDisabled = true;
    }
  }
}
