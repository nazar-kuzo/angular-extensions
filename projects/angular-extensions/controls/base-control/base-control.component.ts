import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatFormField, MatFormFieldAppearance } from "@angular/material/form-field";
import {
  Component, Input, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, Directive, HostBinding, ContentChild, ElementRef, EventEmitter,
} from "@angular/core";

import { Field } from "angular-extensions/models";

export interface ActionableControl {

  actionButtonVisible: boolean;

  actionButtonIcon?: string;

  actionButtonTooltip?: string;

  actionButton: EventEmitter<Field<any>>;
}

@Directive()
export class ControlBase<TValue, TOption = any, TOptionGroup = any, TFormattedValue = any, TControlValue = any> {

  @HostBinding("class")
  public class = "control";

  @HostBinding("class.d-none")
  public get visible() {
    return !this.field?.visible;
  };

  @Input()
  public field: Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>;

  @Input()
  public fieldClass: string;

  @Input()
  public hintClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public focused = false;
}

@Component({
  selector: "base-control",
  templateUrl: "./base-control.component.html",
  styleUrls: ["./base-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseControlComponent<TValue, TOption = any, TOptionGroup = any, TFormattedValue = any, TControlValue = any>
  implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public control: ControlBase<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>;

  @ViewChild("hintTemplate", { static: true })
  public hintTemplate: TemplateRef<any>;

  @ViewChild("errorsTemplate")
  public errorsTemplate: TemplateRef<any>;

  @ContentChild(MatFormField)
  public formField?: MatFormField;

  public initialized: boolean;
  public destroy = new Subject();

  public get formElement(): HTMLElement {
    return (this.formField?._elementRef || this.elementRef)?.nativeElement as HTMLElement;
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit() {
    this.control.field.element = this.elementRef?.nativeElement?.parentElement;

    // update control when status changes
    merge(this.control.field.control.statusChanges, this.control.field.control.root.valueChanges)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngAfterViewInit() {
    if (this.control.focused) {
      setTimeout(() => (this.formElement?.querySelector("input,[matInput],mat-select,button") as HTMLElement)?.focus());
    }

    if (this.control.field.validation.native &&
      !this.control.field.validation.native.value) {
      this.control.field.validation.native.value = () => this.formElement?.querySelector("input,[matInput]");
    }

    setTimeout(() => {
      this.initialized = true;

      this.changeDetectorRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
