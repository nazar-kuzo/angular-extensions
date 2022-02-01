import { remove } from "lodash-es";
import { FormGroup, AbstractControl, FormArray } from "@angular/forms";

import { Field } from "./field.model";

export class Form {

  private fields: Field<any>[] = [];

  public formGroup: FormGroup;

  public get invalid() {
    return this.formGroup.invalid;
  }

  public get valid() {
    return this.formGroup.valid;
  }

  constructor(...fields: Field<any>[]) {
    this.formGroup = new FormGroup({});

    fields.forEach(field => {
      this.addField(field);
    });
  }

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

    if (!field.disabled) {
      field.control.enable();
    }
  }

  public removeField(field: Field<any>) {
    remove(this.fields, formField => formField == field);

    this.formGroup.removeControl(field.name);
  }

  public markAsUntouched() {
    this.applyAction(control => {
      control.markAsUntouched({ onlySelf: true });
    });
  }

  public markAsTouched() {
    this.applyAction(control => {
      control.markAsTouched({ onlySelf: true });
    });
  }

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

export abstract class BaseEditor {

  public form: Form;

  public destroy() {
    this.form.destroy();
  }

  protected initialize() {
    (this as any).__proto__.form = Form.Create(this);
  }
}
