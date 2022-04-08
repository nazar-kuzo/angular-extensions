import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlBase } from "angular-extensions/controls/base-control";


@Component({
  selector: "checkbox-control",
  templateUrl: "./checkbox-control.component.html",
  styleUrls: ["./checkbox-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxControlComponent extends ControlBase<boolean> {
}
