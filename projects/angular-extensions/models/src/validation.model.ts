import { Observable, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ValidatorFn, ValidationErrors, AbstractControl as AbstractControlBase, Validators, AsyncValidatorFn } from "@angular/forms";

export type ValueProvider<TValue, TResult> = (value?: TValue) => TResult;

/**
 * Generic representation of Angular's AbstractControl
 */
export interface AbstractControl<TValue> extends AbstractControlBase {
  value: TValue;
}

export const CustomValidators = {

  emailRegex: new RegExp(
    `^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+` +
    `(?:\.[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?` +
    `(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`),

  /**
   * Triggers validation of related controls by specified predicate.
   *
   * @param control Control that triggers validation
   * @param predicate Related controls predicate
   */
  triggerValidation: (control: AbstractControl<any>, predicate: (siblingControl: AbstractControl<any>) => boolean): void => {
    if (control.parent) {
      setTimeout(() => {
        Object.values(control.parent?.controls || {})
          .filter(siblingControl =>
            siblingControl !== control && siblingControl.validator &&
            siblingControl.touched && predicate(siblingControl))
          .forEach(siblingControl => siblingControl.setErrors(siblingControl.validator(siblingControl)));
      });
    }
  },

  /**
   * Custom validation that requires non empty string values
   *
   * @param control AbstractControl
   * @returns Validation function
   */
  required(control: AbstractControl<any>): ValidationErrors | null {
    if (typeof control.value == "string") {
      return (control.value || "").trim() != ""
        ? null
        : { required: { expected: true } };
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
        : { minDate: { expected: minDate } };
    };
  },

  minOrEqualDate(minOrEqualDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        minOrEqualDate == null ||
        minOrEqualDate.valueOf() <= control.value.valueOf()
        ? null
        : { minOrEqualDate: { expected: minOrEqualDate } };
    };
  },

  maxDate(maxDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        maxDate == null ||
        maxDate.valueOf() > control.value.valueOf()
        ? null
        : { maxDate: { expected: maxDate } };
    };
  },

  maxOrEqualDate(maxOrEqualDate: Date): ValidatorFn {
    return (control: AbstractControl<Date>): ValidationErrors | null => {
      return control.value == null ||
        maxOrEqualDate == null ||
        maxOrEqualDate.valueOf() >= control.value.valueOf()
        ? null
        : { maxOrEqualDate: { expected: maxOrEqualDate } };
    };
  },

  custom(valid: boolean): ValidatorFn {
    return (control: AbstractControl<any>): ValidationErrors | null => {
      return valid
        ? null
        : { custom: { value: control.value } };
    };
  },

  async(valid: Observable<boolean> | Promise<boolean>): AsyncValidatorFn {
    return (control: AbstractControl<any>): Observable<ValidationErrors | null> => {
      if(valid instanceof Promise) {
        valid = from(valid);
      }

      return valid.pipe(map(result => result ? null : { async: { value: control.value } }));
    };
  },

  native(input?: HTMLInputElement): ValidatorFn {
    return (control: AbstractControl<any>): ValidationErrors | null => {
      return !input || input.checkValidity()
        ? null
        : { native: { value: control.value } };
    };
  },
};

export interface ValidationItemConstructor<TValue, TResult> {
  value: TResult | ValueProvider<TValue, TResult>;

  text?: string;
}

/**
 * Contains validation data provider and provides generic method to validate AbstractControl
 */
export class ValidationItem<TValue, TResult> implements ValidationItemConstructor<TValue, TResult> {

  /**
   * Validation data provider
   */
  public value: TResult | ValueProvider<TValue, TResult>;

  /**
   * Validation error text
   */
  public text?: string;

  constructor(props: Partial<ValidationItem<TValue, TResult>>) {
    Object.assign(this, props);
  }

  /**
   * Gets constant value if possible or executes provider function
   *
   * @param controlValue Actual AbstractControl value
   * @returns Validation data
   */
  public getValue(controlValue?: TValue): TResult {
    return this.value instanceof Function
      ? this.value(controlValue)
      : this.value;
  }

