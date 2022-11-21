import { castArray, intersectionWith } from "lodash-es";
import { of, Subject } from "rxjs";
import { catchError, debounceTime, filter, first, switchMap, takeUntil, tap } from "rxjs/operators";
import {
  Component, OnInit, Input, Optional, ElementRef, ChangeDetectorRef,
  ViewChild, OnDestroy, AfterViewInit, ContentChild, TemplateRef, ChangeDetectionStrategy, Output, EventEmitter, NgZone,
} from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { FormControl } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

import { Field } from "angular-extensions/models";
import { overrideFunction } from "angular-extensions/core";
import { ActionableControl, ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  extends ControlBase<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  implements OnInit, AfterViewInit, OnDestroy, ActionableControl {

  @Input()
  public dropdownClass = "";

  @Input()
  public multiple: boolean;

  @Input()
  public searchable: boolean;

  @Input()
  public clearable: boolean;

  @Input()
  public virtualization = false;

  @Input()
  public showSelectAll = false;

  @Input()
  public tooltipDisabled = false;

  @Input()
  public filter = "";

  @Input()
  public actionButtonVisible = true;

  @Input()
  public actionButtonIcon?: string;

  @Input()
  public actionButtonTooltip?: string;

  @Input()
  public optionHeight = 42;

  @Input()
  public visibleOptionsCount = 6;

  @Output()
  public actionButton = new EventEmitter<Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>>();

  @ViewChild("select", { static: true })
  public select: MatSelect;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport?: CdkVirtualScrollViewport;

  @ViewChild("selectAllOption")
  public selectAllOption?: MatOption;

  @ContentChild("optionTemplate", { static: true })
  public optionTemplate: TemplateRef<{ $implicit: string; option: TOption }>;

  @ContentChild("triggerTemplate", { static: true })
  public triggerTemplate: TemplateRef<{ $implicit: string; option: TOption | TOption[] }>;

  /**
   * Gets selected options based on option comparer,
   * see {@link Field.optionId} for details
   */
  public get selectedOption() {
    let selectedOptions = intersectionWith(
      this.field.options,
      castArray(this.field.value as any as TOption),
      this.optionComparer);

    return this.multiple
      ? selectedOptions
      : selectedOptions.first();
  }

  /**
   * Gets trigger label (text shown when option(s) selected),
   * based on option label, see {@link Field.optionLabel} for details
   */
  public get triggerLabel() {
    let selectedOption = this.selectedOption;

    if (Array.isArray(selectedOption)) {
      return selectedOption.map(option => this.field.optionLabel(option)).join(", ");
    }
    else if (selectedOption) {
      return this.field.optionLabel(selectedOption);
    }
    else {
      return "";
    }
  }

  public get dropdownHeight() {
    return this.visibleOptionsCount * this.optionHeight;
  }

  public filterControl = new FormControl();

  private destroy = new Subject();

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    @Optional() matMenuTrigger: MatMenuTrigger,
  ) {
    super();

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

    // trigger "filter" pipe to refresh options since custom predicate might not be pure
    if (this.virtualization || this.field.customOptionFilterPredicate) {
      overrideFunction(
        this.select,
        select => select.open,
        (open, select) => {
          if ((select as any)._canOpen()) {
            if (this.field.customOptionFilterPredicate) {
              this.field.options = [...this.field.options];
            }

            if (this.virtualization) {
              this.ngZone.onStable.pipe(first()).subscribe(() => this.updateViewport());
            }
          }

          open();
        });
    }

    if (this.multiple && this.showSelectAll) {
      this.select.optionSelectionChanges
        .pipe(
          debounceTime(0),
          takeUntil(this.destroy))
        .subscribe(() => this.updateSelectAllState());
    }
  }

  public ngAfterViewInit() {
    this.select.options.changes
      .pipe(
        filter(() => !!this.field.optionDisplayLabel),
        takeUntil(this.destroy))
      .subscribe((options: MatOption[]) => {
        options.forEach(option => {
          Object.defineProperty(option, nameOf(() => option.viewValue), {
            get: () => this.field.optionDisplayLabel(option.value as TOption),
            configurable: true,
          });
        });
      });

    if (this.searchable) {
      if (this.multiple) {
        // fixing issue with select control not propagating
        // changes to model when options filtering is applied
        overrideFunction(
          this.select,
          select => (select as any)._initializeSelection,
          (_, select) => {
            Promise.resolve().then(() => {
              (select as any)._setSelectionByValue([...(select.ngControl.value || []), ...((select as any)._value || [])]);
              select.stateChanges.next();
            });
          });
      }

      this.filterControl.valueChanges
        .pipe(
          filter((query: string) => query != "" && !!this.field.optionsProvider),
          tap(() => {
            this.field.options = [];
            this.field.isQuerying = true;

            this.changeDetectorRef.markForCheck();
          }),
          debounceTime(300),
          switchMap((query: string) => !!query
            ? this.field.optionsProvider(query).pipe(catchError(() => of([] as TOption[])))
            : of([])),
          takeUntil(this.destroy))
        .subscribe(options => {
          this.field.options = options;
          this.field.isQuerying = false;

          this.changeDetectorRef.markForCheck();
        });
    }

    // improved selection model that relies on custom option selection
    if (this.virtualization) {
      overrideFunction(
        this.select._selectionModel,
        selectionModel => selectionModel.isEmpty,
        () => this.selectedOption instanceof Array
          ? this.selectedOption.length == 0
          : !this.selectedOption);
    }
  }

  public ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

  public optionTracker = (index: number, option: TOption) => {
    return this.field.optionId(option, index);
  };

  public optionComparer = (left?: TOption, right?: TOption) => {
    if (typeof left != typeof right) {
      return left != null && right != null && this.field.optionValue(left) == this.field.optionValue(right);
    }

    return left != null && right != null && this.field.optionId(left) == this.field.optionId(right);
  };

  public showClearButton() {
    let isVisible = this.clearable && !this.field.isQuerying;

    if (this.multiple && Array.isArray(this.field.value)) {
      return isVisible && this.field.value.length > 0;
    }
    else {
      return isVisible && this.field.value != null;
    }
  }

  public isSearchAvailable() {
    return this.field.isQuerying ||
      this.field.options?.length ||
      this.field.optionsProvider;
  }

  public clear() {
    this.field.control.setValue(this.multiple ? [] : null);

    this.select._selectionModel.deselect(...this.select._selectionModel.selected);
  }

  public toggleSelectAll() {
    let shouldSelect = !this.getSelectAllState();

    let options = this.select.options
      .filter(option => !option.disabled && option.id != this.selectAllOption?.id);

    options
      .forEach(option => {
        if (shouldSelect) {
          (option as any)._selected = true;
        }
        else {
          (option as any)._selected = false;
        }

        (option as any)._changeDetectorRef.markForCheck();
      });

    if (shouldSelect) {
      this.select._selectionModel.select(...options);
    }
    else {
      this.select._selectionModel.deselect(...options);
    }

    (this.select as any)._propagateChanges();
    this.changeDetectorRef.markForCheck();

    this.updateSelectAllState();
  }

  private getSelectAllState() {
    let selectedOptions = this.select.selected as MatOption[];

    return !selectedOptions?.length
      ? false
      : selectedOptions.length === this.field.options?.length
        ? true : null;
  }

  private updateSelectAllState() {
    let selected = this.getSelectAllState();

    if (this.selectAllOption) {
      let matCheckbox = ((this.selectAllOption as any)._element.nativeElement as HTMLElement)
        .querySelector("mat-pseudo-checkbox");

      if (selected == null) {
        matCheckbox?.classList.remove("mat-pseudo-checkbox-checked");

        matCheckbox?.classList.add("mat-pseudo-checkbox-indeterminate");
      }
      else {
        matCheckbox?.classList.remove("mat-pseudo-checkbox-indeterminate");

        matCheckbox?.classList.toggle("mat-pseudo-checkbox-checked", selected);
      }
    }
  }

  private updateViewport() {
    if (this.scrollViewport) {
      (this.select.panel.nativeElement as HTMLElement).style.height = `${this.dropdownHeight}px`;
      (this.select.panel.nativeElement as HTMLElement).style.maxHeight = `${this.dropdownHeight}px`;

      this.scrollViewport.checkViewportSize();

      let selectedOption = this.selectedOption instanceof Array
        ? this.selectedOption.first()
        : this.selectedOption;

      if (selectedOption) {
        this.scrollViewport.scrollToIndex(this.field.options.indexOf(selectedOption) - Math.floor((this.visibleOptionsCount / 2)));
      }
    }
  }
}
