import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ResultsService, CreateResultDto, UpdateResultDto, Result } from '../../core/services/results.service';

@Component({
  selector: 'app-result-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.css']
})
export class ResultFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private resultsService = inject(ResultsService);
  private snackBar = inject(MatSnackBar);

  resultForm!: FormGroup;
  loading = false;
  isEditMode = false;
  resultId: string | null = null;
  result: Result | null = null;

  ngOnInit(): void {
    this.resultId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.resultId;

    this.initForm();

    if (this.isEditMode && this.resultId) {
      this.loadResult(this.resultId);
    }
  }

  initForm(): void {
    this.resultForm = this.fb.group({
      valor: ['', Validators.required],
      unidad: [''],
      valorMin: [''],
      valorMax: [''],
      interpretacion: ['']
    });
  }

  loadResult(id: string): void {
    this.loading = true;
    this.resultsService.getById(id).subscribe({
      next: (result) => {
        this.result = result;
        this.resultForm.patchValue({
          valor: result.valor,
          unidad: result.unidad || '',
          valorMin: result.valorMin || '',
          valorMax: result.valorMax || '',
          interpretacion: result.interpretacion || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar el resultado', 'Cerrar', { duration: 3000 });
        console.error(error);
        this.router.navigate(['/results']);
      }
    });
  }

  onSubmit(): void {
    if (this.resultForm.invalid) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;

    const formValue = this.resultForm.value;
    const data: UpdateResultDto = {
      valor: formValue.valor,
      unidad: formValue.unidad || undefined,
      valorMin: formValue.valorMin ? Number(formValue.valorMin) : undefined,
      valorMax: formValue.valorMax ? Number(formValue.valorMax) : undefined,
      interpretacion: formValue.interpretacion || undefined
    };

    if (this.isEditMode && this.resultId) {
      this.resultsService.update(this.resultId, data).subscribe({
        next: () => {
          this.snackBar.open('Resultado actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/results']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar el resultado', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/results']);
  }
}
