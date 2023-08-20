import { castArray } from "lodash-es";
import { Observable, of, merge } from "rxjs";
import { catchError, debounceTime, filter, first, startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import {
  Component, OnInit, OnChanges, Input, Optional, ElementRef, ChangeDetectorRef, NgZone,
  ViewChild, ContentChild, TemplateRef, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation,
} from "@angular/core";
import { AppMatOption } from "@angular/material/core";
import { AppMatSelect, MatLegacySelect as MatSelect } from "@angular/material/legacy-select";
import { FormControl } from "@angular/forms";
import { MatLegacyMenuTrigger as MatMenuTrigger } from "@angular/material/legacy-menu";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { SelectionModel } from "@angular/cdk/collections";

import { Field } from "angular-extensions/models";
import { overrideFunction, SimpleChanges } from "angular-extensions/core";
import { ActionableControl, ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  extends ControlBase<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  implements OnInit, OnChanges, ActionableControl {

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
  public tooltipDisabled = false;

  @Input()
  public optionTooltipDisabled = false;

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

  @Input()
  public hideTriggerLabel: boolean;

  @Output()
  public actionButton = new EventEmitter<Field<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>>();

  @ViewChild(MatSelect, { static: true })
  public select: AppMatSelect;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport?: CdkVirtualScrollViewport;

  @ContentChild("headerTemplate", { static: true })
  public headerTemplate: TemplateRef<any>;

  @ContentChild("optionTemplate", { static: true })
  public optionTemplate: TemplateRef<{ $implicit: string; option: TOption }>;

  @ContentChild("triggerTemplate", { static: true })
  public triggerTemplate: TemplateRef<{ $implicit: string; option: TOption | TOption[] }>;

  public dropdownHeight = this.optionHeight * this.visibleOptionsCount;

  public isSelectAllChecked = false;

  public get viewportHeight() {
    return this.dropdownHeight - (this.searchable ? this.optionHeight : 0);
  }

  /**
   * Selected option(s) based on option comparer,
   * see {@link Field.optionId} for details
   */
  public selectedOption: TOption | TOption[];

  public get filteredOptions() {
    return this.field.options.filter(option =>
      !this.field.optionDisabled(option) &&
      this.field.optionsFilterPredicate(option, this.filterControl.value));
  }

  /**
   * Trigger label (text shown when option(s) selected),
   * based on option label, see {@link Field.optionLabel} for details
   */
  public triggerLabel: string;

  public filterControl = new FormControl<string>("");

  private selection: SelectionModel<TOption>;

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

    this.selection = new SelectionModel<TOption>(this.multiple, [], true, this.optionComparer);

    this.patchSelectTrigger();
    this.addCustomSelectionModel();
    this.addOptionsFilteringSupport();
    this.updateOptionsAndViewportOnMenuOpen();

    if (this.multiple && this.searchable) {
      this.updateSelectAllStateOnOptionChanges();
    }
  }

  public ngOnChanges(changes: SimpleChanges<SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>>) {
    if (changes.visibleOptionsCount || changes.optionHeight) {
      this.dropdownHeight = this.optionHeight * this.visibleOptionsCount;
    }
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
    return this.clearable && !this.field.isQuerying && this.selection.hasValue();
  }

  public isSearchAvailable() {
    return this.field.isQuerying ||
      this.field.options?.length ||
      this.field.optionsProvider;
  }

  public clear() {
    this.field.control.setValue(this.multiple ? [] as any as TControlValue : null);
    this.field.control.markAsTouched({ onlySelf: true });

    this.changeDetectorRef.markForCheck();
  }

  public toggleSelectAll(shouldSelect: boolean) {
    let filteredOptions = this.filteredOptions;

    let matOptions = this.select.options.filter(option => !option.disabled);

    (matOptions as any as AppMatOption<any>[])
      .forEach(option => {
        option._selected = shouldSelect;
        option._changeDetectorRef.markForCheck();
      });

    if (shouldSelect) {
      this.selection.select(...filteredOptions);
      this.select._selectionModel.select(...matOptions);
    }
    else {
      this.selection.deselect(...filteredOptions);
      this.select._selectionModel.deselect(...matOptions);
    }

    this.select._propagateChanges();

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Store selected values in separate model to avoid mutations when virtualization applies.
   * Extend changes propagation with values stored in custom selection model.
   * Listens to control value changes in order to update selection.
   */
  private addCustomSelectionModel() {
    overrideFunction(
      this.select,
      select => select._onSelect,
      (onSelect, _, matOption, isUserInput) => {
        if (isUserInput) {
          let fieldOption = this.field.options.find(option => this.field.optionValue(option).valueOf() == matOption.value.valueOf());

          if (matOption.selected) {
            this.selection.select(fieldOption);
          }
          else {
            this.selection.deselect(fieldOption);
          }
        }

        onSelect(matOption, isUserInput);
      });

    overrideFunction(
      this.select,
      select => select._propagateChanges,
      (_, select, fallbackValue) => {
        let valueToEmit = this.selection.hasValue
          ? this.multiple
            ? this.selection.selected.map(this.field.optionValue)
            : this.field.optionValue(this.selection.selected.first())
          : fallbackValue;

        select._value = valueToEmit;
        select.valueChange.emit(valueToEmit);
        select._onChange(valueToEmit);
        select.selectionChange.emit(select._getChangeEvent(valueToEmit));
        select._changeDetectorRef.markForCheck();
      });

    this.field$
      .pipe(
        switchMap(field => merge(
          field.optionChanges,
          new Observable(subscriber => field.control.registerOnChange(() => subscriber.next(null))),
        )),
        debounceTime(0),
        startWith(null),
        takeUntil(this.destroy))
      .subscribe(() => {
        let options = castArray(this.field.value as any as TOption[] ?? [])
          .map(item => this.field.options.find(option => this.optionComparer(option, item)) ?? item);

        this.selection.clear();
        this.selection.select(...options);

        // synchronize with select model
        this.select._initializeSelection();
      });
  }

  /**
   * Delegates "empty" state detection to custom selection model.
   * Updates select trigger label based on custom selection model.
   * If "hideTriggerLabel" set to true - trigger label will be ignored completely
   */
  private patchSelectTrigger() {
    Object.defineProperty(this.select, "empty", {
      get: () => this.hideTriggerLabel ? true : !this.selection.hasValue()
    });

    this.selection.changed
      .pipe(startWith(this.selection.selected), takeUntil(this.destroy))
      .subscribe(() => {
        this.selectedOption = this.multiple
          ? this.selection.selected
          : this.selection.selected.first();

        this.triggerLabel = this.selection.hasValue()
          ? this.selection.selected.map(this.field.optionDisplayLabel || this.field.optionLabel).join(", ")
          : null;

        this.select.stateChanges.next();

        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * Trigger "filter" pipe to refresh options since custom predicate might not be pure.
   * Recalculates virtualization viewport size.
   */
  private updateOptionsAndViewportOnMenuOpen() {
    overrideFunction(
      this.select,
      select => select.open,
      (open, select) => {
        if (select._canOpen()) {
          if (this.field.customOptionFilterPredicate) {
            this.field.options = [...this.field.options];
          }

          if (this.virtualization) {
            this.ngZone.onStable.pipe(first()).subscribe(() => {
              if (this.scrollViewport) {
                this.select.panel.nativeElement.style.height = `${this.dropdownHeight}px`;
                this.select.panel.nativeElement.style.maxHeight = `${this.dropdownHeight}px`;

                this.scrollViewport.checkViewportSize();

                if (this.selection.hasValue()) {
                  let selectedOptionIndex = this.field.options.indexOf(this.selection.selected.first()) -
                    Math.floor((this.visibleOptionsCount / 2));

                  this.scrollViewport.scrollToIndex(selectedOptionIndex);
                }
              }
            });
          }
        }

        open();
      });
  }

  /**
   * Updates select all state on selection changes.
   */
  private updateSelectAllStateOnOptionChanges() {
    merge(this.selection.changed, this.filterControl.valueChanges)
      .pipe(
        debounceTime(0),
        startWith(this.isSelectAllChecked),
        takeUntil(this.destroy))
      .subscribe(() => {
        let selectedOptions = this.selection.selected.filter(option =>
          !this.field.optionDisabled(option) &&
          this.field.optionsFilterPredicate(option, this.filterControl.value));

        if (!selectedOptions.length) {
          this.isSelectAllChecked = false;
        }
        else {
          let uncheckedOption = this.filteredOptions
            .some(option => !selectedOptions.some(selected => this.optionComparer(option, selected)));

          this.isSelectAllChecked = uncheckedOption ? null : true;
        }

        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * Hooks up the <ngx-mat-select-search> MatOption and provides filtered field option
   */
  private addOptionsFilteringSupport() {
    if (this.field.optionsProvider) {
      this.filterControl.valueChanges
        .pipe(
          filter((query: string) => query != ""),
          tap(() => {
            this.field.options = [];
            this.field.isQuerying = true;

            this.changeDetectorRef.markForCheck();
          }),
          debounceTime(300),
          switchMap((query: string) => !!query
            ? this.field.optionsProvider(query).pipe(catchError(() => of<TOption[]>([])))
            : of([])),
          takeUntil(this.destroy))
        .subscribe(options => {
          this.field.options = options;
          this.field.isQuerying = false;

          this.changeDetectorRef.markForCheck();
        });
    }

    // ensure that filtered options are initialized with pending selection
    if (this.field.control.updateOn == "blur") {
      overrideFunction(
        this.select,
        select => select._initializeSelection,
        (_, select) => {
          Promise.resolve().then(() => {
            if (select.ngControl) {
              select._value = select.ngControl.value;
            }

            let selectedIds = this.selection.selected.map(value => this.field.optionId(value));

            let matchedOptions = this.select.options.filter(option =>
              (option.value && selectedIds.includes(this.field.optionId(option.value))) ||
              this.selection.selected.includes(option.value));

            select._selectionModel.setSelection(...matchedOptions);

            select.stateChanges.next();
          });
        });
    }
  }
}
