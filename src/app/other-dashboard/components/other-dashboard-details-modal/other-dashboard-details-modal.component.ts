import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OtherDashboardApiService } from "../../services";

@Component({
  selector: "other-dashboard-details-modal",
  templateUrl: "./other-dashboard-details-modal.component.html",
  styleUrls: ["./other-dashboard-details-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherDashboardDetailsModalComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: OtherDashboardApiService,
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
