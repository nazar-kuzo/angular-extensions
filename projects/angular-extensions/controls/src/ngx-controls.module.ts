import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS,
} from "@angular-material-components/datetime-picker";

import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { Platform } from "@angular/cdk/platform";
import { FormControl } from "@angular/forms";

import { overrideFunction } from "angular-extensions/core";
import { NgxDateTimeConfig, dateTimeConfigDefaults } from "angular-extensions/models";
import { NgxModalsModule } from "angular-extensions/modals";
import { NgxDirectivesModule } from "angular-extensions/directives";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { NgxTextControlModule } from "angular-extensions/controls/text-control";
import { NgxTextAreaControlModule } from "angular-extensions/controls/textarea-control";
import { NgxCheckboxControlModule } from "angular-extensions/controls/checkbox-control";
import { NgxSelectControlModule } from "angular-extensions/controls/select-control";
import { NgxDateControlModule } from "angular-extensions/controls/date-control";
import { NgxSpinnerModule } from "angular-extensions/controls/spinner";

import { DateTimeControlComponent } from "./datetime-control/datetime-control.component";
import { TimeControlComponent } from "./time-control/time-control.component";

/**
 * Configure default behavior of NgxControlsModule like: locale, date adpater, date format, etc.
 */
export interface NgxControlsConfig {

  dateTimeConfig?: NgxDateTimeConfig;

  /**
   * It true, disables default FormControls behavior which
   * updates all values inside form group whenever any value is updated
   */
  strictControlChangeDetection: boolean;
}

const moduleConfigDefaults: NgxControlsConfig = {
  dateTimeConfig: dateTimeConfigDefaults,
  strictControlChangeDetection: false,
};

@NgModule({
  imports: [
    CommonModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxCheckboxControlModule,
    NgxSelectControlModule,
    NgxDateControlModule,
    NgxSpinnerModule,
    NgxModalsModule,

    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
  ],
  declarations: [
    DateTimeControlComponent,
    TimeControlComponent,
  ],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: moduleConfigDefaults.dateTimeConfig.dateAdapterType,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: moduleConfigDefaults.dateTimeConfig.dateFormats
    },
  ],
  exports: [
    CommonModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxCheckboxControlModule,
    NgxSelectControlModule,
    NgxDateControlModule,
    NgxSpinnerModule,
    NgxModalsModule,

    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

    DateTimeControlComponent,
    TimeControlComponent,
  ]
})
export class NgxControlsModule {

  public static configure(config: Partial<NgxControlsConfig>): ModuleWithProviders<NgxControlsModule> {

    let moduleConfig = Object.assign<NgxControlsConfig, Partial<NgxControlsConfig>>(moduleConfigDefaults, config);

    if (config.strictControlChangeDetection) {
      // patch FormControl to avoid updating whole parent value when control value is updated
      overrideFunction(
        FormControl.prototype,
        control => control.setValue,
        (setValue, _, ...[value, options]) => {
          if (options?.emitModelToViewChange === false) {
            options.onlySelf = true;
          }

          setValue(value, options);
        });
    }

    return {
      ngModule: NgxControlsModule,
      providers: [
        ...NgxDateControlModule.configure(moduleConfig.dateTimeConfig).providers,
        {
          provide: NgxMatDateAdapter,
          useClass: moduleConfig.dateTimeConfig.dateAdapterType,
          deps: [MAT_DATE_LOCALE, Platform]
        },
        {
          provide: NGX_MAT_DATE_FORMATS,
          useValue: moduleConfig.dateTimeConfig.dateFormats
        },
      ]
    };
  }
}
