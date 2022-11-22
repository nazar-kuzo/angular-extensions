import { format } from "date-fns";
import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import {
  DateAdapter, MatDateFormats, MatNativeDateModule,
  NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { NGX_DATE_FORMATS } from "angular-extensions/models";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";

import { DateControlComponent } from "./date-control.component";

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
export interface NgxDateConfig {

  /**
   * Date adapter used between AngularMaterial and NgxMatDatePicker, by default {@link NgxDateAdapter}
   */
  dateAdapterType: Type<DateAdapter<Date>>;

  /**
   * Date locale, by default "en-GB"
   */
  dateLocale: string;

  /**
   * Date/time formats, by default {@link NGX_DATE_FORMATS}
   */
  dateFormats: MatDateFormats;
}

export class NgxDateAdapter extends NativeDateAdapter {

  public getFirstDayOfWeek(): number {
    return 1;
  }

  public format(date: Date, displayFormat: string): string {
    return format(date, displayFormat);
  }
}

export const dateConfigDefaults: NgxDateConfig = {
  dateFormats: NGX_DATE_FORMATS,
  dateAdapterType: NgxDateAdapter,
  dateLocale: "en-GB",
};

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,

    NgxBaseControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,

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
      useClass: dateConfigDefaults.dateAdapterType,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: dateConfigDefaults.dateLocale
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: dateConfigDefaults.dateFormats
    },
  ]
})
export class NgxDateControlModule {

  public static configure(config: Partial<NgxDateConfig>): ModuleWithProviders<NgxDateControlModule> {

    let moduleConfig = Object.assign<NgxDateConfig, Partial<NgxDateConfig>>(dateConfigDefaults, config);

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
