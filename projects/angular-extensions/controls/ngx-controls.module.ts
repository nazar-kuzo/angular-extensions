import { format } from "date-fns";
import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateAdapter,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS,
} from "@angular-material-components/datetime-picker";

import { DateAdapter, MatDateFormats, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Platform } from "@angular/cdk/platform";

import { NGX_DATE_FORMATS } from "angular-extensions/models";

import { NgxDirectivesModule } from "angular-extensions/directives";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxTextControlModule } from "angular-extensions/controls/text-control";
import { NgxTextAreaControlModule } from "angular-extensions/controls/textarea-control";
import { NgxModalsModule } from "angular-extensions/modals";

import { CheckboxControlComponent } from "./checkbox-control/checkbox-control.component";
import { SelectControlComponent } from "./select-control/select-control.component";
import { OptionContextDirective } from "./select-control/option-context/option-context.directive";
import { DateControlComponent } from "./date-control/date-control.component";
import { DateTimeControlComponent } from "./datetime-control/datetime-control.component";
import { TimeControlComponent } from "./time-control/time-control.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { CollectionControlComponent } from "./collection-control/collection-control.component";

export class NgxDateAdapter extends NgxMatNativeDateAdapter {

  public getFirstDayOfWeek(): number {
    return 1;
  }

  public format(date: Date, displayFormat: string): string {
    return format(date, displayFormat);
  }
}

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
export interface NgxControlsConfig {

  /**
   * Date adapter used between AngularMaterial and NgxMatDatePicker, by default {@link NgxDateAdapter}
   */
  dateAdapterType: Type<NgxMatNativeDateAdapter>;

  /**
   * Date locale, by default "en-GB"
   */
  dateLocale: string;

  /**
   * Date/time formats, by default {@link NGX_DATE_FORMATS}
   */
  dateFormats: MatDateFormats;
}

const moduleConfigDefaults: NgxControlsConfig = {
  dateFormats: NGX_DATE_FORMATS,
  dateAdapterType: NgxDateAdapter,
  dateLocale: "en-GB",
};

@NgModule({
  imports: [
    CommonModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxModalsModule,

    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatSelectSearchModule,
  ],
  declarations: [
    CheckboxControlComponent,
    SelectControlComponent,
    OptionContextDirective,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: moduleConfigDefaults.dateAdapterType,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: NgxMatDateAdapter,
      useClass: moduleConfigDefaults.dateAdapterType,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: moduleConfigDefaults.dateLocale
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: moduleConfigDefaults.dateFormats
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: moduleConfigDefaults.dateFormats
    },
  ],
  exports: [
    CommonModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxModalsModule,

    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatSelectSearchModule,


    CheckboxControlComponent,
    SelectControlComponent,
    OptionContextDirective,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,
  ]
})
export class NgxControlsModule {

  public static configure(config: Partial<NgxControlsConfig>): ModuleWithProviders<NgxControlsModule> {

    let moduleConfig = Object.assign<NgxControlsConfig, Partial<NgxControlsConfig>>(moduleConfigDefaults, config);

    if (config.dateFormats) {
      Object.assign(NGX_DATE_FORMATS, config.dateFormats);
    }

    return {
      ngModule: NgxControlsModule,
      providers: [
        {
          provide: DateAdapter,
          useClass: moduleConfig.dateAdapterType,
          deps: [MAT_DATE_LOCALE, Platform]
        },
        {
          provide: NgxMatDateAdapter,
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
        {
          provide: NGX_MAT_DATE_FORMATS,
          useValue: moduleConfig.dateFormats
        },
      ]
    };
  }
}
