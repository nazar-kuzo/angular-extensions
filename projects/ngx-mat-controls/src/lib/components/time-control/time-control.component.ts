import { Component, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { Field } from "../../models";

@Component({
  selector: "time-control",
  templateUrl: "./time-control.component.html",
  styleUrls: ["./time-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TimeControlComponent {

  @Input()
  public field: Field<Date | null>;

  @Input()
  public fieldClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  constructor(
    elementRef: ElementRef<HTMLElement>,
  ) {
    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.value = null;

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
