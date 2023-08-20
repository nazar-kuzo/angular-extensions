import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { Router } from "@angular/router";
import { ApiService, Field, ModalPromptComponent, ModalPromptSettings, overrideFunction, parseDates } from "angular-extensions";
import { Country, OtherDashboardEditor } from "./other-dashboard.editor";

@Component({
  selector: "other-dashboard-layout",
  templateUrl: "./other-dashboard-layout.component.html",
  styleUrls: ["./other-dashboard-layout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OtherDashboardEditor],
})
export class OtherDashboardLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public editor: OtherDashboardEditor,
  ) {
  }

  public ngOnInit() {
    let navigation = this.router.getLastSuccessfulNavigation();

    let dates = {
      dateOnly: "2020-01-01",
      dateAndTimeWithoutTimezone: "2020-01-01 00:00:00",
      dateAndTimeUtc: "2020-01-01 00:00:00Z",
      dateAndTimeAndMillisecondsWithoutTimezone: "2020-01-01 00:00:00.000",
      dateAndTimeAndMillisecondsUtc: "2020-01-01 00:00:00.000Z",
      dateTimeWithoutTimezone: "2020-01-01T00:00:00",
      dateTimeUtc: "2020-01-01T00:00:00Z",
      dateTimeAndMillisecondsWithoutTimezone: "2020-01-01T00:00:00.000",
      dateTimeAndMillisecondsUtc: "2020-01-01T00:00:00.000Z",
      dateTimeLocal: "2020-01-01T00:00:00.000+03:00",
    };

    parseDates(dates);

    overrideFunction(
      this,
      component => component.getDate,
      () => new Date());

    overrideFunction(
      this,
      component => component.getDayForDate,
      (_, __, date) => date.getDay());

    overrideFunction(
      this,
      component => component.updateCurrentDate,
      (_, __) => { });

    overrideFunction(
      this,
      component => component.updateDate,
      (_, __, date) => { });

    console.log(`Last Successful Navigation: ${navigation.finalUrl}`);
  }

  public scan(field: Field<string>) {
    this.dialog.open<ModalPromptComponent, ModalPromptSettings>(ModalPromptComponent, {
      data: {
        title: "Scan text",
      }
    });
  }

  public copy(field: Field<Country>) {
    this.snackBar.open(`Country: "${field.optionLabel(field.value)}" is copied to clipboard`, "Dismiss");
  }

  public submit() {
    this.editor.form.validate();
  }

  public recreateEditor() {
    this.editor = new OtherDashboardEditor(this.api);
  }

  public getDate() {
    return new Date();
  }

  public getDayForDate(date: Date) {
    return date.getDay();
  }

  public updateCurrentDate() {
  }

  public updateDate(date: Date) {
  }
}
