import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OtherDashboardApiService } from "../../services";

@Component({
  selector: "other-dashboard-details-modal",
  templateUrl: "./other-dashboard-details-modal.component.html",
  styleUrls: ["./other-dashboard-details-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherDashboardDetailsModalComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: OtherDashboardApiService,
  ) {
  }

  public close() {
    this.router.navigate(["../"], {
      relativeTo: this.route,
      queryParamsHandling: "merge",
    });
  }
}
