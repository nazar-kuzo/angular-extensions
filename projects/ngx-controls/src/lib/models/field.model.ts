import { toString } from "lodash-es";
import { Observable, Subject } from "rxjs";
import { filter as filterPredicate, first, pairwise, startWith, takeUntil } from "rxjs/operators";
import { FormControl, ValidatorFn, Validators, FormGroup } from "@angular/forms";

import { Validation, ValueProvider, CustomValidators, ValidationConstructor } from "./validation.model";
import { DatePipe, DateTimePipe, StartCasePipe } from "../pipes";
import { MAT_DATE_APP_FORMATS } from "./date-formats.model";

/**
 * Constructor object for Field class
 */
type FieldConstructor<TValue, TOption = any, TOptionGroup = any, TConvertedValue = any> =
  Partial<Omit<Field<TValue, TOption, TOptionGroup, TConvertedValue>, "control" | "options" | "onValueChange" | "onOptionsChange" | "validation"> & {
    options: TOption[] | Observable<TOption[]>;

    onValueChange: (value: TValue, previous?: TValue) => any;

    onOptionsChange: (value: TOption[]) => any;

    validation: ValidationConstructor<TValue>;

    /**
     * Indicates field initial state
     */
    disabled: boolean;

    /**
     * Configures when {@link valueChanges} should emit event.
     */
    updateOn?: "change" | "blur" | "submit";
  }>;

/**
 * Commonly used Field value formatters
 */
