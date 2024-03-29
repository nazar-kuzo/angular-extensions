import { merge, Subject, BehaviorSubject } from "rxjs";
import { FormControl } from "@angular/forms";
import { debounceTime, switchMap, takeUntil, tap } from "rxjs/operators";
import { MatFormField, MatFormFieldAppearance } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

import {
  Component, Input, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, Directive, HostBinding, ContentChild, ElementRef, EventEmitter,
} from "@angular/core";

import { Field } from "angular-extensions/models";

export interface CustomFormControl extends FormControl {
  _onDisabledChange: ((disabled: boolean) => any)[];
}

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
  }

  public get field() {
    return this.field$.value;
  }

  @Input()
  public set field(value: Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>) {
    this.field$.next(value);
  }

  @Input()
  public fieldClass: string;

  @Input()
  public hintClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public focused = false;

  @ViewChild(MatInput, { static: true })
  public input?: MatInput;

  public field$ = new BehaviorSubject<Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>>(null);

  public focus() {
    this.input?.focus();
  }

  public blur() {
    if (this.input) {
      this.input.focused = false;
    }
  }
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
    this.control.field$
      .pipe(
        switchMap(field => {
          field.element = this.elementRef?.nativeElement?.parentElement;

          this.initializeFieldNativeValidation(field);
          this.updateFieldLabel(this.control.field);

          // refresh control state based on data from the new field
          setTimeout(() => {
            (field.control as CustomFormControl)._onDisabledChange
              .forEach(changeFn => changeFn(field.control.disabled));
          });

          return merge(field.control.statusChanges, field.control.root.valueChanges)
            .pipe(debounceTime(0), tap(() => {
              this.updateFieldLabel(field);

              this.changeDetectorRef.markForCheck();
            }));
        }),
        takeUntil(this.destroy))
      .subscribe();
  }

  public ngAfterViewInit() {
    this.initializeFieldNativeValidation(this.control.field);
    this.updateFieldLabel(this.control.field);

    setTimeout(() => {
      this.initialized = true;

      if (this.control.focused) {
        (this.formElement?.querySelector("input,[matInput],mat-select,button") as HTMLElement)?.focus();
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private initializeFieldNativeValidation(field: Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>) {
    if (field.validation.native && !field.validation.native.value) {
      field.validation.native.value = () => this.formElement?.querySelector("input,[matInput]");
    }
  }

  private updateFieldLabel(field: Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>) {
    let required = !!field.validation.required?.getValue(field.value) ||
      !!field.validation.requiredTrue?.getValue(field.value);

    field.element
      ?.querySelector("mat-label")
      ?.classList
      ?.toggle("required", required);
  }
}
