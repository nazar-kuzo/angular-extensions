import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

import { Field } from "angular-extensions/models";

@Component({
  selector: "text-control",
  templateUrl: "./text-control.component.html",
  styleUrls: ["./text-control.component.scss"]
})
export class TextControlComponent<T> {

  @ViewChild(MatInput)
  public input: MatInput;

  @Input()
  public field: Field<T>;

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

  @Input()
  public actionButtonIcon?: string;

  @Input()
  public actionButtonTooltip?: string;

  @Output()
  public actionButton = new EventEmitter<Field<T>>();
}
