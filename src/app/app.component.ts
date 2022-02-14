import { Component } from "@angular/core";

@Component({
  selector: "app",
  template: "<router-outlet></router-outlet>",
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `],
})
export class AppComponent {
}
