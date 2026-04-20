import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface AuditLog {
  id: string;
  userId: string;
  user?: {
    nombres: string;
    email: string;
  };
  action: string;
  entity: string;
  entityId: string;
  changes?: any;
  createdAt: Date | string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private apiUrl = `${environment.apiUrl}/audit`;

  logs: AuditLog[] = [];
  loading = true;
  displayedColumns = ['fecha', 'usuario', 'accion', 'entidad', 'entityId'];

  searchControl = new FormControl('');
  actionControl = new FormControl('');

  ngOnInit(): void {
    this.loadLogs();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadLogs();
    });

    this.actionControl.valueChanges.subscribe(() => {
      this.loadLogs();
    });
  }

  loadLogs(): void {
    this.loading = true;
    const params: any = {};

    if (this.searchControl.value) {
      params.search = this.searchControl.value;
    }

    if (this.actionControl.value) {
      params.action = this.actionControl.value;
    }

    this.http.get<AuditLog[]>(this.apiUrl, { params }).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar logs de auditoría', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  getActionColor(action: string): string {
    const colors: Record<string, string> = {
      'CREATE': '#4caf50',
      'UPDATE': '#2196f3',
      'DELETE': '#f44336',
      'LOGIN': '#9c27b0',
      'LOGOUT': '#ff9800'
    };
    return colors[action] || '#666';
  }
}
