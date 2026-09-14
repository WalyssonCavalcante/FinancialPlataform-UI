import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle-btn" (click)="themeService.toggleTheme()" [attr.aria-label]="'Toggle theme'">
      <img *ngIf="!themeService.isDarkMode()" src="/Moon-icon.svg" alt="Dark Mode Icon" class="theme-icon" [class.flipped-moon]="flipMoon">
      <img *ngIf="themeService.isDarkMode()" src="/Sun-icon.svg" alt="Light Mode Icon" class="theme-icon">
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      
      .theme-icon {
        width: 32px;
        height: 32px;
        display: block;
      }
      
      .flipped-moon {
        transform: scaleX(-1);
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    :host-context([data-theme="dark"]) .theme-toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ThemeToggleComponent {
  @Input() flipMoon = false;
  themeService = inject(ThemeService);
}
