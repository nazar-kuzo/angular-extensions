import {
  Component, Input, Output, EventEmitter, ViewChild,
  ElementRef, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ContentChild, TemplateRef,
} from "@angular/core";

import { FileSizePipe } from "ngx-filesize";
import { FilePickerAdapter, FilePickerComponent, FilePreviewModel, FileValidationTypes, ValidationError } from "ngx-awesome-uploader";

import { FileService } from "./file.service";
import { ControlBase } from "angular-extensions/controls/base-control";

@Component({
  selector: "file-control",
  templateUrl: "./file-control.component.html",
  styleUrls: ["./file-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileService]
})
export class FileControlComponent extends ControlBase<File[]> implements OnInit {

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

  @ContentChild(TemplateRef)
  public contentTemplate: TemplateRef<HTMLElement>;

  @ViewChild(FilePickerComponent)
  public filePicker: FilePickerComponent;

  public validationErrors: ValidationError[] = [];

  constructor(
    private elementRef: ElementRef<HTMLFieldSetElement>,
    private changeDetectorRef: ChangeDetectorRef,
    private fileSizePipe: FileSizePipe,
    public defaultAdapter: FileService,
  ) {
    super();

    this.adapter = this.adapter || defaultAdapter;
  }

  public ngOnInit() {
    // replace file in single select mode
    if (!this.multiple) {
      this.elementRef.nativeElement.addEventListener(
        "change",
        () => {
          this.field.control.setValue([], { emitEvent: false, emitModelToViewChange: false });

          this.filePicker.files = [];

          this.changeDetectorRef.markForCheck();
        },
        { capture: true });
    }
  }

  public onDialogOpen() {
    this.elementRef.nativeElement.addEventListener(
      "focus",
      () => {
        this.field.control.markAsTouched({ onlySelf: true });

        this.changeDetectorRef.markForCheck();
      },
      { capture: true, once: true });
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

    this.changeDetectorRef.markForCheck();
  }

  public onFileAdded(file: FilePreviewModel) {
    this.validationErrors = [];

    this.field.control.setValue(this.field.value
      ? [...this.field.value, file.file as File]
      : [file.file as File]);

    this.changeDetectorRef.markForCheck();
  }

  public onFileRemoved(removedFile: FilePreviewModel) {
    this.validationErrors = [];

    this.field.control.setValue(this.field.value
      ? this.field.value.filter(file => file.name != removedFile.fileName)
      : [removedFile.file as File]);

    this.changeDetectorRef.markForCheck();
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
