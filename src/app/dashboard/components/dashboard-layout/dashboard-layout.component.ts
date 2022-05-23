import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
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
    private router: Router,
    private dashboardApiService: DashboardApiService,
    private dialog: MatDialog,
    public editor: DashboardEditor,
  ) {
  }

  public ngOnInit() {
    let navigation = this.router.getLastSuccessfulNavigation();

    console.log(`Last Successful Navigation: ${navigation.finalUrl}`);
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
