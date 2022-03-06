import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilePickerModule } from  "ngx-awesome-uploader";
import { FileSizePipe, NgxFilesizeModule } from "ngx-filesize";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { FileControlComponent } from "./file-control.component";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    MatButtonModule,
    NgxFilesizeModule,
    FilePickerModule,
  ],
  exports: [
    NgxBaseControlModule,
    MatButtonModule,
    NgxFilesizeModule,
    FilePickerModule,

    FileControlComponent,
  ],
  declarations: [
    FileControlComponent,
  ],
  providers: [
    FileSizePipe,
  ]
})
export class NgxFileControlModule { }
