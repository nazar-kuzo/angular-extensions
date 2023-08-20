import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyProgressBarModule as MatProgressBarModule } from "@angular/material/legacy-progress-bar";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";

import { SpinnerComponent } from "./spinner.component";

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatProgressBarModule,
    MatProgressSpinnerModule,

    SpinnerComponent,
  ],
  declarations: [
    SpinnerComponent,
  ]
})
export class NgxSpinnerModule { }
