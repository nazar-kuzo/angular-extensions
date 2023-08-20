import { Directive, EventEmitter, Output, OnInit } from "@angular/core";
import { MatLegacyOption as MatOption } from "@angular/material/legacy-core";
import { overrideFunction } from "angular-extensions/core";

@Directive({
  selector: "mat-option"
})
export class CustomMatOptionDirective implements OnInit {

  @Output()
  public selectViaInteraction = new EventEmitter<MatOption>();

  constructor(
    private matOption: MatOption,
  ) {
  }

  public ngOnInit() {
    if (this.selectViaInteraction.observers.length) {
      overrideFunction(
        this.matOption,
        option => option._selectViaInteraction,
        (_, option) => this.selectViaInteraction.emit(option));
    }
  }
}
