import { ValidatorFn, ValidationErrors, AbstractControl as AbstractControlBase, Validators } from "@angular/forms";

export type ValueProvider<TValue, TResult> = (value?: TValue) => TResult;

export interface AbstractControl<TValue> extends AbstractControlBase {
  value: TValue;
}

export const CustomValidators = {
  triggerValidation: (control: AbstractControl<any>, predicate: (siblingControl: AbstractControl<any>) => boolean): void => {
    if (control.parent) {
      setTimeout(() => {
        Object.values(control.parent?.controls || {})
          .filter(siblingControl => siblingControl !== control && predicate(siblingControl))
          .forEach(siblingControl => siblingControl.updateValueAndValidity());
      });
    }
  },

  required(control: AbstractControl<string>): ValidationErrors | null {
    if (typeof control.value == "string") {
      return (control.value || "").trim() != ""
        ? null
        : {
          required: {
            expected: true,
          }
        };
    }
    else {
      return Validators.required(control);
    }
  },

  minDate(minDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        minDate == null ||
        minDate.valueOf() < control.value.valueOf()
        ? null
        : {
          minDate: {
            expected: minDate,
          }
        };
    };
  },

  minOrEqualDate(minOrEqualDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        minOrEqualDate == null ||
        minOrEqualDate.valueOf() <= control.value.valueOf()
        ? null
        : {
          minOrEqualDate: {
            expected: minOrEqualDate,
          }
        };
    };
  },

  maxDate(maxDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        maxDate == null ||
        maxDate.valueOf() > control.value.valueOf()
        ? null
        : {
          maxDate: {
            expected: maxDate,
          }
        };
    };
  },

  maxOrEqualDate(maxOrEqualDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        maxOrEqualDate == null ||
        maxOrEqualDate.valueOf() >= control.value.valueOf()
        ? null
        : {
          maxOrEqualDate: {
            expected: maxOrEqualDate,
          }
        };
    };
  },

  custom<T>(valid: boolean): ValidatorFn {
    return (control: AbstractControl<any>): ValidationErrors | null => {
      return valid
        ? null
        : {
          custom: {
            value: control.value
          }
        };
    };
  },
};

export interface ValidationItemConstructor<TValue, TResult> {
  value: TResult | ValueProvider<TValue, TResult>;

  text?: string;
}

export class ValidationItem<TValue, TResult> implements ValidationItemConstructor<TValue, TResult> {

  public value: TResult | ValueProvider<TValue, TResult>;

  public text?: string;

  constructor(props: Partial<ValidationItem<TValue, TResult>>) {
    Object.assign(this, props);
  }

  public getValue(controlValue?: TValue): TResult {
    return this.value instanceof Function
      ? this.value(controlValue)
      : this.value;
  }

  public validate(
    validator: (value: TResult) => ValidatorFn,
    onValidationComplete?: (control: AbstractControl<TValue>, validationErrors: ValidationErrors | null) => void
  ): (control: AbstractControl<TValue>) => ValidationErrors | null {
    return control => {
      let value = this.getValue(control.value);

      if (value != null) {
        let validationErrors = validator(value)(control);

        if (onValidationComplete) {
          onValidationComplete(control, validationErrors);
        }

        return validationErrors;
      }
      else {
        return null;
      }
    };
  }
}

export type ValidationConstructor<TValue> =
  Partial<{ [K in keyof Validation<TValue>]: Partial<Validation<TValue>[K]> }>;

export class Validation<TValue> {

  [key: string]: ValidationItem<TValue, any> | undefined;

  public required?: ValidationItem<TValue, boolean>;

  public requiredTrue?: ValidationItem<TValue, boolean>;

  public minLength?: ValidationItem<TValue, number>;

  public maxLength?: ValidationItem<TValue, number>;

  public min?: ValidationItem<TValue, number>;

  public max?: ValidationItem<TValue, number>;

  public minDate?: ValidationItem<TValue, Date>;

  public minOrEqualDate?: ValidationItem<TValue, Date>;

  public maxDate?: ValidationItem<TValue, Date>;

  public maxOrEqualDate?: ValidationItem<TValue, Date>;

  public pattern?: ValidationItem<TValue, string | RegExp>;

  public custom?: ValidationItem<TValue, boolean>;

  constructor(props: ValidationConstructor<TValue>) {
    Object
      .keys(props || {})
      .forEach(key => {
        this[key] = new ValidationItem(props[key] as Partial<ValidationItem<TValue, any>>);
      });
  }
}
