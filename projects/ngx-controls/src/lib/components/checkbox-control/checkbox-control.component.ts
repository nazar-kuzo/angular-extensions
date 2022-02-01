import { Component, Input } from "@angular/core";
import { Field } from "../../models";

@Component({
  selector: "checkbox-control",
  templateUrl: "./checkbox-control.component.html",
  styleUrls: ["./checkbox-control.component.scss"]
})
export class CheckboxControlComponent {

  @Input()
  public field: Field<boolean>;

  @Input()
  public fieldClass: string;
}
