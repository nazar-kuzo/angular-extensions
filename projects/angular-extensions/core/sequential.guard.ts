import { Observable } from "rxjs";
import { Injectable, Injector, Type } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Data, RouterStateSnapshot, UrlTree } from "@angular/router";

export interface SequentialRouteData extends Data {
  canActivateSequence?: Type<CanActivate>[];
  canActivateChildSequence?: Type<CanActivateChild>[];
}

@Injectable({
  providedIn: "root",
})
export class SequentialGuard implements CanActivate, CanActivateChild {

  constructor(
    private injector: Injector,
  ) {
  }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let guardTypes = (route.data as SequentialRouteData).canActivateSequence;

    if (!guardTypes?.length) {
      throw new Error("SequentialGuard: missing \"CanActivate\" guards for RouteConfig \"data.canActivateSequence\" property");
    }

    let result: boolean | UrlTree;

    for (let guardType of guardTypes) {
      result = await this.toPromise(this.injector.get(guardType).canActivate(route, state));

      // return non-successful guard result early
      if (result instanceof UrlTree || result === false) {
        break;
      }
    }

    return result;
  }

  public async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let guardTypes = (route.data as SequentialRouteData).canActivateChildSequence;

    if (!guardTypes?.length) {
      throw new Error("SequentialGuard: missing \"CanActivateChild\" guards for RouteConfig \"data.canActivateChildSequence\" property");
    }

    let result: boolean | UrlTree;

    for (let guardType of guardTypes) {
      result = await this.toPromise(this.injector.get(guardType).canActivateChild(route, state));

      // return non-successful guard result early
      if (result instanceof UrlTree || result === false) {
        break;
      }
    }

    return result;
  }

  private toPromise<TValue>(source: Observable<TValue> | Promise<TValue> | TValue): Promise<TValue> {
    if (source instanceof Observable) {
      return source.toPromise();
    }
    else if (source instanceof Promise) {
      return source;
    }
    else {
      return Promise.resolve(source);
    }
  }
}
