import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MatDividerModule} from "@angular/material/divider";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxDateControlModule } from "angular-extensions/controls/date-control";
import { NgxTimeControlModule, NgxDateTimeConfig } from "angular-extensions/controls/time-control";

import { DateTimeControlComponent } from "./datetime-control.component";

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    NgxTimeControlModule,

    NgxBaseControlModule,
    NgxDateControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatDividerModule,

    NgxBaseControlModule,
    NgxDateControlModule,
    NgxTimeControlModule,
    NgxDirectivesModule,

    DateTimeControlComponent,
  ],
  declarations: [
    DateTimeControlComponent,
  ]
})
export class NgxDateTimeControlModule {

  public static configure(config: Partial<NgxDateTimeConfig>): ModuleWithProviders<NgxDateControlModule> {
    return {
      ngModule: NgxDateControlModule,
      providers: [
        ...NgxDateControlModule.configure(config).providers,
        ...NgxTimeControlModule.configure(config).providers,
      ]
    };
  }
}
