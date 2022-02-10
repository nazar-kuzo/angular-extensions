import { Injectable } from "@angular/core";
import { FilePickerAdapter, FilePreviewModel, UploadResponse } from "ngx-awesome-uploader";
import { Observable, of } from "rxjs";

@Injectable()
export class FileService extends FilePickerAdapter {

  private url: string;

  constructor() {
    super();
  }

  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    return of({} as UploadResponse);
  }

  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    return of(true);
  }

}
