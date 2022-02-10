import { Component, Input } from "@angular/core";

import { Field } from "angular-extensions/models";

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
