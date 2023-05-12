import { Observable, of, merge } from "rxjs";
import { catchError, debounceTime, filter, first, startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import {
  Component, OnInit, AfterViewInit, OnChanges, Input, Optional, ElementRef, ChangeDetectorRef,
  ViewChild, ContentChild, TemplateRef, ChangeDetectionStrategy, Output, EventEmitter, NgZone,
} from "@angular/core";
import { AppMatOption } from "@angular/material/core";
import { AppMatSelect, MatSelect } from "@angular/material/select";
import { FormControl } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
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
})
export class SelectControlComponent<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  extends ControlBase<TValue, TOption, TOptionGroup, TFormattedValue, TControlValue>
  implements OnInit, AfterViewInit, OnChanges, ActionableControl {

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

  @ViewChild(MatSelect, { static: true })
  public select: AppMatSelect;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport?: CdkVirtualScrollViewport;

  @ViewChild("selectAllOption")
  public selectAllOption?: AppMatOption;

  @ContentChild("headerTemplate", { static: true })
  public headerTemplate: TemplateRef<any>;

  @ContentChild("optionTemplate", { static: true })
  public optionTemplate: TemplateRef<{ $implicit: string; option: TOption }>;

  @ContentChild("triggerTemplate", { static: true })
  public triggerTemplate: TemplateRef<{ $implicit: string; option: TOption | TOption[] }>;

  public dropdownHeight = this.optionHeight * this.visibleOptionsCount;

  public get viewportHeight() {
    return this.dropdownHeight -
      (this.searchable ? this.optionHeight : 0) -
      (this.selectAllOption ? this.optionHeight + 15 : 0);
  }
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

    this.selection = new SelectionModel<TOption>(this.multiple, [], true);

    this.patchSelectTrigger();
    this.addCustomSelectionModel();
    this.addOptionsFilteringSupport();
    this.updateOptionsAndViewportOnMenuOpen();

    if (this.multiple && this.showSelectAll) {
      this.updateSelectAllStateOnSelectionChanges();
    }
  }

  public ngAfterViewInit() {
    this.updateSelectAllState();
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
    return left != null && right != null && this.field.optionId(left) == this.field.optionId(right);
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

    this.select._selectionModel.clear();

    this.changeDetectorRef.markForCheck();
  }

  public toggleSelectAll() {
    let shouldSelect = this.selection.selected.length != this.field.options.length;

    let options = this.field.options
      .filter(option => !this.field.optionDisabled(option));

    let matOptions = this.select.options
      .filter(option => !option.disabled && option.id != this.selectAllOption?.id);

    (matOptions as any as AppMatOption<any>[])
      .forEach(option => {
        option._selected = shouldSelect;
        option._changeDetectorRef.markForCheck();
      });

    if (shouldSelect) {
      this.selection.select(...options);
      this.select._selectionModel.select(...matOptions);
    }
    else {
      this.selection.deselect(...options);
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
        let matchedOptions: TOption[];

        if (this.field.control.value instanceof Array) {
          let values = this.field.control.value;
          let ids = this.field.control.value.map(value => this.field.optionId(value));

          matchedOptions = this.field.options.filter(option =>
            ids.contains(this.field.optionId(option)) ||
            values.contains(this.field.optionValue(option)));
        }
        else {
          let value = this.field.control.value as any;

          matchedOptions = this.field.options.filter(option =>
            (value != null && this.field.optionId(value) == this.field.optionId(option)) ||
            this.field.control.value == this.field.optionValue(option));
        }

        this.selection.clear();

        if (matchedOptions.length > 0) {
          this.selection.select(...matchedOptions);

          // synchronize with select model
          this.select._initializeSelection();
        }
      });
  }

  /**
   * Delegates "empty" state detection to custom selection model.
   * Updates select trigger label based on custom selection model.
   */
  private patchSelectTrigger() {
    Object.defineProperty(this.select, "empty", {
      get: () => !this.selection.hasValue()
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
  private updateSelectAllStateOnSelectionChanges() {
    this.selection.changed
      .pipe(startWith(this.selection.selected), takeUntil(this.destroy))
      .subscribe(() => this.updateSelectAllState());
  }

  private updateSelectAllState() {
    let selected = !this.selection.selected.length
      ? false
      : this.selection.selected.length === this.field.options?.length
        ? true : null;

    if (this.selectAllOption) {
      let matCheckbox = this.selectAllOption._element.nativeElement
        .querySelector("mat-pseudo-checkbox");

      if (selected == null) {
        matCheckbox.classList.remove("mat-pseudo-checkbox-checked");

        matCheckbox.classList.add("mat-pseudo-checkbox-indeterminate");
      }
      else {
        matCheckbox.classList.remove("mat-pseudo-checkbox-indeterminate");

        matCheckbox.classList.toggle("mat-pseudo-checkbox-checked", selected);
      }
    }
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

            select._selectionModel.clear();
            select._selectionModel.select(...matchedOptions);

            select.stateChanges.next();
          });
        });
    }
  }
}
