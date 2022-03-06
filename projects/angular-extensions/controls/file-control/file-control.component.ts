import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from "@angular/core";
import { FileSizePipe } from "ngx-filesize";
import { FilePickerAdapter, FilePickerComponent, FilePreviewModel, FileValidationTypes, ValidationError } from "ngx-awesome-uploader";

import { Field } from "angular-extensions/models";
import { FileService } from "./file.service";

@Component({
  selector: "file-control",
  templateUrl: "./file-control.component.html",
  styleUrls: ["./file-control.component.scss"],
  providers: [FileService]
})
export class FileControlComponent implements OnInit {

  @Input()
  public field: Field<File[]>;

  @Input()
  public disabled: boolean;

  @Input()
  public multiple: boolean;

  @Input()
  public allowedFileExtensions: string[];

  @Input()
  public accept: string[] = [];

  @Input()
  public maxFileSize: number;

  @Input()
  public totalFileSize: number;

  @Input()
  public autoUpload = false;

  @Input()
  public adapter: FilePickerAdapter;

  @Input()
  public showPreview: boolean;

  @Output()
  public changes: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild(FilePickerComponent)
  public filePicker: FilePickerComponent;

  public validationErrors: ValidationError[] = [];

  constructor(
    private elementRef: ElementRef<HTMLFieldSetElement>,
    private fileSizePipe: FileSizePipe,
    public defaultAdapter: FileService,
  ) {
    this.adapter = this.adapter || defaultAdapter;
  }

  public ngOnInit() {
    this.elementRef.nativeElement.addEventListener(
      "change",
      () => {
        // replace file is single select mode
        if (!this.multiple) {
          this.field.control.setValue([], { emitEvent: false, emitModelToViewChange: false });

          this.filePicker.files = [];
        }

        this.field.control.markAsTouched();
      },
      { capture: true });
  }

  public onValidationError(error: ValidationError) {
    const errIndex = this.validationErrors.findIndex(e => e.file == error.file);
    error.error = this.getValidationErrorMessage(error.error as FileValidationTypes);

    if (errIndex != -1) {
      this.validationErrors[errIndex] = error;
    }
    else {
      this.validationErrors.push(error);
    }
  }

  public onFileAdded(file: FilePreviewModel) {
    this.validationErrors = [];

    this.field.value = this.field.value
      ? [...this.field.value, file.file as File]
      : [file.file as File];
  }

  public onFileRemoved(removedFile: FilePreviewModel) {
    this.validationErrors = [];

    this.field.value = this.field.value
      ? this.field.value.filter(file => file.name != removedFile.fileName)
      : [removedFile.file as File];
  }

  private getValidationErrorMessage(errorType: FileValidationTypes) {
    switch (errorType) {

      case FileValidationTypes.uploadType:
        return this.multiple ? "Select multiple files" : "Select only one file";

      case FileValidationTypes.extensions:
        return `Selected file should have ${this.allowedFileExtensions} extension`;

      case FileValidationTypes.fileMaxSize:
        return `The size of selected file is larger than ${this.fileSizePipe.transform(this.maxFileSize)}`;

      case FileValidationTypes.totalMaxSize:
        return `The total size of selected files is larger than ${this.fileSizePipe.transform(this.totalFileSize)}`;

      default:
        return "There was an error while adding your file";
    }
  }
}
