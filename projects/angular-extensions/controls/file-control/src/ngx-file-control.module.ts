import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilePickerModule } from  "ngx-awesome-uploader";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { FileControlComponent } from "./file-control.component";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    MatButtonModule,
    FilePickerModule,
  ],
  exports: [
    NgxBaseControlModule,
    MatButtonModule,
    FilePickerModule,

    FileControlComponent,
  ],
  declarations: [
    FileControlComponent,
  ]
})
export class NgxFileControlModule { }
