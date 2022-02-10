import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilePickerModule } from  "ngx-awesome-uploader";
import { FileSizePipe, NgxFilesizeModule } from "ngx-filesize";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { FileControlComponent } from "./file-control.component";

@NgModule({
  imports: [
    CommonModule,
    NgxBaseControlModule,
    NgxFilesizeModule,
    FilePickerModule,
  ],
  exports: [
    NgxBaseControlModule,
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
