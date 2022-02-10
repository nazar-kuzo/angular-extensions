import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BaseEditor, Field } from "angular-extensions/models";

@Component({
  selector: "collection-control",
  templateUrl: "./collection-control.component.html",
  styleUrls: ["./collection-control.component.scss"]
})
export class CollectionControlComponent {

  @Input()
  public field: Field<BaseEditor[]>;

  @Input()
  public fieldClass: string;

  @Output()
  public add: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public remove: EventEmitter<any> = new EventEmitter<any>();

  @ContentChild("itemTemplate", { static: true })
  public itemTemplate: TemplateRef<{ $implicit: any }>;
}
