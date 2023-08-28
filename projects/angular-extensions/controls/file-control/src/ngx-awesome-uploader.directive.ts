import { Directive, AfterViewInit, ElementRef } from "@angular/core";

@Directive({
  selector: "ngx-awesome-uploader",
  exportAs: "filePicker"
})
export class FilePickerComponentDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  public ngAfterViewInit(): void {
    // prevents library built-in file dialog opening
    this.elementRef.nativeElement.querySelector(".file-drop-wrapper").addEventListener(
      "click",
      event => {
        let targetElement = event.target as HTMLElement;

        if (!targetElement.closest(".dropzoneTemplate")) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { capture: true });
  }

  public openFileDialog() {
    this.elementRef.nativeElement.querySelector<HTMLInputElement>("#fileInput").dispatchEvent(new Event("click"));
  }
}
