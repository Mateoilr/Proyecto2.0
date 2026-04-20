import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExamsService, Exam } from '../../core/services/exams.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  private examsService = inject(ExamsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'codigo', 'nombre', 'categoria', 'precio', 'activo', 'actions'];
  dataSource = new MatTableDataSource<Exam>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadExams();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExams(): void {
    this.loading = true;
    this.examsService.getAll().subscribe({
      next: (exams) => {
        this.dataSource.data = exams;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar exámenes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editExam(exam: Exam): void {
    this.router.navigate(['/exams', exam.id, 'edit']);
  }

  toggleActive(exam: Exam): void {
    const action = exam.estado === 'ACTIVE' ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Confirmar ${action}`,
        message: `¿Está seguro de ${action} el examen ${exam.nombre}?`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = exam.estado === 'ACTIVE'
          ? this.examsService.deactivate(exam.id)
          : this.examsService.activate(exam.id);

        request.subscribe({
          next: () => {
            this.snackBar.open(`Examen ${action}do correctamente`, 'Cerrar', { duration: 3000 });
            this.loadExams();
          },
          error: (error) => {
            this.snackBar.open(error.message || `Error al ${action} examen`, 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteExam(exam: Exam): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Está seguro de eliminar el examen ${exam.nombre}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.examsService.delete(exam.id).subscribe({
          next: () => {
            this.snackBar.open('Examen eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.loadExams();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Error al eliminar examen', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  createExam(): void {
    this.router.navigate(['/exams/new']);
  }
}
