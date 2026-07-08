import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../services/transaction';
import {TransactionForm} from '../transaction-form/transaction-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-transaction-list',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,MatCardModule,FormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDialogModule,MatDatepickerModule,MatNativeDateModule
  ],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['title', 'category', 'type', 'amount', 'date', 'actions'];
  dataSource = new MatTableDataSource<Transaction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private transactionService: TransactionService,private dialog: MatDialog,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching transactions:', err)
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: (response:any) => {
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.loadTransactions(); // refresh list after delete
      },
      error: (err:any) => {
        this.snackBar.open('Error deleting transaction', 'Close', { duration: 3000 });
        console.error('Error deleting transaction:', err);
      }
    });
  }

  openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '400px',
      data: transaction
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransactionForm, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  applyDateFilter(): void {
    if (this.startDate && this.endDate) {
      const start = this.formatDate(this.startDate);
      const end = this.formatDate(this.endDate);
      this.transactionService.getTransactions(start, end).subscribe({
        next: (data) => {
          this.dataSource.data = data;
        },
        error: (err) => console.error('Error fetching filtered transactions:', err)
      });
    }
  }

  clearDateFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadTransactions();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}