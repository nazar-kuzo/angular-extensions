import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Component, Input, ViewChild, TemplateRef, ElementRef, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from "@angular/core";

import { Field } from "angular-extensions/models";

@Component({
  selector: "base-control",
  templateUrl: "./base-control.component.html",
  styleUrls: ["./base-control.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BaseControlComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public field: Field<any>;

  @ViewChild(TemplateRef)
  public errorsTemplate: TemplateRef<any>;

  public initialized: boolean;
  public destroy = new Subject();

  constructor(
    private emenentRef: ElementRef<HTMLElement>,
  ) {
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
    setTimeout(() => this.initialized = true);
  }

  public ngOnDestroy() {
    this.destroy.next();
  }
}
