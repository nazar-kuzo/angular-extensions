import { Directive, Input, AfterViewInit, OnChanges } from "@angular/core";
import { MatSelectSearchComponent } from "ngx-mat-select-search";

import { SimpleChanges } from "angular-extensions/core";

@Directive({
  selector: "ngx-mat-select-search"
})
export class MatSelectSearchComponentDirective implements AfterViewInit, OnChanges {

  private get checkbox() {
    return (this.selectSearchComponent.innerSelectSearch.nativeElement as HTMLElement)
      .querySelector("mat-checkbox") as HTMLElement;
  }

  private get searchIcon() {
    return (this.selectSearchComponent.innerSelectSearch.nativeElement as HTMLElement)
      .querySelector("mat-icon") as HTMLElement;
  }

  @Input()
  public toggleAllCheckboxDisabled: boolean;

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

      this.updateCheckboxState();
    }
  }

  public ngOnChanges(changes: SimpleChanges<MatSelectSearchComponentDirective>): void {
    if (changes.toggleAllCheckboxDisabled) {
      this.updateCheckboxState();
    }
  }

  private updateCheckboxState() {
    if (!this.checkbox) {
      return;
    }

    this.checkbox.style.display = this.toggleAllCheckboxDisabled ? "none" : null;
    this.searchIcon.style.display = this.toggleAllCheckboxDisabled ? null : "none";
  }
}
