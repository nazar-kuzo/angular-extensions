import { Directive, ElementRef } from "@angular/core";
import { MaskDirective } from "ngx-mask";

import { overrideFunction } from "angular-extensions/core";

/**
 * Overrides mask behavior for TextControl
 */
@Directive({
  selector: "[mask]"
})
export class NgxMaskDirective {

  constructor(
    maskDirective: MaskDirective,
    elementRef: ElementRef<HTMLInputElement>
  ) {
    overrideFunction(
      maskDirective,
      context => context.onKeyDown,
      (onKeyDown, _, event: KeyboardEvent) => {
        let input = event.target as HTMLInputElement;

        let invalidSelection = maskDirective.prefix.length > 0 &&
          maskDirective.prefix.length >= input.selectionStart &&
          input.selectionEnd != input.selectionStart;

        if (!event.ctrlKey && invalidSelection) {
          input.selectionStart = 0;
        }

        onKeyDown(event);

        // always put cursor after prefix
        if (!event.ctrlKey && input.selectionStart < maskDirective.prefix.length) {
          input.selectionStart = maskDirective.prefix.length;
        }
      });

    overrideFunction(
      maskDirective,
      context => context.registerOnChange,
      (registerOnChange, _, onChange) => {
        // parse string into number
        registerOnChange((input: string) => {
          if (elementRef.nativeElement.type == "number") {
            onChange(input != "" ? parseFloat(input) : null);
          }
          else {
            onChange(input);
          }
        });
      });

    overrideFunction(
      maskDirective,
      context => context.onFocus,
      (onFocus, _, event: MouseEvent) => {
        let input = event.target as HTMLInputElement;

        // preserve selected text
        if (input.selectionStart == input.selectionEnd) {
          onFocus(event);
        }
      });
  }
}
