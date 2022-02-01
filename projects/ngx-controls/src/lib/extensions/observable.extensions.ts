
import { Observable, of } from "rxjs";
import { catchError, map, startWith } from "rxjs/operators";

export interface RequestStatus<T> {
  isLoading: boolean;

  value?: T;

  error?: any;
}

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
