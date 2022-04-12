import { merge } from "lodash-es";
import { map } from "rxjs/operators";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders as AngularHttpHeaders, HttpParams as AngularHttpParams } from "@angular/common/http";

import { patchAngularHttpParams } from "angular-extensions/core";

type HttpHeaders = AngularHttpHeaders | { [header: string]: string | string[] };
type HttpParams = AngularHttpParams | { [param: string]: any };

interface DefaultHttpClientOptions {
  headers?: HttpHeaders;
  observe: "response";
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
}

export interface ApiConfig {
  apiUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>("ApiConfig");

export type HttpClientOptions = Partial<DefaultHttpClientOptions>;

patchAngularHttpParams();

/**
 * Provides simplified api to make REST requests to API
 */
@Injectable()
export class ApiService {

  private httpOptions: DefaultHttpClientOptions;

  public apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) config: ApiConfig,
  ) {
    this.apiUrl = config.apiUrl;

    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      observe: "response",
      responseType: "json"
    };
  }

  public get<T>(url: string, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .get<T>(`${this.apiUrl}/${url}`, this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public post<T>(url: string, body?: any, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .post<T>(`${this.apiUrl}/${url}`, JSON.stringify(body), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public put<T>(url: string, body?: any, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .put<T>(`${this.apiUrl}/${url}`, JSON.stringify(body), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public delete<T>(url: string, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .delete<T>(`${this.apiUrl}/${url}`, this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  private sanitizeQueryParams(params?: HttpParams) {
    if (params instanceof AngularHttpParams) {
      let httpParams = params;

      params = httpParams.keys().reduce((result: any, key: string) => {
        result[key] = httpParams.getAll(key);

        return result;
      }, {});
    }
    else if (params != undefined) {
      let objectParams = params;

      Object.keys(objectParams)
        .filter(key => objectParams[key] == null || objectParams[key] === "")
        .forEach(key => {
          delete objectParams[key];
        });

      params = objectParams;
    }

    return params;
  }

  private getHttpOptions(queryParams?: HttpParams, httpOptions?: HttpClientOptions): DefaultHttpClientOptions {
    if (!httpOptions) {
      httpOptions = {} as DefaultHttpClientOptions;
    }

    httpOptions.params = this.sanitizeQueryParams(queryParams);

    let result = merge({}, this.httpOptions, httpOptions);

    return result;
  }
}
