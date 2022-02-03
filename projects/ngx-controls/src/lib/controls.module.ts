import { format } from "date-fns";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateAdapter,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS,
} from "@angular-material-components/datetime-picker";

import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogConfig, MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Platform } from "@angular/cdk/platform";
import { NgxMaskModule } from "ngx-mask";

import { ModalConfirmComponent, ModalPromptComponent } from "./components/modals";
import { DatePipe, DateTimePipe, FilterPipe, GroupByPipe, MapPipe, StartCasePipe, TrustedHtmlPipe } from "./pipes";
import { CustomPaginatorDirective, DateTimePickerDirective, FormatDirective, TooltipImprovementsDirective } from "./directives";

import {
  BaseControlComponent,
  CheckboxControlComponent,
  DateControlComponent,
  DateTimeControlComponent,
  SelectControlComponent,
  OptionContextDirective,
  SpinnerComponent,
  TextareaControlComponent,
  TextControlComponent,
  TimeControlComponent,
  CollectionControlComponent,
} from "./components";
import { MAT_DATE_APP_FORMATS } from "./models";
import { A11yModule } from "@angular/cdk/a11y";

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
    ReactiveFormsModule,
    A11yModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    BaseControlComponent,
    CheckboxControlComponent,
    SelectControlComponent,
    OptionContextDirective,
    TextControlComponent,
    TextareaControlComponent,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,

    ModalConfirmComponent,
    ModalPromptComponent,

    DatePipe,
    DateTimePipe,
    FilterPipe,
    TrustedHtmlPipe,
    StartCasePipe,
    GroupByPipe,
    MapPipe,

    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatSelectSearchModule,

    BaseControlComponent,
    CheckboxControlComponent,
    SelectControlComponent,
    OptionContextDirective,
    TextControlComponent,
    TextareaControlComponent,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,

    ModalConfirmComponent,
    ModalPromptComponent,

    DatePipe,
    DateTimePipe,
    FilterPipe,
    TrustedHtmlPipe,
    StartCasePipe,

    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
    TooltipImprovementsDirective,
  ],
  providers: [
    DatePipe,
    DateTimePipe,
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
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        closeOnNavigation: true,
        disableClose: true,
        hasBackdrop: true,
      } as MatDialogConfig
    },
  ]
})
export class ControlsModule { }
