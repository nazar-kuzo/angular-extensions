
import { Observable, of, Subject, timer } from "rxjs";
import { catchError, map, startWith, delay, mergeMap, retryWhen, shareReplay, switchMap, tap } from "rxjs/operators";

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
 *
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

/**
 * Adds support of executing request retries on refresh interval with initial execution delay
 */
 export class AsyncWrapper<TValue, TError = any> {

  private isValueLoading = false;

  public readonly error: Observable<TError>;
  public readonly value: Observable<TValue>;

  public get isLoading() {
    return this.isValueLoading;
  }

  constructor(provider: () => Observable<TValue>, settings: { refreshInterval: number; initialDelay?: number }) {
    let errorSubject = new Subject<TError>();

    this.error = errorSubject.pipe(shareReplay(1));

    this.value = timer(settings.initialDelay || 0, settings.refreshInterval)
      .pipe(
        switchMap(() => {
          this.isValueLoading = true;

          return provider();
        }),
        retryWhen(errors => errors.pipe(mergeMap(error => {
          console.error(error);
          this.isValueLoading = false;

          errorSubject.next(error);

          return of(error).pipe(delay(settings.refreshInterval));
        }))),
        tap(() => {
          this.isValueLoading = false;

          errorSubject.next(undefined);
        }),
        shareReplay({ refCount: true, bufferSize: 1 }));
  }
}
