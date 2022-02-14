import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DashboardApiService } from "app/dashboard/services";

@Component({
  selector: "dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: ["./dashboard-layout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent implements OnInit {

  constructor(
    private dashboardApiServise: DashboardApiService,
  ) {
  }

  public ngOnInit() {
  }
}
