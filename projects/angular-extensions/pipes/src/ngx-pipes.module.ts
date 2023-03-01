import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import "angular-extensions/core";

import { DatePipe } from "./date.pipe";
import { DateTimePipe } from "./dateTime.pipe";
import { FilterPipe } from "./filter.pipe";
import { TrustedStylePipe } from "./trusted-style.pipe";
import { TrustedHtmlPipe } from "./trusted-html.pipe";
import { TrustedUrlPipe } from "./trusted-url.pipe";
import { StartCasePipe } from "./start-case.pipe";
import { GroupByPipe } from "./group-by.pipe";
import { MapPipe } from "./map.pipe";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DatePipe,
    DateTimePipe,
    FilterPipe,
    TrustedStylePipe,
    TrustedHtmlPipe,
    TrustedUrlPipe,
    StartCasePipe,
    GroupByPipe,
    MapPipe,

  ],
  exports: [
    CommonModule,
    DatePipe,
    DateTimePipe,
    FilterPipe,
    TrustedStylePipe,
    TrustedHtmlPipe,
    TrustedUrlPipe,
    StartCasePipe,
    GroupByPipe,
    MapPipe,
  ],
  providers: [
    DatePipe,
    DateTimePipe,
  ]
})
export class NgxPipesModule { }
