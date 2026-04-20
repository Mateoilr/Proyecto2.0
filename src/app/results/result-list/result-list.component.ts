import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { ResultsService, Result } from '../../core/services/results.service';

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {
  private router = inject(Router);
  private resultsService = inject(ResultsService);
  private snackBar = inject(MatSnackBar);

  results: Result[] = [];
  loading = true;
  displayedColumns = ['orden', 'paciente', 'examen', 'valor', 'estado', 'fecha', 'acciones'];

  searchControl = new FormControl('');
  estadoControl = new FormControl('');

  ngOnInit(): void {
    this.loadResults();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadResults();
    });

    this.estadoControl.valueChanges.subscribe(() => {
      this.loadResults();
    });
  }

  loadResults(): void {
    this.loading = true;
    const params: any = {};

    if (this.searchControl.value) {
      params.search = this.searchControl.value;
    }

    if (this.estadoControl.value) {
      params.estado = this.estadoControl.value;
    }

    this.resultsService.getAll(params).subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar resultados', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  getEstadoColor(estado: string): string {
    const colors: Record<string, string> = {
      'REGISTRADO': '#ff9800',
      'VALIDADO': '#4caf50',
      'RECHAZADO': '#f44336',
      'ENTREGADO': '#2196f3'
    };
    return colors[estado] || '#666';
  }

  onEdit(result: Result): void {
    this.router.navigate(['/results', result.id, 'edit']);
  }

  onValidate(result: Result): void {
    if (confirm('¿Está seguro de que desea validar este resultado?')) {
      // Obtener el usuario actual
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        this.snackBar.open('Error: Usuario no autenticado', 'Cerrar', { duration: 3000 });
        return;
      }

      const user = JSON.parse(userStr);
      if (!user.id) {
        this.snackBar.open('Error: ID de usuario no válido', 'Cerrar', { duration: 3000 });
        return;
      }

      this.resultsService.validate(result.id, user.id).subscribe({
        next: () => {
          this.snackBar.open('Resultado validado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadResults();
        },
        error: (error) => {
          this.snackBar.open('Error al validar el resultado', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  onReject(result: Result): void {
    const motivo = prompt('Ingrese el motivo del rechazo:');
    if (motivo) {
      this.resultsService.reject(result.id, motivo).subscribe({
        next: () => {
          this.snackBar.open('Resultado rechazado', 'Cerrar', { duration: 3000 });
          this.loadResults();
        },
        error: (error: any) => {
          this.snackBar.open('Error al rechazar el resultado', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }
}
