import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <header class="settings-header">
        <h1 class="settings-title">Configurações</h1>
        <p class="settings-subtitle">Gerencie suas informações de perfil e segurança</p>
      </header>

      <div class="settings-content">
        <div class="settings-card">
          <h2>Perfil do Usuário</h2>
          
          <div class="form-group">
            <label>Nome</label>
            <input type="text" [(ngModel)]="name" placeholder="Seu nome completo" class="finly-input" />
          </div>

          <div class="form-group">
            <label>Nova Senha</label>
            <input type="password" [(ngModel)]="password" placeholder="Deixe em branco para não alterar" class="finly-input" />
          </div>

          <div class="form-actions">
            <span class="status-message" [class.success]="isSuccess" [class.error]="isError">
              {{ statusMessage }}
            </span>
            <button class="btn-primary" [disabled]="isLoading" (click)="saveSettings()">
              {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  userId!: number;
  name: string = '';
  password = '';
  
  isLoading = false;
  statusMessage = '';
  isSuccess = false;
  isError = false;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.name = user.name;
    }
  }

  saveSettings() {
    this.isLoading = true;
    this.statusMessage = '';
    this.isSuccess = false;
    this.isError = false;

    const updateData: any = {};
    if (this.name.trim()) updateData.name = this.name.trim();
    if (this.password.trim()) updateData.password = this.password.trim();

    this.authService.updateUser(this.userId, updateData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.statusMessage = 'Perfil atualizado com sucesso!';
        this.password = ''; // clear password field
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.statusMessage = 'Erro ao atualizar perfil.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
