import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPseudoCheckboxModule } from "@angular/material/core";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

import { overrideFunction } from "angular-extensions/core";
import { NgxDirectivesModule } from "angular-extensions/directives";
import { NgxBaseControlModule } from "angular-extensions/controls/base-control";
import { SelectControlComponent } from "./select-control.component";
import { MatSelectSearchComponentDirective } from "./ngx-mat-select-search.directive";
import { TruncateDirective } from "./truncate.directive";

interface AppSelectionModel<T> extends Omit<SelectionModel<T>, "_markSelected" | "_unmarkSelected"> {
  _multiple: boolean;

  _emitChanges: boolean;

  _selection: Set<T>;

  _selectedToEmit: T[];

  _deselectedToEmit: T[];

  _unmarkAll(): void;

  _markSelected(value: T): void;

  _unmarkSelected(value: T): void;
}

function patchSelectionModel() {
  overrideFunction(
    SelectionModel.prototype as any as AppSelectionModel<any>,
    selection => selection.isSelected,
    (isSelected, selection, value) => {
      if (selection.compareBy) {
        let key = selection.compareBy(value);

        return selection.values.has(key);
      }
      else {
        return isSelected(value);
      }
    });

  overrideFunction(
    SelectionModel.prototype as any as AppSelectionModel<any>,
    selection => selection._markSelected,
    (markSelected, selection, value) => {
      if (!selection.compareBy) {
        markSelected(value);

        return;
      }

      let key = selection.compareBy(value);

      if (selection.values.has(key)) {
        return;
      }

      if (!selection._multiple) {
        selection._unmarkAll();
      }

      selection._selection.add(value);
      selection.values.set(key, value);

      if (selection._emitChanges) {
        selection._selectedToEmit.push(value);
      }
    });

  overrideFunction(
    SelectionModel.prototype as any as AppSelectionModel<any>,
    selection => selection._unmarkSelected,
    (unmarkSelected, selection, value) => {
      if (!selection.compareBy) {
        unmarkSelected(value);

        return;
      }

      let key = selection.compareBy(value);

      if (!selection.values.has(key)) {
        return;
      }

      selection._selection.delete(value);
      selection.values.delete(key);

      if (selection._emitChanges) {
        selection._deselectedToEmit.push(value);
      }
    });
}

patchSelectionModel();

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatPseudoCheckboxModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    NgxBaseControlModule,
    NgxDirectivesModule,
  ],
  exports: [
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxBaseControlModule,
    ScrollingModule,
    NgxMatSelectSearchModule,

    SelectControlComponent,
    NgxDirectivesModule,
  ],
  declarations: [
    SelectControlComponent,
    MatSelectSearchComponentDirective,
    TruncateDirective,
  ]
})
export class NgxSelectControlModule { }
