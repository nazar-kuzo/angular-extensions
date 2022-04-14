import {
  ChangeDetectionStrategy, Component, ElementRef,
  EventEmitter, Input, OnChanges, Output, ViewChild,
} from "@angular/core";
import { MatInput } from "@angular/material/input";

import { SimpleChanges } from "angular-extensions/core";
import { Field } from "angular-extensions/models";
import { ControlBase } from "angular-extensions/controls/base-control";

interface MaskPattern {
  [character: string]: {
    pattern: string | RegExp;

    optional?: boolean;

    symbol?: string;
  };
}

@Component({
  selector: "text-control",
  templateUrl: "./text-control.component.html",
  styleUrls: ["./text-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextControlComponent<TValue> extends ControlBase<TValue> implements OnChanges {

  @Input()
  public type: "text" | "number" | "time" | "email" | "tel" = "text";

  @Input()
  public mask: string;

  @Input()
  public prefix = "";

  @Input()
  public showMaskTyped: boolean;

  @Input()
  public pattern?: MaskPattern;

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

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges<TextControlComponent<TValue>>) {
    if (changes.pattern?.currentValue) {
      Object.values(changes.pattern?.currentValue).forEach(value => {
        if (typeof value.pattern == "string") {
          value.pattern = new RegExp(value.pattern);
        }
      });
    }
  }

  public onFieldClick(event: MouseEvent) {
    if (this.elementRef.nativeElement.querySelector(".mat-form-field-flex").contains(event.target as HTMLElement)) {
      this.input.focus();
    }

    event.preventDefault();
  }
}
