import { delay, fromEvent, merge, of, sampleTime, switchMap } from "rxjs";
import { Directive, HostListener, Inject } from "@angular/core";
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltip, MatTooltipDefaultOptions } from "@angular/material/tooltip";

import { overrideFunction } from "angular-extensions/core";

interface AppMatTooltip extends Omit<MatTooltip, "_touchstartTimeout"> {
  _touchstartTimeout: number;
}

let pendingTootlips: Set<AppMatTooltip>;

overrideFunction(
  MatTooltip.prototype as any as AppMatTooltip,
  tooltip => tooltip.show,
  (show, tooltip, delayTime) => {
    if (tooltip._touchstartTimeout || pendingTootlips.has(tooltip)) {
      pendingTootlips.delete(tooltip);

      show(delayTime);
    }
    else {
      pendingTootlips.add(tooltip);
    }
  });

overrideFunction(
  MatTooltip.prototype as any as AppMatTooltip,
  tooltip => tooltip.hide,
  (hide, tooltip, delayTime) => {
    pendingTootlips.delete(tooltip);

    hide(delayTime);
  });

/**
 * Fixes issue with unnecessary text selection triggered on long tap on tooltip on mobile devices
 */
@Directive({
  selector: "[matTooltip]"
})
export class TooltipImprovementsDirective {

  constructor(
    @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) tooltipOptions: MatTooltipDefaultOptions,
  ) {

    // provides ability to re-schedule tooltip show event on mouse move
    if (!pendingTootlips) {
      pendingTootlips = new Set<AppMatTooltip>();;

      let showDelay = Math.max(tooltipOptions.showDelay, 150);

      fromEvent(document, "mousemove")
        .pipe(
          sampleTime(showDelay / 3),
          switchMap(() => merge(...Array
            .from(pendingTootlips)
            .map(tooltip => of(tooltip).pipe(delay(showDelay))))))
        .subscribe(tooltip => tooltip.show(0));
    }
  }

  // prevents text selection when long-press on tooltip
  @HostListener("touchstart")
  public touchStart() {
    document.body.classList.add("no-selection");
  }

  // prevents text selection when long-press on tooltip
  @HostListener("touchend")
  public touchEnd() {
    document.body.classList.remove("no-selection");
  }
}
