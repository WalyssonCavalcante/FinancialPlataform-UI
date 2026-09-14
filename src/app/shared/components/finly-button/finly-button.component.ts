import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finly-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn-primary" 
      [type]="type" 
      [disabled]="disabled || isLoading">
      <ng-container *ngIf="isLoading; else contentTpl">
        {{ loadingText }}
      </ng-container>
      <ng-template #contentTpl>
        <ng-content></ng-content>
      </ng-template>
    </button>
  `,
  styleUrl: './finly-button.component.scss'
})
export class FinlyButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() loadingText = 'Carregando...';
}
