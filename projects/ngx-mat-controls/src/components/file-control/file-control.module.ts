import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilePickerModule } from  "ngx-awesome-uploader";
import { FileSizePipe, NgxFilesizeModule } from "ngx-filesize";

import { ControlsModule } from "../../controls.module";
import { FileControlComponent } from "./file-control.component";

@NgModule({
  declarations: [
    FileControlComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxFilesizeModule,
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
