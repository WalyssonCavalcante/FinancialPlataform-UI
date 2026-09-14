import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finly-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-group">
      <label [for]="forId">{{ label }}</label>
      <div class="input-with-icon">
        <img *ngIf="icon" [src]="icon" [alt]="label + ' icon'" class="input-icon">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './finly-field.component.scss'
})
export class FinlyFieldComponent {
  @Input() label = '';
  @Input() forId = '';
  @Input() icon = '';
}
