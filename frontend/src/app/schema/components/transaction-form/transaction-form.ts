import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionService } from '../../services/transaction';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isEditMode = false;

  categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Salary', 'Freelance', 'Investment'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<TransactionForm>,
    private snackBar: MatSnackBar,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      amount: [data?.amount || null, [Validators.required, Validators.min(1)]],
      category: [data?.category || '', Validators.required],
      type: [data?.type || 'expense', Validators.required],
      date: [data?.date ? new Date(data.date) : new Date(), Validators.required]
    });
  }
  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      date: formValue.date.toISOString().split('T')[0]
    };

    if (this.isEditMode) {
      this.transactionService.updateTransaction(this.data.id, payload).subscribe({
        next: (response:any) => {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          console.log(response.message); // "Data updated successfully"
          this.dialogRef.close(true);
        },
        error: (err) => {
        this.snackBar.open('Error updating transaction', 'Close', { duration: 3000 });
        console.error(err);
      }
      });
    } else {
      this.transactionService.createTransaction(payload).subscribe({
      next: (response:any) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        console.log(response.message); // "Record created successfully"
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Error Creating transaction', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
