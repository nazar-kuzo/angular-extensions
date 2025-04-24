import { format } from "date-fns";
import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { MatDateFormats, MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxDirectivesModule } from "angular-extensions/directives";
import { NGX_DATE_FORMATS } from "angular-extensions/models";

import { TimeControlComponent } from "./time-control.component";
import { NgxMatTimepickerComponent } from "./ngx-mat-timepicker/timepicker.component";
import { NgxMatDateAdapter } from "./ngx-mat-timepicker/date-adapter";
import { NGX_MAT_DATE_FORMATS } from "./ngx-mat-timepicker/date-formats";
import { NgxMatNativeDateAdapter } from "./ngx-mat-timepicker/native-date-adapter";

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
export interface NgxDateTimeConfig {

  /**
 * Date/time formats, by default {@link NGX_DATE_FORMATS}
 */
  dateFormats: MatDateFormats;

  /**
   * Date adapter used between AngularMaterial and NgxMatDatePicker, by default {@link NgxDateAdapter}
   */
  dateTimeAdapterType: Type<NgxMatDateAdapter<Date>>;
}

export class NgxDateTimeAdapter extends NgxMatNativeDateAdapter {

  public override getFirstDayOfWeek(): number {
    return 1;
  }

  public override format(date: Date, displayFormat: string): string {
    return format(date, displayFormat);
  }
}

export const dateTimeConfigDefaults: NgxDateTimeConfig = {
  dateFormats: NGX_DATE_FORMATS,
  dateTimeAdapterType: NgxDateTimeAdapter,
};

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,

    NgxBaseControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,

    NgxBaseControlModule,
    NgxDirectivesModule,

    NgxMatTimepickerComponent,
    TimeControlComponent,
  ],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: NgxDateTimeAdapter,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: dateTimeConfigDefaults.dateFormats
    },
  ],
  declarations: [
    NgxMatTimepickerComponent,
    TimeControlComponent,
  ]
})
export class NgxTimeControlModule {
  public static configure(config: Partial<NgxDateTimeConfig>): ModuleWithProviders<NgxTimeControlModule> {

    let moduleConfig = Object.assign<NgxDateTimeConfig, Partial<NgxDateTimeConfig>>(dateTimeConfigDefaults, config);

    if (config.dateFormats) {
      Object.assign(NGX_DATE_FORMATS, config.dateFormats);
    }

    return {
      ngModule: NgxTimeControlModule,
      providers: [
        {
          provide: NgxMatDateAdapter,
          useClass: moduleConfig.dateTimeAdapterType,
          deps: [MAT_DATE_LOCALE, Platform]
        },
        {
          provide: NGX_MAT_DATE_FORMATS,
          useValue: moduleConfig.dateFormats
        },
      ]
    };
  }
}
