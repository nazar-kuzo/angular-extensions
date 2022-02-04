import { merge } from "lodash-es";
import { map } from "rxjs/operators";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

interface DefaultHttpClientOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe: "response";
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: "json";
  withCredentials?: boolean;
}

interface ApiConfig {
  apiUrl: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>("ApiConfig");

export type HttpClientOptions = Partial<DefaultHttpClientOptions>;

// patch Angular HttpParams "toString()" method
// to handle empty array query params properly
let httpParamsToStringOriginal = HttpParams.prototype.toString;
HttpParams.prototype.toString = function () {
  return httpParamsToStringOriginal
    .apply(this)
    .replace(/&{2,}/g, "&")
    .replace(/^&|&$/g, "");
};

/**
 * Provides simplified api to make REST requests to API
 */
@Injectable()
export class ApiService {

  private httpOptions: DefaultHttpClientOptions;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private config: ApiConfig,
  ) {
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      observe: "response",
      responseType: "json"
    };
  }

  public get<T>(url: string, params?: any, httpOptions?: HttpClientOptions) {
    return this.http
      .get<T>(`${this.config.apiUrl}/${url}`, this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public post<T>(url: string, body?: any, params?: any, httpOptions?: HttpClientOptions) {
    return this.http
      .post<T>(`${this.config.apiUrl}/${url}`, JSON.stringify(body), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public put<T>(url: string, body?: any, params?: any, httpOptions?: HttpClientOptions) {
    return this.http
      .put<T>(`${this.config.apiUrl}/${url}`, JSON.stringify(body), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public delete<T>(url: string, params?: any, httpOptions?: HttpClientOptions) {
    return this.http
      .delete<T>(`${this.config.apiUrl}/${url}`, this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  private sanitizeQueryParams(params?: any) {
    if (params instanceof HttpParams) {
      params = params.keys().reduce((result: any, key: string) => {
        result[key] = params.getAll(key);

        return result;
      }, {});
    }

    if (params instanceof Object) {
      Object.keys(params)
        .filter(key => params[key] == null || params[key] === "")
        .forEach(key => {
          delete params[key];
        });
    }

    return params;
  }

  private getHttpOptions(queryParams?: any, httpOptions?: HttpClientOptions): DefaultHttpClientOptions {
    if (!httpOptions) {
      httpOptions = {} as DefaultHttpClientOptions;
    }

    httpOptions.params = this.sanitizeQueryParams(queryParams);

    let result = merge({}, this.httpOptions, httpOptions);

    return result;
  }
}
