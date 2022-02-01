import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilePickerModule } from  "ngx-awesome-uploader";

import { FileControlComponent } from "./file-control.component";
import { MaterialModule } from "app/material-module";
import { ControlsModule } from "app/controls/controls.module";
import { FileSizePipe, NgxFilesizeModule } from "ngx-filesize";

@NgModule({
  declarations: [
    FileControlComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxFilesizeModule,
    MaterialModule,
    ControlsModule,
    FilePickerModule,
  ],
  exports: [
    FileControlComponent,
  ],
  providers: [
    FileSizePipe,
  ]
})
export class FileControlModule { }
