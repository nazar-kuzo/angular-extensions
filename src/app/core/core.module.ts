import { NgModule } from "@angular/core";

import { DefaultHttpParamEncoder, NgxServicesModule } from "angular-extensions";

@NgModule({
  imports: [
    NgxServicesModule.configure({ encoder: new DefaultHttpParamEncoder() }),
  ],
})
export class CoreModule { }
