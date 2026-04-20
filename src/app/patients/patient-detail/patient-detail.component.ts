import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientsService, Patient } from '../../core/services/patients.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  private patientsService = inject(PatientsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  patient?: Patient;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(parseInt(id));
    }
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.patientsService.getById(id.toString()).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar paciente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/patients']);
        this.loading = false;
      }
    });
  }

  editPatient(): void {
    if (this.patient) {
      this.router.navigate(['/patients', this.patient.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  createOrder(): void {
    if (this.patient) {
      this.router.navigate(['/orders/new'], { queryParams: { patientId: this.patient.id } });
    }
  }

getAge(fechaNacimiento: string | Date): number {
    const today = new Date();
    const birthDate = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  getSexoLabel(sexo: string): string {
    return sexo === 'M' ? 'Masculino' : 'Femenino';
  }

  getTipoDocumentoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'CEDULA': 'Cédula',
      'PASAPORTE': 'Pasaporte',
      'RUC': 'RUC'
    };
    return labels[tipo] || tipo;
  }
}
