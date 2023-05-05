import { castArray, merge } from "lodash-es";
import { map } from "rxjs/operators";
import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { HttpClient, HttpHeaders as AngularHttpHeaders, HttpParams as AngularHttpParams } from "@angular/common/http";

import { patchAngularHttpParams } from "angular-extensions/core";

type HttpHeaders = AngularHttpHeaders | { [header: string]: string | string[] };
type HttpParams = AngularHttpParams | { [param: string]: any };

interface DefaultHttpClientOptions {
  headers?: HttpHeaders;
  observe: "response";
  params?: HttpParams;
  reportProgress?: boolean;
  responseType: "json" | "blob";
  withCredentials?: boolean;
}

interface JsonHttpClientOptions extends DefaultHttpClientOptions {
  responseType: "json";
}

interface BlobHttpClientOptions extends DefaultHttpClientOptions {
  responseType: "blob";
}


export interface ApiConfig {
  apiUrl: string;

  dateConversionExcludePaths: RegExp[];
}

export const API_CONFIG = new InjectionToken<ApiConfig>("ApiConfig");

export type HttpClientOptions = Partial<JsonHttpClientOptions>;

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
    @Optional() @Inject(API_CONFIG) config: ApiConfig,
  ) {
    this.apiUrl = config?.apiUrl;

    this.httpOptions = {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      },
      observe: "response",
      responseType: "json"
    };
  }

  public get<T>(url: string, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .get<T>(this.getUrl(url), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  public getBlob(url: string, params?: HttpParams, httpOptions?: BlobHttpClientOptions) {
    httpOptions = Object.assign({}, { observe: "response", responseType: "blob" }, httpOptions);

    return this.http
      .get(this.getUrl(url), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body));
  }

  public post<T>(url: string, body?: FormData | any, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .post<T>(this.getUrl(url), this.getRequestBody(body), this.getHttpOptions(params, httpOptions, body))
      .pipe(map(response => response.body as T));
  }

  public put<T>(url: string, body?: FormData | any, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .put<T>(this.getUrl(url), this.getRequestBody(body), this.getHttpOptions(params, httpOptions, body))
      .pipe(map(response => response.body as T));
  }

  public patch<T>(url: string, body?: FormData | any, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .patch<T>(this.getUrl(url), this.getRequestBody(body), this.getHttpOptions(params, httpOptions, body))
      .pipe(map(response => response.body as T));
  }

  public delete<T>(url: string, params?: HttpParams, httpOptions?: HttpClientOptions) {
    return this.http
      .delete<T>(this.getUrl(url), this.getHttpOptions(params, httpOptions))
      .pipe(map(response => response.body as T));
  }

  private getUrl(url: string) {
    if (!url.startsWith("http") && this.apiUrl) {
      return `${this.apiUrl}/${url}`;
    }

    return url;
  }

  private sanitizeQueryParams(params?: HttpParams) {
    if (params instanceof AngularHttpParams) {
      return params;
    }
    else if (params != undefined) {
      let httpParams = new AngularHttpParams();

      // uses custom formatter to have flexibility in Date serialization
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .forEach(([key, value]) => {
          let items = castArray(value).map(this.serializeHttpParam);

            for (let item of items) {
              httpParams = httpParams.append(key, item);
            }
        });

      params = httpParams;
    }

    return params;
  }

  private serializeHttpParam(value: any): string | number | boolean {
    if (value instanceof Date) {
      return value.toJSON();
    }
    else {
      return `${value}`;
    }
  }

  private getHttpOptions<TOptions extends DefaultHttpClientOptions>(
    queryParams?: HttpParams,
    httpOptions?: Partial<TOptions>,
    body?: FormData | any): TOptions {
    if (!httpOptions) {
      httpOptions = {};
    }

    httpOptions.params = this.sanitizeQueryParams(queryParams);

    let result = merge(
      {},
      this.httpOptions, {
        headers: {
          ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
      } as Partial<DefaultHttpClientOptions>,
      httpOptions) as TOptions;

    return result;
  }

  private getRequestBody(body: FormData | any) {
    return body instanceof FormData
      ? body
      : JSON.stringify(body);
  }
}
