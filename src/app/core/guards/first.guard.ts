import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FirstGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("FirstGuard: canActivate");

    return of(true);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("FirstGuard: canActivateChild");

    return false;
  }
}
