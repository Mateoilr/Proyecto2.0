import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { ResultsService, Result } from '../../core/services/results.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { ValidateResultDialogComponent } from '../../shared/components/validate-result-dialog.component';

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
    MatExpansionModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.css']
})
export class ResultListComponent implements OnInit {
  private router = inject(Router);
  private resultsService = inject(ResultsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  results: Result[] = [];
  groupedResults: { examName: string; examCode: string; results: Result[] }[] = [];
  loading = true;
  displayedColumns = ['orden', 'paciente', 'valor', 'estado', 'fecha', 'acciones'];

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
        this.groupResultsByExam();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar resultados', 'Cerrar', { duration: 3000 });
        // console.error(error);
      }
    });
  }

  getEstadoColor(estado: string): string {
    const colors: { [key: string]: string } = {
      'REGISTRADO': 'var(--c-res-registrado)',
      'VALIDADO': 'var(--c-res-validado)',
      'RECHAZADO': 'var(--c-res-rechazado)',
      'ENTREGADO': 'var(--c-res-entregado)'
    };
    return colors[estado] || 'var(--color-neutral)';
  }

  groupResultsByExam(): void {
    const map = new Map<string, { examName: string; examCode: string; results: Result[] }>();

    for (const result of this.results) {
      const examName = result.orderItem?.exam?.nombre || 'Desconocido';
      const examCode = result.orderItem?.exam?.codigo || '';

      if (!map.has(examName)) {
        map.set(examName, { examName, examCode, results: [] });
      }
      map.get(examName)!.results.push(result);
    }

    this.groupedResults = Array.from(map.values());
  }

  onEdit(result: Result): void {
    this.router.navigate(['/results', result.id, 'edit']);
  }

  onReview(result: Result): void {
    const dialogRef = this.dialog.open(ValidateResultDialogComponent, {
      width: '500px',
      data: { result }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.action === 'validate') {
        this.resultsService.validate(result.id).subscribe({
          next: () => {
            this.snackBar.open('Resultado validado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadResults();
          },
          error: (error: any) => {
            this.snackBar.open('Error al validar el resultado', 'Cerrar', { duration: 3000 });
          }
        });
      } else if (res?.action === 'reject') {
        // En un futuro, el comentario puede enviarse en un nuevo DTO para el endpoint de reject
        // this.resultsService.reject(result.id, { motivo: res.comentario })...
        this.resultsService.reject(result.id).subscribe({
          next: () => {
            this.snackBar.open('Resultado rechazado por inconsistencias', 'Cerrar', { duration: 3000 });
            this.loadResults();
          },
          error: (error: any) => {
            this.snackBar.open('Error al rechazar el resultado', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}

