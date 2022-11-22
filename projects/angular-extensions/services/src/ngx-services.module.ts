import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import "angular-extensions/core";

import { ApiConfig, ApiService, API_CONFIG } from "./api.service";
import { DateConversionInterceptor } from "./date-conversion.interceptor";

const apiConfigDefaults: ApiConfig = {
  apiUrl: null,
  dateConversionExcludePaths: [],
};

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DateConversionInterceptor,
      multi: true,
    },
    {
      provide: API_CONFIG,
      useValue: apiConfigDefaults,
    },
  ]
})
export class NgxServicesModule {

  public static configure(config: Partial<ApiConfig>): ModuleWithProviders<NgxServicesModule> {
    let apiConfig = Object.assign<ApiConfig, Partial<ApiConfig>>(apiConfigDefaults, config);

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
          useValue: apiConfig,
        },
      ]
    };
  }
}
