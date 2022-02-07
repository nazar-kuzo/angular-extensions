import { Component, Input } from "@angular/core";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { Field } from "../../models";

@Component({
  selector: "textarea-control",
  templateUrl: "./textarea-control.component.html",
  styleUrls: ["./textarea-control.component.scss"]
})
export class TextareaControlComponent {

  @Input()
  public field: Field<string>;

  @Input()
  public fieldClass: string;

  @Input()
  public appearance: MatFormFieldAppearance = "outline";
}
