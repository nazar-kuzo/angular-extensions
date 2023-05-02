import { Injectable } from "@angular/core";
import { ApiService } from "angular-extensions";

@Injectable()
export class OtherDashboardApiService {

  constructor(
    private api: ApiService
  ) {
  }

  public get() {
    return this.api.get("/data");
  }
}
