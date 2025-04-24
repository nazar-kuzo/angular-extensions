import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FirstGuard {
  constructor(
    private router: Router
  ) {
  }

  public canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    console.log("FirstGuard: canActivate");

    return of(true);
  }

  public canActivateChild(_: ActivatedRouteSnapshot, __: RouterStateSnapshot) {
    console.log("FirstGuard: canActivateChild");

    return true;
  }
}
