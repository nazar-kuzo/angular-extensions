import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
