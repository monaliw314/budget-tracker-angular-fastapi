import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransactionList } from "./schema/components/transaction-list/transaction-list";
import {DashboardComponent} from "./schema/components/dashboard/dashboard";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TransactionList, DashboardComponent,MatGridListModule, MatCardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
