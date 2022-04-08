import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "textarea-control",
  templateUrl: "./textarea-control.component.html",
  styleUrls: ["./textarea-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextAreaControlComponent<TValue> extends ControlBase<TValue> {
}
