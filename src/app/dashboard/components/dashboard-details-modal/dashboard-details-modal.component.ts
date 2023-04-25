import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DashboardApiService } from "app/dashboard/services";

@Component({
  selector: "dashboard-details-modal",
  templateUrl: "./dashboard-details-modal.component.html",
  styleUrls: ["./dashboard-details-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDetailsModalComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: DashboardApiService,
  ) {
  }

  public ngOnInit() {
  }

  public close() {
    this.router.navigate(["../"], {
      relativeTo: this.route,
      queryParamsHandling: "merge",
    });
  }
}
