import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { A11yModule } from "@angular/cdk/a11y";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { NgxPipesModule } from "angular-extensions/pipes";
import { BaseControlComponent } from "./base-control.component";

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    ReactiveFormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    NgxPipesModule,
  ],
  declarations: [
    BaseControlComponent,
  ],
  exports: [
    CommonModule,
    A11yModule,
    ReactiveFormsModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    NgxPipesModule,

    BaseControlComponent,
  ]
})
export class NgxBaseControlModule { }
