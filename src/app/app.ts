import { Component, signal } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { slideInAnimation } from './core/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [slideInAnimation]
})
export class App {
  protected readonly title = signal('financial-platform-ui');

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
