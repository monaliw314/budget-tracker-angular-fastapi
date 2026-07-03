import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  form: FormGroup;

  categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Salary', 'Freelance', 'Investment'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<TransactionForm>
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      type: ['expense', Validators.required],
      date: [new Date(), Validators.required]
    });
  }
  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      date: formValue.date.toISOString().split('T')[0]
    };

    this.transactionService.createTransaction(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error creating transaction:', err)
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
