import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from "@angular/core";
import { matFormFieldAnimations } from "@angular/material/form-field";
import { ControlBase } from "angular-extensions/controls/base-control";


@Component({
  selector: "checkbox-control",
  templateUrl: "./checkbox-control.component.html",
  styleUrls: ["./checkbox-control.component.scss"],
  animations: [matFormFieldAnimations.transitionMessages],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxControlComponent extends ControlBase<boolean> {

  @ContentChild("labelTemplate")
  public labelTemplate: TemplateRef<HTMLElement>;
}
