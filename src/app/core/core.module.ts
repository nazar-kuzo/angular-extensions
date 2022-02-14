import { NgModule } from "@angular/core";

import { environment } from "environments/environment";

import { NgxServicesModule } from "angular-extensions";

@NgModule({
  imports: [
    NgxServicesModule.configure({
      apiUrl: environment.apiUrl,
    }),
  ],
  providers: [
  ],
})
export class CoreModule { }
