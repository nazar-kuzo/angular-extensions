import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { FilePickerModule } from  "ngx-awesome-uploader";

import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { FileControlComponent } from "./file-control.component";
import { FilePickerComponentDirective } from "./ngx-awesome-uploader.directive";

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
    FilePickerComponentDirective,
  ]
})
export class NgxFileControlModule { }
