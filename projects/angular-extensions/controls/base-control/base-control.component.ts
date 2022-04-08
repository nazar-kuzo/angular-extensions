import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import {
  Component, Input, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
  OnInit, OnDestroy, ViewEncapsulation, AfterViewInit, Directive, HostBinding,
} from "@angular/core";

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
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit() {
    // update control when status changes
    merge(this.field.control.statusChanges, this.field.control.root.valueChanges)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
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
