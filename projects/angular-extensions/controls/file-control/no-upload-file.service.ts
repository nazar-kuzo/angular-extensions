import { Injectable } from "@angular/core";
import { FilePickerAdapter, FilePreviewModel, UploadResponse } from "ngx-awesome-uploader";
import { Observable, of } from "rxjs";

/**
 * Dummy file service that is not performing any file upload.
 * Used as default file upload service.
 */
@Injectable()
export class NoUploadFileService extends FilePickerAdapter {

  constructor() {
    super();
  }

  public uploadFile(_: FilePreviewModel): Observable<UploadResponse> {
    return of({} as UploadResponse);
  }

  public removeFile(_: FilePreviewModel): Observable<any> {
    return of(true);
  }
}
