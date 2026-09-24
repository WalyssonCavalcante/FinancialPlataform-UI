import { Component, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toast = signal<Toast | null>(null);

  show(message: string, type: ToastType = 'success', durationMs = 3000) {
    this.toast.set({ message, type, visible: true });

    setTimeout(() => {
      const current = this.toast();
      if (current) {
        this.toast.set({ ...current, visible: false });
      }
      setTimeout(() => this.toast.set(null), 400);
    }, durationMs);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toast(); as t) {
      <div class="toast-container" [class.visible]="t.visible" [class]="'toast-' + t.type">
        <div class="toast-icon">
          @switch (t.type) {
            @case ('success') { ✓ }
            @case ('error') { ✕ }
            @case ('info') { ℹ }
          }
        </div>
        <span class="toast-message">{{ t.message }}</span>
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      color: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);

      &.visible {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .toast-icon {
      font-size: 1.2rem;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.25);
    }

    .toast-success {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }

    .toast-error {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .toast-info {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
