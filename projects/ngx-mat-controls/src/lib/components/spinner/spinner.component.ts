import { Component, Input, ContentChild, TemplateRef } from "@angular/core";

@Component({
  selector: "spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {

  @Input()
  public type: "big" | "small" = "big";

  @Input()
  public loading: boolean;

  @Input()
  public size = 100;

  @ContentChild(TemplateRef, { static: false })
  public contentTemplate: TemplateRef<HTMLElement>;
}
