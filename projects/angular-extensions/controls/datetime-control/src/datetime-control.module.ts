import { format } from "date-fns";
import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {
  NgxMatDatetimePickerModule, NgxMatDateAdapter,
  NgxMatNativeDateAdapter, NGX_MAT_DATE_FORMATS, NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { NGX_DATE_FORMATS } from "angular-extensions/models";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxDateControlModule, NgxDateConfig, dateConfigDefaults } from "angular-extensions/controls/date-control";

import { DateTimeControlComponent } from "./datetime-control.component";

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
export interface NgxDateTimeConfig extends NgxDateConfig {

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

export const dateTimeConfigDefaults: NgxDateTimeConfig = Object.assign({
  dateTimeAdapterType: NgxDateTimeAdapter,
}, dateConfigDefaults);

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

    NgxBaseControlModule,
    NgxDateControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatDividerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

    NgxBaseControlModule,
    NgxDateControlModule,
    NgxDirectivesModule,

    DateTimeControlComponent,
  ],
  declarations: [
    DateTimeControlComponent,
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
  ]
})
export class NgxDateTimeControlModule {

  public static configure(config: Partial<NgxDateTimeConfig>): ModuleWithProviders<NgxDateControlModule> {

    let moduleConfig = Object.assign<NgxDateTimeConfig, Partial<NgxDateTimeConfig>>(dateTimeConfigDefaults, config);

    if (config.dateFormats) {
      Object.assign(NGX_DATE_FORMATS, config.dateFormats);
    }

    return {
      ngModule: NgxDateControlModule,
      providers: [
        ...NgxDateControlModule.configure(moduleConfig).providers,
        {
          provide: NgxMatDateAdapter,
          useClass: NgxDateTimeAdapter,
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
