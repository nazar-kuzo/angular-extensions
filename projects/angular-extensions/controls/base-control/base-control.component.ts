import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { MatFormField, MatFormFieldAppearance } from "@angular/material/form-field";
import {
  Component, Input, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, Directive, HostBinding, ContentChild, ElementRef,
} from "@angular/core";

import { overrideFunction } from "angular-extensions/core";
import { Field } from "angular-extensions/models";

@Directive()
export class ControlBase<TValue, TOption = any> {

  @HostBinding("class")
  public class = "control";

  @HostBinding("class.d-none")
  public get visible() {
    return !this.field?.visible;
  };

  @Input()
  public field: Field<TValue, TOption>;

  @Input()
  public fieldClass: string;

  @Input()
  public hintClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public focused = false;
}

// patch FormControl to avoid updating whole parent value when control value is updated
overrideFunction(
  FormControl.prototype,
  control => control.setValue,
  (setValue, _, ...[value, options]) => {
    if (options?.emitModelToViewChange === false) {
      options.onlySelf = true;
    }

    setValue(value, options);
  });

@Component({
  selector: "base-control",
  templateUrl: "./base-control.component.html",
  styleUrls: ["./base-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseControlComponent<TValue> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public control: ControlBase<TValue>;

  @ViewChild("hintTemplate", { static: true })
  public hintTemplate: TemplateRef<any>;

  @ViewChild("errorsTemplate")
  public errorsTemplate: TemplateRef<any>;

  @ContentChild(MatFormField)
  public formField?: MatFormField;

  public initialized: boolean;
  public destroy = new Subject();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit() {
    // update control when status changes
    merge(this.control.field.control.statusChanges, this.control.field.control.root.valueChanges)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngAfterViewInit() {
    if (this.control.focused) {

      let formElement = (this.formField?._elementRef || this.elementRef)?.nativeElement as HTMLElement;

      setTimeout(() => (formElement?.querySelector("input,[matInput],mat-select,button") as HTMLElement)?.focus());
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
