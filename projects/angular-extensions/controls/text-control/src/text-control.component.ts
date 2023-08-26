import {
  ChangeDetectionStrategy, Component, ElementRef,
  EventEmitter, Input, OnChanges, Output, ViewChild,
} from "@angular/core";
import { MatInput } from "@angular/material/input";

import { SimpleChanges } from "angular-extensions/core";
import { Field } from "angular-extensions/models";
import { ActionableControl, ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "text-control",
  templateUrl: "./text-control.component.html",
  styleUrls: ["./text-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextControlComponent<TValue> extends ControlBase<TValue> implements OnChanges, ActionableControl {

  @Input()
  public type: "text" | "number" | "time" | "email" | "tel" | "url" = "text";

  @Input()
  public step?: number;

  @Input()
  public prefix = "";

  @Input()
  public icon: string;

  @Input()
  public clearable = false;

  @ViewChild(MatInput)
  public input: MatInput;

  @Input()
  public actionButtonVisible = true;

  @Input()
  public actionButtonIcon?: string;

  @Input()
  public actionButtonTooltip?: string;

  @Output()
  public actionButton = new EventEmitter<Field<TValue>>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges<TextControlComponent<TValue>>) {
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-mdc-form-field-flex").contains(event.target as HTMLElement)) {
      this.input.focus();
    }

    event.preventDefault();
  }
}
