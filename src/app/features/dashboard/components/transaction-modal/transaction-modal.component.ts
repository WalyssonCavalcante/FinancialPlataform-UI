import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="finly-modal-overlay" (click)="close.emit()">
      <div class="finly-modal" (click)="$event.stopPropagation()">
        
        <button class="btn-close" (click)="close.emit()" title="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <!-- Hero Amount Input -->
          <div class="amount-hero" [class.is-income]="type === 'INCOME'" [class.is-expense]="type === 'EXPENSE'">
            <span class="currency-symbol">R$</span>
            <input 
              type="number" 
              step="0.01" 
              formControlName="amount" 
              placeholder="0,00" 
              class="amount-input"
            >
          </div>

          <!-- Details Section -->
          <div class="details-section">
            <input 
              type="text" 
              formControlName="description" 
              placeholder="O que foi isso? (ex: Aluguel, Salário...)" 
              class="detail-input hero-desc"
            >

            <div class="category-wrapper">
              <select formControlName="categoryId" class="detail-input cat-select">
                <option value="" disabled selected>Selecione uma categoria</option>
                @for (cat of categories; track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
              
              <button 
                type="button" 
                class="btn-new-cat" 
                (click)="showNewCategory = !showNewCategory"
              >
                + Categoria
              </button>
            </div>

            @if (showNewCategory) {
              <div class="new-cat-inline">
                <input 
                  type="text" 
                  [formControl]="newCategoryControl" 
                  placeholder="Nome da categoria" 
                  class="detail-input"
                >
                <button 
                  type="button" 
                  class="btn-text" 
                  (click)="createCategory()" 
                  [disabled]="!newCategoryControl.value"
                >
                  Salvar
                </button>
              </div>
            }
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn-submit" [disabled]="form.invalid || isSaving">
              {{ isSaving ? 'Registrando...' : (type === 'INCOME' ? 'Confirmar receita' : 'Confirmar despesa') }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styleUrl: './transaction-modal.component.scss'
})
export class TransactionModalComponent implements OnInit {
  @Input() type!: 'INCOME' | 'EXPENSE';
  @Input() accountId!: number;
  
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);

  form!: FormGroup;
  categories: Category[] = [];
  
  isSaving = false;
  showNewCategory = false;
  newCategoryControl = this.fb.control('');

  ngOnInit() {
    this.form = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => this.categories = cats.filter(c => c.type === this.type),
      error: (err) => console.error('Erro ao carregar categorias', err)
    });
  }

  createCategory() {
    const val = this.newCategoryControl.value;
    if (!val) return;
    
    this.categoryService.createCategory(val, this.type).subscribe({
      next: (cat) => {
        this.categories.push(cat);
        this.form.patchValue({ categoryId: cat.id });
        this.showNewCategory = false;
        this.newCategoryControl.reset();
      },
      error: (err) => console.error('Erro ao criar categoria', err)
    });
  }

  authService = inject(AuthService);

  onSubmit() {
    if (this.form.invalid) return;

    this.isSaving = true;
    const dto = {
      description: this.form.value.description,
      amount: this.form.value.amount,
      type: this.type,
      accountId: this.accountId,
      categoryId: Number(this.form.value.categoryId)
    };

    const user = this.authService.getCurrentUser();
    const userId = user ? user.id : 0;

    this.transactionService.createTransaction(dto, userId).subscribe({
      next: () => {
        this.isSaving = false;
        this.saved.emit();
      },
      error: (err) => {
        console.error('Erro ao salvar transação', err);
        this.isSaving = false;
      }
    });
  }
}
