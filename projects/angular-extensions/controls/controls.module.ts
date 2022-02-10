import { format } from "date-fns";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateAdapter,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS,
} from "@angular-material-components/datetime-picker";

import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Platform } from "@angular/cdk/platform";

import { MAT_DATE_APP_FORMATS } from "angular-extensions/models";

import { NgxPipesModule } from "angular-extensions/pipes";
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

export class AppDateAdapter extends NgxMatNativeDateAdapter {

  public getFirstDayOfWeek(): number {
    return 1;
  }

  public format(date: Date, displayFormat: string): string {
    return format(date, displayFormat);
  }
}

@NgModule({
  imports: [
    CommonModule,
    NgxPipesModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxModalsModule,

    MatButtonModule,
    MatTooltipModule,
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
  exports: [
    CommonModule,
    NgxPipesModule,
    NgxDirectivesModule,
    NgxBaseControlModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
    NgxModalsModule,

    MatButtonModule,
    MatTooltipModule,
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
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: NgxMatDateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE, Platform]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: "en-GB"
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_DATE_APP_FORMATS
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: MAT_DATE_APP_FORMATS
    },
  ]
})
export class ControlsModule { }
