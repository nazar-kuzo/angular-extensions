import { remove } from "lodash-es";
import { FormGroup, AbstractControl, FormArray } from "@angular/forms";

import { Field } from "./field.model";

/**
 * Provides API to work with Form validation based on provided Fields
 */
export class Form {

  private fields: Field<any>[] = [];

  /**
   * Angular's Form group
   */
  public formGroup: FormGroup;

  /**
   * Indicates if Form is invalid
   */
  public get invalid() {
    return this.formGroup.invalid;
  }

  /**
   * Indicates if Form is valid
   */
  public get valid() {
    return this.formGroup.valid;
  }

  constructor(...fields: Field<any>[]) {
    this.formGroup = new FormGroup({});

    fields.forEach(field => {
      this.addField(field);
    });
  }

  /**
   * Creates Form from a {@link BaseEditor} model, based on Field properties of a model.
   * Assigns Field name based on property name of a model.
   * Enables each discovered Field property unless is explicitly disabled.
   * @param model {@link BaseEditor} model
   * @param onCreated Initialization hook that is called right after FormGroup was constructed
   * @returns Form
   */
  public static Create<TModel>(model: TModel, onCreated?: () => void) {
    let form = new Form();

    Object
      .keys(model)
      .forEach(key => {
        if ((model as any)[key] instanceof Field) {
          ((model as any)[key] as Field<any>).name = key;
        }
      });

    Object
      .keys(model)
      .map(prop => (model as any)[prop])
      .filter(field => field instanceof Field && field.name)
      .forEach((field: Field<any>) => {
        form.addField(field);
      });

    Object
      .keys(model)
      .forEach(key => {
        if ((model as any)[key] instanceof BaseEditor) {
          form.formGroup.addControl(key, ((model as any)[key] as BaseEditor).form.formGroup);
        }
      });

    if (onCreated) {
      onCreated();
    }

    return form;
  }

  /**
   * Adds Field to a Form
   * @param field Field
   */
  public addField(field: Field<any>) {
    if (!field.name) {
      throw new Error("Field is missing the 'Name' property, so it cannot be used inside validation Form");
    }

    if (this.formGroup.contains(field.name)) {
      throw new Error(`Validation Form already contains the field with name '${field.name}',` +
        ` please provide unique name to make validation working properly`);
    }

    this.fields.push(field);
    this.formGroup.addControl(field.name, field.control);

    if (!field.control.disabled) {
      field.control.enable();
    }
  }

  /**
 * Removes Field from a Form
 * @param field Field
 */
  public removeField(field: Field<any>) {
    remove(this.fields, formField => formField == field);

    this.formGroup.removeControl(field.name);
  }

  /**
   * Marks Form and all descendants as Untouched
   */
  public markAsUntouched() {
    this.applyAction(control => {
      control.markAsUntouched({ onlySelf: true });
    });
  }

  /**
   * Marks Form and all descendants as Touched
   */
  public markAsTouched() {
    this.applyAction(control => {
      control.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Destroys each field in a form
   */
  public destroy() {
    this.fields.forEach(field => field.destroy());
  }

  private applyAction(action: (control: AbstractControl) => void) {
    let controls = Object.values(this.formGroup.controls)
      .flatMap(control => {
        if (control instanceof FormGroup) {
          return [...Object.values(control.controls), control];
        }
        else if (control instanceof FormArray) {
          return [...control.controls, control];
        }
        else {
          return [control];
        }
      });

    [...controls, this.formGroup].forEach(control => action(control));
  }
}

/**
 * Base editor model that didecated page editors should derive from. Used by {@link Form}
 */
export abstract class BaseEditor {

  public form: Form;

  public destroy() {
    this.form.destroy();
  }

  protected initialize() {
    (this as any).__proto__.form = Form.Create(this);
  }
}