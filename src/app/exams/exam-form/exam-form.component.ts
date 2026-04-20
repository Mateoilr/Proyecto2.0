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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamsService, Exam } from '../../core/services/exams.service';

@Component({
  selector: 'app-exam-form',
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
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private examsService = inject(ExamsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  examForm!: FormGroup;
  loading = false;
  isEditMode = false;
  examId?: number;

  categorias = [
    { value: 'HEMATOLOGIA', label: 'Hematología' },
    { value: 'BIOQUIMICA', label: 'Bioquímica' },
    { value: 'MICROBIOLOGIA', label: 'Microbiología' },
    { value: 'INMUNOLOGIA', label: 'Inmunología' },
    { value: 'HORMONAS', label: 'Hormonas' },
    { value: 'CITOLOGIA', label: 'Citología' },
    { value: 'ANATOMIA_PATOLOGICA', label: 'Anatomía Patológica' },
    { value: 'OTROS', label: 'Otros' }
  ];

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.examId = parseInt(id);
      this.loadExam(this.examId);
    }
  }

  initForm(): void {
    this.examForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      categoria: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      tiempoResultadoDias: [1, [Validators.required, Validators.min(1)]],
      preparacion: [''],
      estado: ['ACTIVE']
    });
  }

  loadExam(id: number): void {
    this.loading = true;
    this.examsService.getById(id.toString()).subscribe({
      next: (exam) => {
        this.examForm.patchValue(exam);
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar examen', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/exams']);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.examForm.valid && !this.loading) {
      this.loading = true;

      const request = this.isEditMode && this.examId
        ? this.examsService.update(this.examId.toString(), this.examForm.value)
        : this.examsService.create(this.examForm.value);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Examen ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error al guardar examen', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.examForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/exams']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.examForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.getError('minlength').requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return `Valor mínimo: ${control.getError('min').min}`;
    }
    return '';
  }
}