  /**
   * Returns AbstractControl validation function based on provided validator and validation data
   *
   * @param validator AbstractControl validator
   * @param onValidationComplete Validation completed hook
   * @returns AbstractControl validation function
   */
  public validate(
    validator: (value: TResult) => ValidatorFn,
    onValidationComplete?: (control: AbstractControl<TValue>, validationErrors: ValidationErrors | null) => void
  ): ValidatorFn {
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

  /**
   * Returns AbstractControl async validation function based on provided validator and validation data
   *
   * @param validator AbstractControl validator
   * @param onValidationComplete Validation completed hook
   * @returns AbstractControl validation function
   */
  public validateAsync(
    validator: (value: TResult) => AsyncValidatorFn,
    onValidationComplete?: (control: AbstractControl<TValue>, validationErrors: ValidationErrors | null) => void
  ): AsyncValidatorFn {
    return control => {
      let value = this.getValue(control.value);

      if (value != null) {
        let validationErrors$ = validator(value)(control);

        if (onValidationComplete && validationErrors$ instanceof Observable) {
          validationErrors$ = validationErrors$.pipe(tap(validationErrors => onValidationComplete(control, validationErrors)));
        }

        return validationErrors$;
      }
      else {
        return null;
      }
    };
  }
}

export type ValidationConstructor<TValue> =
  Partial<{ [K in keyof Validation<TValue>]: Partial<Validation<TValue>[K]> }>;

/**
 * Contains Field's available validation components
 */
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

  public async?: ValidationItem<TValue, Observable<boolean> | Promise<boolean>>;

  public native?: ValidationItem<TValue, HTMLInputElement>;

  constructor(props: ValidationConstructor<TValue>) {
    Object
      .keys(props || {})
      .forEach(key => {
        this[key] = new ValidationItem(props[key] as Partial<ValidationItem<TValue, any>>);
      });
  }

  /**
   * Builds AbstractControl validators based on Validation object
   *
   * @param validation
   * @returns
   */
  public static getValidators(validation: Validation<any>): ValidatorFn[] {
    let validators: ValidatorFn[] = [];

    if (validation) {
      if (validation.required) {
        validators.push(validation.required.validate(
          isRequired => isRequired ? CustomValidators.required : () => null,
          (control, errors) => {
            if (errors == null) {
              CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("required"));
            }
          }));
      }

      if (validation.requiredTrue) {
        validators.push(validation.requiredTrue.validate(isRequiredTrue => isRequiredTrue ? Validators.requiredTrue : () => null));
      }

      if (validation.minLength) {
        validators.push(validation.minLength.validate(Validators.minLength));
      }

      if (validation.maxLength) {
        validators.push(validation.maxLength.validate(Validators.maxLength));
      }

      if (validation.min) {
        validators.push(validation.min.validate(Validators.min, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("max"));
          }
        }));
      }

      if (validation.max) {
        validators.push(validation.max.validate(Validators.max, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl => siblingControl.hasError("min"));
          }
        }));
      }

      if (validation.minDate) {
        validators.push(validation.minDate.validate(CustomValidators.minDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("maxDate") || siblingControl.hasError("maxOrEqualDate"));
          }
        }));
      }

      if (validation.minOrEqualDate) {
        validators.push(validation.minOrEqualDate.validate(CustomValidators.minOrEqualDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("maxDate") || siblingControl.hasError("maxOrEqualDate"));
          }
        }));
      }

      if (validation.maxDate) {
        validators.push(validation.maxDate.validate(CustomValidators.maxDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("minDate") || siblingControl.hasError("minOrEqualDate"));
          }
        }));
      }

      if (validation.maxOrEqualDate) {
        validators.push(validation.maxOrEqualDate.validate(CustomValidators.maxOrEqualDate, (control, errors) => {
          if (errors == null) {
            CustomValidators.triggerValidation(control, siblingControl =>
              siblingControl.hasError("minDate") || siblingControl.hasError("minOrEqualDate"));
          }
        }));
      }

      if (validation.pattern) {
        validators.push(validation.pattern.validate(Validators.pattern));
      }

      if (validation.custom) {
        validators.push(validation.custom.validate(CustomValidators.custom));
      }

      if (validation.native) {
        validators.push(validation.native.validate(CustomValidators.native));
      }
    }

    return validators;
  }

  /**
   * Builds AbstractControl async validators based on Validation object
   *
   * @param validation
   * @returns
   */
  public static getAsyncValidators(validation: Validation<any>): AsyncValidatorFn[] {
    let validators: AsyncValidatorFn[] = [];

    if (validation) {
      if (validation.async) {
        validators.push(validation.async.validateAsync(CustomValidators.async));
      }
    }

    return validators;
  }
}
