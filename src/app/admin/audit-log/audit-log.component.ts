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

export interface AuditLog {
  id: string;
  entidad: string;
  entidadId: string;
  accion: string;
  metadata?: any;
  userId: string;
  user?: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
  };
  createdAt: string | Date;
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
  displayedColumns = ['fecha', 'usuario', 'accion', 'entidad', 'entidadId'];

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
      params.accion = this.actionControl.value;
    }

    this.http.get<AuditLog[]>(this.apiUrl, { params }).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar logs de auditoría', 'Cerrar', { duration: 3000 });
        // console.error(error);
      }
    });
  }

  getActionColor(accion: string): string {
    const colors: Record<string, string> = {
      'CREATE': 'var(--c-aud-create)',
      'UPDATE': 'var(--c-aud-update)',
      'DELETE': 'var(--c-aud-delete)',
      'LOGIN': 'var(--c-aud-login)',
      'LOGOUT': 'var(--c-aud-logout)'
    };
    return colors[accion] || 'var(--color-neutral)';
  }
}

