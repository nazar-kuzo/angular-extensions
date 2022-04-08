import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  Component, Input, ViewChild, TemplateRef, ElementRef,
  OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, Directive, ChangeDetectionStrategy, ChangeDetectorRef,
} from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";

import { Field } from "angular-extensions/models";

@Directive()
export class ControlBase<TValue, TOption = any> {

  @Input()
  public field: Field<TValue, TOption>;

  @Input()
  public fieldClass: string;

  @Input()
  public hintClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";
}

@Component({
  selector: "base-control",
  templateUrl: "./base-control.component.html",
  styleUrls: ["./base-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseControlComponent<TValue> extends ControlBase<TValue> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("hintTemplate", { static: true })
  public hintTemplate: TemplateRef<any>;

  @ViewChild("errorsTemplate")
  public errorsTemplate: TemplateRef<any>;

  public initialized: boolean;
  public destroy = new Subject();

  constructor(
    private emenentRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();

    this.emenentRef.nativeElement.parentElement?.classList.add("control");
  }

  public ngOnInit() {
    if (this.field.formGroup) {
      this.field
        .formGroup
        .valueChanges
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.emenentRef.nativeElement.parentElement?.classList.toggle("d-none", !this.field.visible);
        });

      this.field.formGroup.updateValueAndValidity();
    }
  }

  public ngAfterViewInit() {
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
