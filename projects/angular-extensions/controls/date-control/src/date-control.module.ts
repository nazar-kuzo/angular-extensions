import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { dateTimeConfigDefaults, NgxDateTimeConfig, NGX_DATE_FORMATS } from "angular-extensions/models";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { DateControlComponent } from "./date-control.component";

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,

    NgxBaseControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatDatepickerModule,
    NgxBaseControlModule,
    NgxDirectivesModule,

    DateControlComponent,
  ],
  declarations: [
    DateControlComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: dateTimeConfigDefaults.dateAdapterType,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: dateTimeConfigDefaults.dateLocale
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: dateTimeConfigDefaults.dateFormats
    },
  ]
})
export class NgxDateControlModule {

  public static configure(config: Partial<NgxDateTimeConfig>): ModuleWithProviders<NgxDateControlModule> {

    let moduleConfig = Object.assign<NgxDateTimeConfig, Partial<NgxDateTimeConfig>>(dateTimeConfigDefaults, config);

    if (config.dateFormats) {
      Object.assign(NGX_DATE_FORMATS, config.dateFormats);
    }

    return {
      ngModule: NgxDateControlModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: moduleConfig.dateAdapterType,
          deps: [MAT_DATE_LOCALE, Platform]
        },
        {
          provide: MAT_DATE_LOCALE,
          useValue: moduleConfig.dateLocale
        },
        {
          provide: MAT_DATE_FORMATS,
          useValue: moduleConfig.dateFormats
        },
      ]
    };
  }
}
