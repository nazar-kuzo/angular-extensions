import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";

import { NgxTextControlModule } from "angular-extensions/controls/text-control";
import { NgxTextAreaControlModule } from "angular-extensions/controls/textarea-control";
import { ModalConfirmComponent } from "./modal-confirm/modal-confirm.component";
import { ModalPromptComponent } from "./modal-prompt/modal-prompt.component";

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,
  ],
  declarations: [
    ModalConfirmComponent,
    ModalPromptComponent,
  ],
  exports: [
    CommonModule,
    MatDialogModule,
    NgxTextControlModule,
    NgxTextAreaControlModule,

    ModalConfirmComponent,
    ModalPromptComponent,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        closeOnNavigation: true,
        disableClose: true,
        hasBackdrop: true,
      } as MatDialogConfig
    },
  ]
})
export class NgxModalsModule { }
