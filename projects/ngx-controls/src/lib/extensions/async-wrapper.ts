import { Observable, of, Subject, timer } from "rxjs";
import { delay, mergeMap, retryWhen, shareReplay, switchMap, tap } from "rxjs/operators";

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
