import { Input, Directive, OnInit } from "@angular/core";
import { MatOption } from "@angular/material/core";

export interface MatOptionWithContext<TContext> extends MatOption {
  context: TContext;
}

@Directive({
  selector: "mat-option[context]"
})
export class OptionContextDirective<TContext> implements OnInit {

  @Input()
  public context: TContext;

  constructor(
    private matOption: MatOption,
  ) {
  }

  public ngOnInit() {
    (this.matOption as MatOptionWithContext<TContext>).context = this.context;
  }
}
