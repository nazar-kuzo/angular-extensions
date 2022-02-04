
import { Observable, of } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";

/**
 * Provides additional information about Observable request. Used by {@link trackStatus}
 */
export interface RequestStatus<T> {
  isLoading: boolean;

  value?: T;

  error?: any;
}

/**
 * Wraps Observable into a RequestStatus object that provides additional information: isLoading, error, etc.
 * @example
 * <ng-container *ngIf="trackStatusObservable$ | async as request">
 *   {{ request.isLoading ? "loading" : request.value }}
 * </ng-container>
 * @param observable
 * @returns
 */
export function trackStatus<T>(observable: Observable<T>): Observable<RequestStatus<T>> {
  return observable.pipe(
    map(value => {
      return {
        isLoading: !value,
        value: value,
      } as RequestStatus<T>;
    }),
    startWith({ isLoading: true }),
    catchError(error => {
      console.error(error);

      return of({ isLoading: false, error });
    }),
  );
}
