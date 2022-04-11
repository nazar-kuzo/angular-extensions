import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Field, ModalPromptComponent, ModalPromptSettings } from "angular-extensions";
import { DashboardApiService } from "app/dashboard/services";
import { DashboardEditor } from "./dashboard.editor";

@Component({
  selector: "dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: ["./dashboard-layout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardEditor],
})
export class DashboardLayoutComponent implements OnInit {

  constructor(
    public editor: DashboardEditor,
    private dashboardApiServise: DashboardApiService,
    private dialog: MatDialog,
  ) {
  }

  public ngOnInit() {
  }

  public scan(field: Field<string>) {
    this.dialog.open<ModalPromptComponent, ModalPromptSettings>(ModalPromptComponent, {
      data: {
        title: "Scan text",
      }
    });
  }


  public submit() {
    this.editor.form.validate();
  }
}
