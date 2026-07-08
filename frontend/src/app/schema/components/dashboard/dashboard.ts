// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.scss',
// })
// export class Dashboard {

// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];

  totalIncome = 0;
  totalExpense = 0;
  netBalance = 0;

  categoryChartData: { name: string; value: number }[] = [];

  monthlyTrendData: { name: string; series: { name: string; value: number }[] }[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.calculateSummary();
        this.buildCategoryChart();
        this.buildMonthlyTrend();
      },
      error: (err) => console.error('Error fetching transactions:', err)
    });
  }

  calculateSummary(): void {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.netBalance = this.totalIncome - this.totalExpense;
  }


  //function for creating chart data based on categories and their respective expenses
  buildCategoryChart(): void {
    const expensesByCategory: { [key: string]: number } = {};

    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    this.categoryChartData = Object.keys(expensesByCategory).map(category => ({
      name: category,
      value: expensesByCategory[category]
    }));
  }

  buildMonthlyTrend(): void {
  const monthlyData: { [month: string]: { income: number; expense: number } } = {};

  this.transactions.forEach(t => {
    const monthKey = t.date.substring(0, 7); // "2026-06" from "2026-06-01"
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyData[monthKey].income += t.amount;
    } else {
      monthlyData[monthKey].expense += t.amount;
    }
  });
  const sortedMonths = Object.keys(monthlyData).sort();

  this.monthlyTrendData = [
    {
      name: 'Income',
      series: sortedMonths.map(month => ({ name: month, value: monthlyData[month].income }))
    },
    {
      name: 'Expense',
      series: sortedMonths.map(month => ({ name: month, value: monthlyData[month].expense }))
    }
  ];
  }
}