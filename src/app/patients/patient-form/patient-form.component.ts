import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientsService, Patient } from '../../core/services/patients.service';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private patientsService = inject(PatientsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  patientForm!: FormGroup;
  loading = false;
  isEditMode = false;
  patientId?: number;

  tiposDocumento = [
    { value: 'CEDULA', label: 'Cédula' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' }
  ];

  sexos = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.patientId = parseInt(id);
      this.loadPatient(this.patientId);
    }
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      tipoDocumento: ['CEDULA', Validators.required],
      documento: ['', [Validators.required, Validators.pattern(/^[0-9]{10,13}$/)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      direccion: [''],
      contacto: ['', Validators.pattern(/^[0-9]{9,10}$/)],
      email: ['', Validators.email]
    });
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.patientsService.getById(id.toString()).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          ...patient,
          fechaNacimiento: new Date(patient.fechaNacimiento)
        });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar paciente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/patients']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid && !this.loading) {
      this.loading = true;

      const formData = {
        ...this.patientForm.value,
        fechaNacimiento: this.patientForm.value.fechaNacimiento.toISOString().split('T')[0]
      };

      const request = this.isEditMode && this.patientId
        ? this.patientsService.update(this.patientId.toString(), formData)
        : this.patientsService.create(formData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Paciente ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error al guardar paciente', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.patientForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.patientForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.getError('minlength').requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (fieldName === 'documento') {
        return 'Documento inválido (10-13 dígitos)';
      }
      if (fieldName === 'contacto') {
        return 'Teléfono inválido (9-10 dígitos)';
      }
    }
    return '';
  }
}
