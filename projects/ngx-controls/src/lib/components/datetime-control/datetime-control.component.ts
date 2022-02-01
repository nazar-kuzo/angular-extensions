import { Component, ElementRef, Inject, Input } from "@angular/core";
import { MatDateFormats, MAT_DATE_FORMATS } from "@angular/material/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";

import { Field } from "../../models";

@Component({
  selector: "datetime-control",
  templateUrl: "./datetime-control.component.html",
  styleUrls: ["./datetime-control.component.scss"]
})
export class DateTimeControlComponent {

  @Input()
  public field: Field<Date>;

  @Input()
  public fieldClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public initialTime: number[];

  @Input()
  public clearable: boolean;

  @Input()
  public format: string;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Inject(MAT_DATE_FORMATS) dateFormats: MatDateFormats,
  ) {
    this.format = `${dateFormats.display.dateInput} HH:mm:ss`;

    elementRef
      .nativeElement
      .addEventListener("blur", event => event.stopPropagation(), { capture: true });
  }

  public onToggle(event: MouseEvent) {
    if (this.clearable && this.field.value != null) {
      this.field.value = null as any;

      event.preventDefault();
      event.stopImmediatePropagation();
    }

    (document.activeElement as HTMLElement).blur();
  }
}
