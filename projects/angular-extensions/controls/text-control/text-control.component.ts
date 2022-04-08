import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";

import { Field } from "angular-extensions/models";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "text-control",
  templateUrl: "./text-control.component.html",
  styleUrls: ["./text-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextControlComponent<TValue> extends ControlBase<TValue> {

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
  public actionButton = new EventEmitter<Field<TValue>>();

  @ViewChild(MatInput)
  public input: MatInput;
}
