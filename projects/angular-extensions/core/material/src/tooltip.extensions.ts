import { fromEvent, merge, of } from "rxjs";
import { delay, sampleTime, switchMap } from "rxjs/operators";
import { MatTooltip, MatTooltipDefaultOptions } from "@angular/material/tooltip";

import { overrideFunction } from "angular-extensions/core";

interface AppMatTooltip extends Omit<MatTooltip, "_touchstartTimeout"> {
  _touchstartTimeout: number;

  _defaultOptions: MatTooltipDefaultOptions;
}

let enhancedTooltipDisplayEnabled = false;

/**
 * Enables tooltip show behavior when tooltip "showDelay" is executed on mouse idle
 * rather than on "mouseenter" event of a tooltip area. This behavior reduces amount
 * of cases when tooltip is shown during the mouse is moved over the tooltip area and
 * tooltip is shown when it was not intended. This behavior is not affecting touch-based triggers.
 *
 * @param [defaultShowDelay] Default show delay. Default value: 150 ms
 */
export function enableEnhancedTooltipDisplay(defaultShowDelay = 150) {
  if (!enhancedTooltipDisplayEnabled) {
    enhancedTooltipDisplayEnabled = true;

    let pendingTootlips = new Map<AppMatTooltip, number>();

    fromEvent(document, "mousemove")
      .pipe(
        sampleTime(50),
        switchMap(() => merge(...Array
          .from(pendingTootlips)
          .map(([tooltip, showDelay]) => of(tooltip).pipe(delay(showDelay))))))
      .subscribe(tooltip => {
        if (pendingTootlips.has(tooltip)) {
          tooltip.show(0);
        }
      });

    overrideFunction(
      MatTooltip.prototype as any as AppMatTooltip,
      tooltip => tooltip.show,
      (show, tooltip, delayTime) => {
        if (tooltip._touchstartTimeout || delayTime == 0 || pendingTootlips.has(tooltip)) {
          pendingTootlips.delete(tooltip);

          show(delayTime);
        }
        else {
          pendingTootlips.set(tooltip, delayTime || Math.max(tooltip._defaultOptions.showDelay || 0, defaultShowDelay));
        }
      });

    overrideFunction(
      MatTooltip.prototype as any as AppMatTooltip,
      tooltip => tooltip.hide,
      (hide, tooltip, delayTime) => {
        pendingTootlips.delete(tooltip);

        hide(delayTime);
      });
  }
}
