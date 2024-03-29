import {
  Component, Input, ViewChild, ElementRef, OnInit, ChangeDetectorRef,
  ChangeDetectionStrategy, ContentChild, TemplateRef,
} from "@angular/core";

import { FilePickerAdapter, FilePickerComponent, FilePreviewModel, FileValidationTypes, ValidationError } from "ngx-awesome-uploader";

import { NoUploadFileService } from "./no-upload-file.service";
import { ControlBase } from "angular-extensions/controls/base-control";

export type ValidationErrorMessageTemplate = {
  [key in FileValidationTypes]: (control: FileControlComponent) => string;
};

@Component({
  selector: "file-control",
  templateUrl: "./file-control.component.html",
  styleUrls: ["./file-control.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NoUploadFileService]
})
export class FileControlComponent extends ControlBase<File[]> implements OnInit {

  /**
   * Indicates whether you can upload single or multiple files
   */
  @Input()
  public multiple: boolean;

  /**
   * Restricts which file extensions are allowed to upload.
   * Default: any extension
   *
   * @example ['pdf', 'jpg', 'jpeg']
   */
  @Input()
  public allowedFileExtensions: string[];

  /**
   * Specifies file extension filter that would be applied during file selection.
   * Default: show all
   *
   * @example ['.pdf', '.jpg', '.jpeg']
   */
  @Input()
  public accept: string[] = [];

  /**
   * Input max file size (in MB) of selected file. Default: no limit
   */
  @Input()
  public maxFileSize: number;

  /**
   * Total max size (in MB) limit of all files. Default: no limit
   */
  @Input()
  public totalFileSize: number;

  /**
   * Max count of files in multi-upload. Default: no limit
   */
  @Input()
  public maxFilesCount: number;

  /**
   * Whether to auto upload file on file choose or not.
   * Default: false
   */
  @Input()
  public autoUpload = false;

  /**
   * Custom Adapter for uploading/removing files.
   * Default: {@link NoUploadFileService}
   */
  @Input()
  public adapter: FilePickerAdapter;

  /**
   * Whether to show default files preview container.
   * Default: false
   */
  @Input()
  public showPreview: boolean;

  @Input()
  public customErrorMessages: Partial<ValidationErrorMessageTemplate>;

  @ContentChild(TemplateRef)
  public contentTemplate: TemplateRef<HTMLElement>;

  @ViewChild(FilePickerComponent)
  public filePicker: FilePickerComponent;

  public validationErrors: ValidationError[] = [];

  private validationErrorMessages: ValidationErrorMessageTemplate;

  constructor(
    private elementRef: ElementRef<HTMLFieldSetElement>,
    private changeDetectorRef: ChangeDetectorRef,
    public defaultAdapter: NoUploadFileService,
  ) {
    super();

    this.adapter = this.adapter || defaultAdapter;

    this.validationErrorMessages = {
      UPLOAD_TYPE: control => control.multiple ? "Select multiple files" : "Select only one file",
      EXTENSIONS: control => `Selected file should have ${control.allowedFileExtensions} extension`,
      FILE_MAX_SIZE: control => `The size of selected file is larger than ${control.maxFileSize} MB`,
      TOTAL_MAX_SIZE: control => `The total size of selected files is larger than ${control.totalFileSize} MB`,
      FILE_MAX_COUNT: control => `Max count of files to upload should be not more than ${control.maxFilesCount}`,
      CUSTOM_VALIDATOR: _ => `There was an error while adding your file`,
    };
  }

  public ngOnInit() {
    this.singleSelectModePatch();

    if (this.customErrorMessages) {
      Object.entries(this.customErrorMessages)
        .forEach(([error, messageProvider]) => {
          this.validationErrorMessages[error as FileValidationTypes] = messageProvider;
        });
    }
  }

  public onDialogOpen() {
    this.elementRef.nativeElement.addEventListener(
      "focus",
      () => {
        this.validationErrors = [];

        this.field.control.markAsTouched({ onlySelf: true });

        this.changeDetectorRef.markForCheck();
      },
      { capture: true, once: true });
  }

  public onValidationError(error: ValidationError) {
    error.error = this.validationErrorMessages[error.error as FileValidationTypes](this);

    let errIndex = this.validationErrors.findIndex(e => e.file == error.file);

    if (errIndex != -1) {
      this.validationErrors[errIndex] = error;
    }
    else {
      this.validationErrors.push(error);
    }

    this.changeDetectorRef.markForCheck();
  }

  public onFileAdded(file: FilePreviewModel) {
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

  /**
   * Patches single select mode by replacing already selected file.
   */
  private singleSelectModePatch() {
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
}
