import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Field, Form, ValidationConstructor } from "../../../models";

export interface ModalPromptSettings {
  title: string;

  label?: string;

  validation?: ValidationConstructor<string>;

  multiline?: boolean;
}

@Component({
  selector: "modal-prompt",
  templateUrl: "./modal-prompt.html",
})
export class ModalPromptComponent {

  public form: Form;
  public field: Field<string>;

  constructor(
    public dialogRef: MatDialogRef<ModalPromptComponent, string>,
    @Inject(MAT_DIALOG_DATA) public settings: ModalPromptSettings
  ) {
    this.field = new Field<string>({
      label: settings.label || settings.title,
      name: "Answer",
      validation: settings.validation,
    });

    this.form = new Form(this.field);
  }

  public submit() {
    if (this.form.valid) {
      // null dialog result should be treated as cancel
      this.dialogRef.close(this.field.value || "");
    }
  }
}
