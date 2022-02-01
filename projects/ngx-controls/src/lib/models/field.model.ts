import { Observable, Subject } from "rxjs";
import { filter as filterPredicate, first, pairwise, startWith, takeUntil } from "rxjs/operators";
import { FormControl, ValidatorFn, Validators, FormGroup } from "@angular/forms";
import { startCase } from "lodash-es";

import { Validation, ValueProvider, CustomValidators, ValidationConstructor } from "./validation.model";
import { DateFnsPipe, DateTimePipe } from "../pipes";
import { MAT_DATE_APP_FORMATS } from "./date-formats.model";

export const Formatters = {

  utcDateFormatter: (field: Field<Date>): string => {
    return new DateFnsPipe(MAT_DATE_APP_FORMATS).transform(field.value, "yyyy-MM-dd");
  },

  utcDateTimeFormatter: (field: Field<Date>): string => {
    return new DateFnsPipe(MAT_DATE_APP_FORMATS).transform(field.value?.toUtcDate(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  },

  dateFormatter: (field: Field<Date>) => {
    return new DateFnsPipe(MAT_DATE_APP_FORMATS).transform(field.value);
  },

  dateTimeFormatter: (field: Field<Date>) => {
    return new DateTimePipe(MAT_DATE_APP_FORMATS).transform(field.value);
  }
};

export class Option<TValue, TId = string> {
  public id: TId;

  public name: string;

  public label: string;

  public value: TValue;

  public static ForEnum<TEnum extends number | string>(operator: any) {
    let entries = Object.entries(operator) as [string, string | number][];;

    let numberEntries = entries.filter(([, value]) => typeof value == "number") as [string, number][];

    return (numberEntries.length > 0 ? numberEntries : entries)
      .map(([key, value]: [string, string | number]) => {
        return Object.assign(new Option<TEnum>(), {
          label: startCase(key).replace(/\s(\d)/g, "$1"), // remove extra spaces when formatting digits
          name: key,
          value: value,
        } as Option<TEnum>);
      });
  }
}

type FieldConstructor<TValue, TOption = any, TOptionGroup = any> =
  Partial<Omit<Field<TValue, TOption, TOptionGroup>, "control" | "options" | "onValueChange" | "onOptionsChange" | "validation"> & {
    options: TOption[] | Observable<TOption[]>;

    onValueChange: (value: TValue, previous?: TValue) => any;

    onOptionsChange: (value: TOption[]) => any;

    validation: ValidationConstructor<TValue>;
  }>;

export class Field<TValue, TOption = any, TOptionGroup = any> {

  private destroy$ = new Subject();

  private _options: TOption[];

  public optionChangesSubject = new Subject<TOption[]>();

  public control: FormControl;

  public name: string;

  public placeholder?: string;

  public label?: string;

  public info?: string;

  public tooltipDisabled?: boolean;

  public get options(): TOption[] {
    return this._options;
  }

  public set options(value: TOption[]) {
    this._options = value;

    this.optionChangesSubject.next(value);
  }

  public validation: Validation<TValue>;

  public valueChanges: Observable<TValue>;

  public formatter: (field: Field<TValue, TOption, TOptionGroup>) => any;

  public converter: { fromFieldValue: (value: any) => TValue; toFieldValue: (value: TValue) => any };

  public disabled: boolean;

  public isQuerying: boolean;

  public updateOn?: "change" | "blur" | "submit";

  public optionsFilterPredicate: (option: TOption, filter: string) => boolean;

  public optionsGroupProvider?: (option: TOption) => TOptionGroup;

  public optionGroupLabel: (optionGroup: TOptionGroup) => string;

  public optionId: (index: number, option: TOption) => any;

  public optionLabel: (option: TOption) => string;

  public optionValue: (option: TOption) => any;

  public optionDisabled: (option: TOption) => boolean;

  public queryOptions: (query: string) => void;

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

    this.valueChanges = this.control.valueChanges;

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
      this.optionChangesSubject
        .pipe(takeUntil(this.destroy$))
        .subscribe(props.onOptionsChange);

      delete props.onOptionsChange;
    }

    if (props.options instanceof Observable) {
      this.isQuerying = true;

      props.options.subscribe({
        next: options => {
          this.options = options;

          this.optionChangesSubject.next(options);

          this.isQuerying = false;
        },
        error: () => {
          this.isQuerying = false;
        }
      });

      delete props.options;
    }

    delete props.validation;

    this.optionsFilterPredicate = (option: any, filter) => {
      return this.optionLabel(option)?.toLowerCase().includes(filter.toLowerCase());
    };

    this.optionGroupLabel = (optionGroup: TOptionGroup) => optionGroup as any;
    this.optionId = (index: number, option: any) => option.id || option;
    this.optionLabel = (option: any) => option.label || "";
    this.optionValue = (option: any) => {
      if (option instanceof Option) {
        return option.value;
      }
      else {
        return option;
      }
    };
    this.optionDisabled = _ => false;

    Object.assign(this, props);
  }

  public visibilityProvider: ValueProvider<TValue, boolean> = () => true;

  public get formGroup(): FormGroup {
    return this.control?.parent as FormGroup;
  }

  public get visible() {
    return !!this.visibilityProvider(this.value);
  }

  public set visible(isVisible: boolean) {
    this.visibilityProvider = () => !!isVisible;

    this.control.updateValueAndValidity({ emitEvent: false });
  }

  public get value() {
    return this.converter
      ? this.converter.fromFieldValue(this.control.value)
      : this.control.value as TValue;
  }

  public set value(value: TValue) {
    let convertedValue = this.converter
      ? this.converter.toFieldValue(value)
      : value;

    if (convertedValue != this.control.value) {
      this.control.setValue(convertedValue);
    }
  }

  public get formattedValue() {
    return this.formatter
      ? this.formatter(this)
      : this.value;
  }

  public disable() {
    this.control.disable({ onlySelf: true, emitEvent: false });

    this.control.updateValueAndValidity();
  }

  public enable() {
    this.control.enable({ onlySelf: true, emitEvent: false });

    this.control.updateValueAndValidity();
  }

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
        this.optionChangesSubject
          .pipe(first())
          .subscribe(() => optionsProvider());
      }
      else {
        optionsProvider();
      }
    });
  }

  public updateValidation(validation: ValidationConstructor<TValue>) {
    Object.assign(this.validation, new Validation(validation));

    this.control.setValidators(this.validators);
  }

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
