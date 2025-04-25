import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlBase } from "./base-control.component";

@Component({
  selector: "validation-control",
  template: `
    <base-control #baseControl [control]="this">
    @if (baseControl.initialized) {
      <mat-error>
        <ng-container *ngTemplateOutlet="baseControl.errorsTemplate"></ng-container>
      </mat-error>
    }
    </base-control>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ValidationControlComponent<TValue> extends ControlBase<TValue> {
}
