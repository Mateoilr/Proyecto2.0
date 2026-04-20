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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PatientsService, Patient } from '../../core/services/patients.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-patient-list',
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
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  private patientsService = inject(PatientsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'documento', 'nombre', 'apellido', 'sexo', 'telefono', 'email', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients(): void {
    this.loading = true;
    this.patientsService.getAll().subscribe({
      next: (patients) => {
        this.dataSource.data = patients;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar pacientes', 'Cerrar', { duration: 3000 });
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

  viewPatient(patient: Patient): void {
    this.router.navigate(['/patients', patient.id]);
  }

  editPatient(patient: Patient): void {
    this.router.navigate(['/patients', patient.id, 'edit']);
  }

  deletePatient(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Está seguro de eliminar al paciente ${patient.nombres} ${patient.apellidos}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientsService.delete(patient.id).subscribe({
          next: () => {
            this.snackBar.open('Paciente eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.loadPatients();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Error al eliminar paciente', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  createPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  getSexoLabel(sexo: string): string {
    return sexo === 'M' ? 'Masculino' : 'Femenino';
  }
}
