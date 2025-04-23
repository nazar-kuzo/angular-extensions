import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";

import { NgxPipesModule } from "angular-extensions/pipes";
import { BaseControlComponent } from "./base-control.component";
import { ValidationControlComponent } from "./validation-control.component";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,

    NgxPipesModule,
  ],
  declarations: [
    BaseControlComponent,
    ValidationControlComponent,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,

    NgxPipesModule,

    BaseControlComponent,
    ValidationControlComponent,
  ]
})
export class NgxBaseControlModule { }
