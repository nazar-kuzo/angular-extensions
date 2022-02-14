import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import "angular-extensions/core";

import { ApiConfig, ApiService, API_CONFIG } from "./api.service";
import { DateConversionInterceptor } from "./date-conversion.interceptor";

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  providers: [
    ApiService,
  ]
})
export class NgxServicesModule {

  public static configure(config: ApiConfig): ModuleWithProviders<NgxServicesModule> {
    return {
      ngModule: NgxServicesModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DateConversionInterceptor,
          multi: true,
        },
        {
          provide: API_CONFIG,
          useValue: config,
        },
      ]
    };
  }
}
