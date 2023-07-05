import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlBase } from "./base-control.component";

@Component({
  selector: "validation-control",
  template: `
    <base-control #baseControl [control]="this">
      <mat-error *ngIf="baseControl.initialized">
        <ng-container *ngTemplateOutlet="baseControl.errorsTemplate"></ng-container>
      </mat-error>
    </base-control>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationControlComponent<TValue> extends ControlBase<TValue> {
}
