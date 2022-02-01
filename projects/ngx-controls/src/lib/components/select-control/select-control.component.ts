import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSelect } from "@angular/material/select";
import { MatSelectSearchComponent } from "ngx-mat-select-search";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

import { Field } from "../../models";
import { overrideFunction } from "../../extensions";

@Component({
  selector: "select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"]
})
export class SelectControlComponent<TValue, TOption> implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  public field: Field<TValue, TOption>;

  @Input()
  public fieldClass: string;

  @Input()
  public dropdownClass = "";

  @Input()
  public appearance: MatFormFieldAppearance = "outline";

  @Input()
  public multiple: boolean;

  @Input()
  public searchable: boolean;

  @Input()
  public clearable: boolean;

  @Input()
  public showSelectAll = false;

  @Input()
  public filter = "";

  @ViewChild(MatSelectSearchComponent)
  public search: MatSelectSearchComponent;

  @ViewChild("select", { static: true })
  public select: MatSelect;

  @ViewChild("selectAllOption")
  public selectAllOption: MatOption;

  @ContentChild("optionTemplate", { static: true })
  public optionTemplate: TemplateRef<{ $implicit: string; option: TOption }>;

  @ContentChild("triggerTemplate", { static: true })
  public triggerTemplate: TemplateRef<{ $implicit: string; option: TOption | TOption[] }>;

  public get selectedOption(): any {
    return Array.isArray(this.select?.selected)
      ? this.field?.options?.length
        ? this.select.selected.map(matOption => this.field.options.find(option => this.field.optionValue(option) == matOption.value))
        : []
      : this.select?.selected != null && this.field
        ? this.field.options.find(option => this.field.optionValue(option) == (this.select.selected as MatOption).value)
        : null;
  }

  public get triggerLabel(): string {
    return Array.isArray(this.selectedOption)
      ? this.selectedOption.map(option => this.field.optionLabel(option)).join(", ")
      : this.selectedOption != null
        ? this.field.optionLabel(this.selectedOption)
        : "";
  }

  private destroy = new Subject();

  public filterControl = new FormControl();

  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Optional() matMenuTrigger: MatMenuTrigger,
  ) {
    // provides ability to have select-control to open
    // custom popup menu without processing actual event
    if (matMenuTrigger) {
      elementRef.nativeElement.addEventListener(
        "click",
        event => {
          matMenuTrigger.openMenu();

          event.stopPropagation();
        },
        { capture: true });
    }
  }

  public ngOnInit() {
    this.filterControl.setValue(this.filter);

    if (this.multiple && this.showSelectAll) {
      this.select.optionSelectionChanges
        .pipe(
          debounceTime(0),
          takeUntil(this.destroy))
        .subscribe(() => {
          let selectedOptions = this.select.selected as MatOption[];

          this.setSelectAllState(selectedOptions?.length > 0 && selectedOptions?.length == this.field.options?.length);
        });
    }
  }

  public ngAfterViewInit() {
    if (this.searchable && this.multiple && this.select) {
      // fixing issue with select control not propagating
      // changes to model when options filtering is applied
      overrideFunction(
        this.select,
        select => (select as any)._initializeSelection,
        (_, select) => {
          Promise.resolve().then(() => {
            (select as any)._setSelectionByValue([...select.ngControl.value, ...(select as any)._value]);
            select.stateChanges.next();
          });
        });
    }

    if (this.multiple && this.showSelectAll) {
      this.selectAllOption._getHostElement().addEventListener(
        "click",
        event => {
          this.toggleSelectAll();
          event.preventDefault();
          event.stopImmediatePropagation();
        },
        { capture: true });
    }

    if (this.searchable && this.field.queryOptions) {
      this.search._formControl.valueChanges
        .pipe(
          debounceTime(300),
          takeUntil(this.destroy))
        .subscribe(query => this.field.queryOptions(query));
    }
  }

  public ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private toggleSelectAll() {
    let shouldSelect = (this.select.selected as MatOption[])?.length < this.field.options?.length;

    this.select.options
      .filter(option => !option.disabled && option.id != this.selectAllOption.id)
      .forEach(option => {
        if (shouldSelect) {
          option.select();
        }
        else {
          option.deselect();
        }
      });

    this.setSelectAllState(shouldSelect);
  }

  private setSelectAllState(selected: boolean) {
    if (this.selectAllOption) {
      (this.selectAllOption as any)._selected = selected;
      (this.selectAllOption as any)._changeDetectorRef.markForCheck();
    }
  }
}
