import { Directive, Input, ElementRef, OnChanges, HostListener, AfterViewInit } from "@angular/core";
import { SimpleChanges } from "angular-extensions/core";

@Directive({
  selector: "[truncate]"
})
export class TruncateDirective implements OnChanges, AfterViewInit {

  @Input("truncate")
  public values: string[];

  private get container() {
    return this.elementRef.nativeElement;
  }

  constructor(
    private elementRef: ElementRef<HTMLSpanElement>,
  ) {
  }

  @HostListener("window:resize")
  @HostListener("window:orientationchange")
  public onResize() {
    setTimeout(() => this.optionsFormatter(this.values));
  }

  public ngOnChanges(changes: SimpleChanges<TruncateDirective>) {
    setTimeout(() => this.optionsFormatter(changes.values?.currentValue));
  }

  public ngAfterViewInit() {
    setTimeout(() => this.optionsFormatter(this.values));
  }

  private optionsFormatter(values?: string[]) {
    if (!values?.length) {
      this.elementRef.nativeElement.innerHTML = "";

      return;
    }

    let parentElement = this.elementRef.nativeElement.parentElement;

    this.container.style.maxWidth = parentElement.offsetWidth + "px";

    if (values.length == 1) {
      let value = values[0];

      this.container.innerText = value;

      if (this.container.offsetWidth <= parentElement.offsetWidth) {
        return;
      }

      this.container.innerHTML += "...";

      let truncatedWidth = Math.round((parentElement.offsetWidth / this.container.offsetWidth) * values[0].length);

      this.container.innerHTML = this.container.innerHTML.substring(0, truncatedWidth) + "...";

      return;
    }

    // create label and remainder elements
    this.container.innerHTML = `<span></span><span class="px-2 ml-1 rounded-pill bg-secondary text-white">+${values.length - 1}</span>`;

    let labelContainer = this.container.firstChild as HTMLSpanElement;
    let remainderContainer = this.container.lastChild as HTMLSpanElement;

    let remainder = values.length;

    // add labels to result until test container width overflows
    for (let index = 0; index < values.length && this.container.offsetWidth <= parentElement.offsetWidth; index++) {
      let pendingValue = index == 0 ? values[index] : ", " + values[index];

      labelContainer.innerText += pendingValue;

      // need to truncate value since we get overflow on first iteration
      if (index == 0 && this.container.offsetWidth > parentElement.offsetWidth) {
        labelContainer.innerText += "...";

        let truncatedWidth = Math.round(
          ((parentElement.offsetWidth - remainderContainer.offsetWidth) / this.container.offsetWidth) *
          values[0].length);

        labelContainer.innerText = labelContainer.innerText.substring(0, truncatedWidth) + "...";

        return;
      }

      // need to revert last value due to overflow
      if (this.container.offsetWidth > parentElement.offsetWidth) {
        labelContainer.innerText = labelContainer.innerText.substring(0, labelContainer.innerText.length - pendingValue.length);
      }
      else {
        remainderContainer.innerText = "+" + --remainder;
      }
    }

    // remove empty remainder
    if (remainder == 0) {
      remainderContainer.remove();
    }
  }
}
