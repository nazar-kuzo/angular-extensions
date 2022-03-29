import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Field } from "angular-extensions";
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
  ) {
  }

  public ngOnInit() {
  }

  public scan(field: Field<string>) {
    console.error(`Action button triigered for: ${field.name}`);
  }

  public submit() {
    this.editor.form.validate();
  }
}