export const Formatters = {

  /**
   * Formats Field<Date> value to UTC date ("yyyy-MM-dd") string.
   * @param field Field<Date>
   * @returns String
   */
  utcDateFormatter: (field: Field<Date>): string => {
    return new DatePipe(MAT_DATE_APP_FORMATS).transform(field.value, "yyyy-MM-dd");
  },

  /**
   * Formats Field<Date> value to UTC date/time ("yyyy-MM-dd'T'HH:mm:ss'Z'") string.
   * @param field Field<Date>
   * @returns String
   */
  utcDateTimeFormatter: (field: Field<Date>): string => {
    return new DatePipe(MAT_DATE_APP_FORMATS).transform(field.value?.toUtcDate(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  },

  /**
   * Formats Field<Date> value to date string with {@link DatePipe} and {@link MAT_DATE_APP_FORMATS}
   * @param field Field<Date>
   * @returns String
   */
  dateFormatter: (field: Field<Date>) => {
    return new DatePipe(MAT_DATE_APP_FORMATS).transform(field.value);
  },

  /**
   * Formats Field<Date> value to date/time string with {@link DateTimePipe} and {@link MAT_DATE_APP_FORMATS}
   * @param field Field<Date>
   * @returns String
   */
  dateTimeFormatter: (field: Field<Date>) => {
    return new DateTimePipe(MAT_DATE_APP_FORMATS).transform(field.value);
  }
};

interface FieldValueConverter<TValue, TConvertedValue> {

  fromFieldValue: (value: TConvertedValue) => TValue;

  toFieldValue: (value: TValue) => TConvertedValue;
}

/**
 * Field option that can be used in select-control, etc.
 */
export class Option<TValue, TId = string> {

  private static startCasePipe = new StartCasePipe();

  public id: TId;

  public name: string;

  public label: string;

  public value: TValue;

  constructor(props?: Partial<Option<TValue, TId>>) {
    Object.assign(this, props);

    if (!this.name) {
      this.name = this.value as any as string;
    }
  }

  /**
   * Creates options from specified Emun
   * @param enumType Emum type
   * @param insertSpaceBeforeDigits Should inserta space before digit present in string. E.g. "every10Month" => "Every 10 Month"
   * @returns Collection of options
   */
  public static ForEnum<TEnum extends number | string>(enumType: any, insertSpaceBeforeDigits = false): Option<TEnum>[] {
    let entries = Object.entries(enumType) as [string, string | number][];;

    let numberEntries = entries.filter(([, value]) => typeof value == "number") as [string, number][];

    return (numberEntries.length > 0 ? numberEntries : entries)
      .map(([key, value]: [string, string | number]) => {
        return Object.assign(new Option<TEnum>({
          label: this.startCasePipe.transform(key, insertSpaceBeforeDigits),
          name: key,
          value: value as TEnum,
        }));
      });
  }
}

/**
 * Provides simplified api to work with Angular reactive forms and predefined ngx-controls compomnents.
 */
export class Field<TValue, TOption = any, TOptionGroup = any, TConvertedValue = any> {

  private optionChanges$ = new Subject<TOption[]>();

  private destroy$ = new Subject();

  private _options: TOption[];

  /**
   * Angular FormControl of field. ngx-controls components communicates via this control between Field and UI
   */
  public control: FormControl;

  /**
   * Name of a field inside parent's FormGroup, etc.
   */
  public name: string;

  /**
   * Placeholder of a field
   */
  public placeholder?: string;

  /**
   * Label of a field
   */
  public label?: string;

  /**
   * Info text of field showed in mat-hint
   */
  public info?: string;

  /**
   * Validations of a field
   */
  public validation: Validation<TValue>;

  /**
   * Field value formatter which is used by {@link formattedValue}. See list of built-in {@link Formatters}
   */
  public formatter: (field: Field<TValue, TOption, TOptionGroup>) => string;

  /**
   * Field value converter, convertion is done whenever value is being read from/written to a {@link control}.
   */
  public converter: FieldValueConverter<TValue, TConvertedValue>;

  /**
   * Configures when field should be visible, by default is always visible.
   */
  public visibilityProvider: ValueProvider<TValue, boolean>;

  /**
   * Determines whether field is querying data: options, etc.
   */
  public isQuerying: boolean;


  /**
   * Gets field's parent as form group
   */
  public get formGroup() {
    return this.control?.parent as FormGroup | null;
  }

  /**
   * Gets fild's visibility status. Based on {@link visibilityProvider}.
   */
  public get visible() {
    return !!this.visibilityProvider(this.value);
  }

  /**
   * Sets fild's visibility status. Based on {@link visibilityProvider}.
   */
  public set visible(isVisible: boolean) {
    this.visibilityProvider = () => !!isVisible;

    this.control.updateValueAndValidity();
  }

  /**
   * Gets fild's value. Applies conversion if specified at {@link converter}.
   */
  public get value() {
    return this.converter
      ? this.converter.fromFieldValue(this.control.value)
      : this.control.value as TValue;
  }

  /**
   * Sets fild's value. Applies conversion if specified at {@link converter}.
   * If previous value is the same as current value, {@link onValueChange} wont emit changes
   */
  public set value(value: TValue) {
    let convertedValue = this.converter
      ? this.converter.toFieldValue(value)
      : value;

    if (convertedValue != this.control.value) {
      this.control.setValue(convertedValue);
    }
  }

  /**
   * Gets formatted value, applies {@link formatter} if exists
   */
  public get formattedValue(): string {
    return this.formatter
      ? this.formatter(this)
      : toString(this.value);
  }

  /**
   * Gets Field's options
   */
  public get options(): TOption[] {
    return this._options;
  }

  /**
   * Sets Field's options and notifies subscribers.
   */
  public set options(value: TOption[]) {
    this._options = value;

    this.optionChanges$.next(value);
  }

  /**
   * Options filter predicate that is used by select-control, by default filters by option label
   */
  public optionsFilterPredicate: (option: TOption, filter: string) => boolean;

  /**
   * Custom option identifier that is used by select-control to compare options
   */
  public optionId: (index: number, option: TOption) => any;

  /**
   * Custom option label provider that is used by select-control
   */
  public optionLabel: (option: TOption) => string;

  /**
   * Allows to specify option display label when selected or being howered
   */
  public optionDisplayLabel?: (option: TOption) => string;

  /**
   * Custom option value provider that is used by select-control
   */
  public optionValue: (option: TOption) => any;

  /**
   * Custom option availability provider that is used by select-control
   */
  public optionDisabled: (option: TOption) => boolean;

  /**
   * Options query provider of field
   */
  public optionsSearchProvider?: (query: string) => Observable<TOption[]>;

  /**
   * Options group provider that is used by select-control.
   */
  public optionsGroupProvider?: (option: TOption) => TOptionGroup;

  /**
   * Custom option group label provider that is used by select-control
   */
  public optionGroupLabel: (optionGroup: TOptionGroup) => string;

  constructor(props: FieldConstructor<TValue, TOption, TOptionGroup>) {
    this.validation = new Validation(props.validation || {});

    this.control = new FormControl(
      {
        value: props.value,
        disabled: props.disabled != null ? props.disabled : true,
      },
      {
        validators: this.validators,
        updateOn: props.updateOn,
      });

    if (props.onValueChange) {
      let onValueChange = props.onValueChange;

      this.control
        .valueChanges
        .pipe(
          filterPredicate(() => this.control.enabled),
          startWith(undefined),
          pairwise(),
          takeUntil(this.destroy$),
        )
        .subscribe(([previous, current]) => onValueChange(current as TValue, previous));

      delete props.onValueChange;
    }

    if (props.onOptionsChange) {
      this.optionChanges$
        .pipe(takeUntil(this.destroy$))
        .subscribe(props.onOptionsChange);

      delete props.onOptionsChange;
    }

    if (props.options) {
      this.setOptions(props.options);

      delete props.options;
    }

    delete props.validation;

    this.optionsFilterPredicate = (option: any, filter) => {
      return this.optionLabel(option)?.toLowerCase().includes(filter.toLowerCase());
    };

    this.visibilityProvider = () => true
    this.optionGroupLabel = (optionGroup: TOptionGroup) => optionGroup as any;
    this.optionId = (index: number, option: any) => option.id || option;
    this.optionLabel = (option: any) => option.label || "";
    this.optionDisabled = _ => false;
    this.optionValue = (option: any) => {
      if (option instanceof Option) {
        return option.value;
      }
      else {
        return option;
      }
    };

    Object.assign(this, props);
  }

  /**
   * Sets Field's options. Subscribes to Observable input and tracks status in {@link isQuerying} property
   */
  public setOptions(value: TOption[] | Observable<TOption[]>) {
    if (value instanceof Observable) {
      this.isQuerying = true;

      value.subscribe({
        next: options => {
          this.options = options;

          this.isQuerying = false;
        },
        error: () => {
          this.isQuerying = false;
        }
      });
    }
    else {
      this.options = value;
    }
  }

  /**
   * Selects values from available options based on options predicate. Honors
   * @param optionPredicate Options predicate that will select values from
   * @param config Configures default value if nothing selected or should it emit value change event.
   * @returns Promise
   */
  public setFromOptions(
    optionPredicate: (option: TOption) => boolean,
    config: { defaultValue?: TValue; emitEvent?: boolean } = { defaultValue: undefined, emitEvent: true },
  ) {
    return new Promise<void>(resolve => {
      let optionsProvider = () => {
        let value = this.value instanceof Array
          ? this.options.filter(optionPredicate).map(this.optionValue)
          : this.optionValue(this.options.find(optionPredicate) as TOption) || config.defaultValue as any;

        if (value !== this.control.value) {
          this.control.setValue(value, { emitEvent: config.emitEvent });
        }

        resolve();
      };

      if (this.isQuerying) {
        this.optionChanges$
          .pipe(first())
          .subscribe(() => optionsProvider());
      }
      else {
        optionsProvider();
      }
    });
  }

  /**
   * Updates field validation
   * @param validation Validation constructor parameters
   */
  public updateValidation(validation: ValidationConstructor<TValue>) {
    Object.assign(this.validation, new Validation(validation));

    this.control.setValidators(this.validators);
  }

  /**
   * Destroys field and its subscriptions
   */
  public destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private get validators() {
    let validators: ValidatorFn[] = [];

    if (this.validation) {
      if (this.validation.required) {
        validators.push(this.validation.required.validate(
          isRequired => isRequired ? CustomValidators.required : () => null,
          (control, errors) => {
            if (errors == null) {
              CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("required"));
            }
          }));
      }

      if (this.validation.requiredTrue) {
        validators.push(this.validation.requiredTrue.validate(isRequiredTrue => isRequiredTrue ? Validators.requiredTrue : () => null));
      }

      if (this.validation.minLength) {
        validators.push(this.validation.minLength.validate(Validators.minLength));
      }

      if (this.validation.maxLength) {
        validators.push(this.validation.maxLength.validate(Validators.maxLength));
      }

      if (this.validation.min) {
        validators.push(this.validation.min.validate(Validators.min, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("max"));
          }
        }));
      }

      if (this.validation.max) {
        validators.push(this.validation.max.validate(Validators.max, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("min"));
          }
        }));
      }

      if (this.validation.minDate) {
        validators.push(this.validation.minDate.validate(CustomValidators.minDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("maxDate") || siblingControl.hasError("maxOrEqualDate"));
          }
        }));
      }

      if (this.validation.minOrEqualDate) {
        validators.push(this.validation.minOrEqualDate.validate(CustomValidators.minOrEqualDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("maxDate") || siblingControl.hasError("maxOrEqualDate"));
          }
        }));
      }

      if (this.validation.maxDate) {
        validators.push(this.validation.maxDate.validate(CustomValidators.maxDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("minDate") || siblingControl.hasError("minOrEqualDate"));
          }
        }));
      }

      if (this.validation.maxOrEqualDate) {
        validators.push(this.validation.maxOrEqualDate.validate(CustomValidators.maxOrEqualDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("minDate") || siblingControl.hasError("minOrEqualDate"));
          }
        }));
      }

      if (this.validation.pattern) {
        validators.push(this.validation.pattern.validate(Validators.pattern));
      }

      if (this.validation.custom) {
        validators.push(this.validation.custom.validate(CustomValidators.custom));
      }
    }

    return validators;
  }
}
