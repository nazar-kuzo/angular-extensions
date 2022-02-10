import { Component, Input, ViewChild } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

import { Field, TimeOfDay } from "angular-extensions/models";

@Component({
  selector: "text-control",
  templateUrl: "./text-control.component.html",
  styleUrls: ["./text-control.component.scss"]
})
export class TextControlComponent {

  @ViewChild(MatInput)
  public input: MatInput;

  @Input()
  public field: Field<string> | Field<number> | Field<TimeOfDay>;

  @Input()
  public fieldClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public type: "text" | "number" | "time" | "email" | "tel" = "text";

  @Input()
  public mask: string;

  @Input()
  public prefix = "";

  @Input()
  public showMaskTyped: boolean;

  @Input()
  public focused = false;

  @Input()
  public icon: string;

  @Input()
  public clearable = false;
}
