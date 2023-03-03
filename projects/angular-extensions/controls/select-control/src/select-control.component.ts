import { castArray, intersectionWith } from "lodash-es";
import { Subject, of, merge } from "rxjs";
import { catchError, debounceTime, filter, first, switchMap, takeUntil, tap } from "rxjs/operators";
import {
  Component, OnInit, Input, Optional, ElementRef, ChangeDetectorRef,
  ViewChild, OnDestroy, AfterViewInit, ContentChild, TemplateRef, ChangeDetectionStrategy, Output, EventEmitter, NgZone, OnChanges,
} from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { FormControl } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

import { Field } from "angular-extensions/models";
import { overrideFunction, SimpleChanges } from "angular-extensions/core";
import { ActionableControl, ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  extends ControlBase<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  implements OnInit, AfterViewInit, OnChanges, OnDestroy, ActionableControl {

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

  @ContentChild("headerTemplate", { static: true })
  public headerTemplate: TemplateRef<any>;

  @ContentChild("optionTemplate", { static: true })
  public optionTemplate: TemplateRef<{ $implicit: string; option: TOption }>;

  @ContentChild("triggerTemplate", { static: true })
  public triggerTemplate: TemplateRef<{ $implicit: string; option: TOption | TOption[] }>;

  public dropdownHeight = this.optionHeight * this.visibleOptionsCount;

  /**
   * Selected option(s) based on option comparer,
   * see {@link Field.optionId} for details
   */
  public selectedOption: TOption | TOption[];

  /**
   * Trigger label (text shown when option(s) selected),
   * based on option label, see {@link Field.optionLabel} for details
   */
  public triggerLabel: string;

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

    // patch select trigger to show value when no options
    this.patchSelectTrigger();

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

    if (this.multiple && this.showSelectAll) {
      this.updateSelectAllState();

      merge(this.field.control.statusChanges, this.select.optionSelectionChanges)
        .pipe(debounceTime(0), takeUntil(this.destroy))
        .subscribe(() => {
          this.updateSelectAllState();
        });
    }
  }

  public ngOnChanges(changes: SimpleChanges<SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>>) {
    if (changes.visibleOptionsCount || changes.optionHeight) {
      this.dropdownHeight = this.optionHeight * this.visibleOptionsCount;
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
    return left != null && right != null &&
      (this.field.optionId(left) == this.field.optionId(right) ||
        this.field.optionValue(left) == this.field.optionValue(right));
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

      let selectedOption = castArray(this.selectedOption).first();

      if (selectedOption) {
        this.scrollViewport.scrollToIndex(this.field.options.indexOf(selectedOption) - Math.floor((this.visibleOptionsCount / 2)));
      }
    }
  }

  private patchSelectTrigger() {
    Object.defineProperty(this.select, "empty", {
      get: () => (this.select as any).__proto__.empty && !this.triggerLabel
    });

    this.updateTriggerLabel();

    this.field.control.registerOnChange(() => this.updateTriggerLabel());

    merge(this.field.control.valueChanges, this.field.control.statusChanges)
      .pipe(debounceTime(0), takeUntil(this.destroy))
      .subscribe(() => this.updateTriggerLabel());
  }

  private updateTriggerLabel() {
    let selectedOptions = intersectionWith(
      this.field.options,
      castArray(this.field.value as any as TOption),
      this.optionComparer);

    this.selectedOption = this.multiple
      ? selectedOptions
      : selectedOptions.first();

    if (this.selectedOption == null) {
      this.triggerLabel = "";
    }
    else {
      this.triggerLabel = castArray(this.selectedOption).map(option => this.field.optionLabel(option)).join(", ");
    }
  }
}
