import { debounceTime, Subject } from "rxjs";
import { Directive, Input, ElementRef, OnChanges, AfterViewInit, OnDestroy } from "@angular/core";

@Directive({
  selector: "[truncate]"
})
export class TruncateDirective implements OnChanges, AfterViewInit, OnDestroy {

  @Input("truncate")
  public values: string[];

  private truncated = false;

  private truncate$ = new Subject<void>();

  private resizeObserver: ResizeObserver;

  private get container() {
    return this.elementRef.nativeElement;
  }

  private get remainderContainer() {
    return this.container.children.length == 2
      ? this.container.lastChild as HTMLSpanElement
      : null;
  }

  private get parentElement() {
    return this.elementRef.nativeElement.parentElement;
  }

  constructor(
    private elementRef: ElementRef<HTMLSpanElement>,
  ) {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.truncated || this.container.offsetWidth > this.parentElement.offsetWidth) {
        this.truncate$.next();
      }
    });

    this.truncate$
      .pipe(debounceTime(0))
      .subscribe(() => {
        if (document.contains(this.container)) {
          this.truncated = this.truncate(this.values);
        }
      });
  }

  public ngOnChanges() {
    this.truncate$.next();
  }

  public ngAfterViewInit() {
    this.truncate$.next();

    this.resizeObserver.observe(this.parentElement);
  }

  public ngOnDestroy() {
    this.truncate$.complete();

    this.resizeObserver.unobserve(this.parentElement);
  }

  private truncate(values?: string[]): boolean {
    if (!values?.length) {
      this.elementRef.nativeElement.innerHTML = "";

      return false;
    }

    this.container.style.maxWidth = this.parentElement.offsetWidth + "px";

    if (values.length == 1) {
      let value = values[0];

      this.container.innerText = value;

      if (this.container.offsetWidth <= this.parentElement.offsetWidth) {
        return false;
      }

      this.container.innerHTML += "...";

      let truncatedWidth = Math.round((this.parentElement.offsetWidth / this.container.offsetWidth) * values[0].length);

      this.container.innerHTML = this.container.innerHTML.substring(0, truncatedWidth) + "...";

      return true;
    }

    // create label and remainder elements
    this.container.innerHTML = `<span></span><span class="px-2 ml-1 rounded-pill bg-secondary text-white">+${values.length - 1}</span>`;

    let labelContainer = this.container.firstChild as HTMLSpanElement;

    let remainder = values.length;

    // add labels to result until test container width overflows
    for (let index = 0; index < values.length && this.container.offsetWidth <= this.parentElement.offsetWidth; index++) {
      let pendingValue = index == 0 ? values[index] : ", " + values[index];

      labelContainer.innerText += pendingValue;

      // need to truncate value since we get overflow on first iteration
      if (index == 0 && this.container.offsetWidth > this.parentElement.offsetWidth) {
        labelContainer.innerText += "...";

        let truncatedWidth = Math.round(
          ((this.parentElement.offsetWidth - this.remainderContainer.offsetWidth) / this.container.offsetWidth) *
          values[0].length);

        labelContainer.innerText = labelContainer.innerText.substring(0, truncatedWidth) + "...";

        return true;
      }

      // need to revert last value due to overflow
      if (this.container.offsetWidth > this.parentElement.offsetWidth) {
        labelContainer.innerText = labelContainer.innerText.substring(0, labelContainer.innerText.length - pendingValue.length);
      }
      else {
        this.remainderContainer.innerText = "+" + --remainder;
      }
    }

    // remove empty remainder
    if (remainder == 0) {
      this.remainderContainer.remove();

      return false;
    }

    return true;
  }
}
