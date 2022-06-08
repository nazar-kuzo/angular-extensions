import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class SecondGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("SecondGuard: canActivate");

    return Promise.resolve(true);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("SecondGuard: canActivateChild");

    return true;
  }
}
