import { NgxMatDatetimePicker } from "@angular-material-components/datetime-picker";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "time-control",
  templateUrl: "./time-control.component.html",
  styleUrls: ["./time-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeControlComponent<TValue> extends ControlBase<TValue> {

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;


  @ViewChild(NgxMatDatetimePicker, { static: true })
  public timePicker: NgxMatDatetimePicker<any>;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-form-field-flex").contains(event.target as HTMLElement)) {
      this.timePicker.open();
    }

    event.preventDefault();
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.control.setValue(null);

      (this.timePicker.datepickerInput as any)._formField._control.focused = false;

      event.preventDefault();
      event.stopImmediatePropagation();

      this.changeDetectorRef.markForCheck();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
