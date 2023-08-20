import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogConfig as MatDialogConfig, MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/legacy-dialog";

import { NgxTextControlModule } from "angular-extensions/controls/text-control";
import { NgxTextAreaControlModule } from "angular-extensions/controls/textarea-control";
import { ModalConfirmComponent } from "./modal-confirm/modal-confirm.component";
import { ModalPromptComponent } from "./modal-prompt/modal-prompt.component";

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
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
    MatButtonModule,
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
