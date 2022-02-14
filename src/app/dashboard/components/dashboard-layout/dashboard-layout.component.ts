import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
}
