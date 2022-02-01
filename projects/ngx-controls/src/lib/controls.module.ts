import { format } from "date-fns";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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

import { ModalConfirmComponent, ModalPromptComponent } from "./components/modals";
import { DateFnsPipe, DateTimePipe, FilterPipe, GroupByPipe, MapPipe, StartCasePipe, TrustedHtmlPipe } from "./pipes";
import { CustomPaginatorDirective, DateTimePickerDirective, FormatDirective } from "./directives";

import {
  BaseControlComponent,
  CheckboxControlComponent,
  DateControlComponent,
  DateTimeControlComponent,
  SelectControlComponent,
  SpinnerComponent,
  TextareaControlComponent,
  TextControlComponent,
  TimeControlComponent,
} from "./components";
import { MAT_DATE_APP_FORMATS } from "./models";
import { CollectionControlComponent } from "./components/collection-control/collection-control.component";
import { NgxMaskModule } from "ngx-mask";

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
    FormsModule,
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
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    BaseControlComponent,
    CheckboxControlComponent,
    SelectControlComponent,
    TextControlComponent,
    TextareaControlComponent,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,

    ModalConfirmComponent,
    ModalPromptComponent,

    DateFnsPipe,
    DateTimePipe,
    FilterPipe,
    TrustedHtmlPipe,
    StartCasePipe,
    MapPipe,
    GroupByPipe,

    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
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
    TextControlComponent,
    TextareaControlComponent,
    DateControlComponent,
    DateTimeControlComponent,
    TimeControlComponent,
    SpinnerComponent,
    CollectionControlComponent,

    ModalConfirmComponent,
    ModalPromptComponent,

    DateFnsPipe,
    DateTimePipe,
    FilterPipe,
    TrustedHtmlPipe,
    StartCasePipe,
    MapPipe,
    GroupByPipe,

    CustomPaginatorDirective,
    DateTimePickerDirective,
    FormatDirective,
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
