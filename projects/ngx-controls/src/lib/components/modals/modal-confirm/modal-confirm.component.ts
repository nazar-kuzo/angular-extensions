import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "modal-confirm",
  templateUrl: "./modal-confirm.component.html",
  styleUrls: ["./modal-confirm.component.scss"]
})
export class ModalConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public title: string
  ) {
  }
}
