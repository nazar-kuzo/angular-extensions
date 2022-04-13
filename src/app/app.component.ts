import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app",
  template: "<router-outlet></router-outlet>",
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
