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

import { ResultsService, CreateResultDto, Result } from '../../core/services/results.service';

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
      unidad: [{ value: '', disabled: true }],
      valorMin: [{ value: '', disabled: true }],
      valorMax: [{ value: '', disabled: true }],
      interpretacion: [{ value: '', disabled: true }]
    });
  }

  loadResult(id: string): void {
    this.loading = true;
    this.resultsService.getById(id).subscribe({
      next: (result) => {
        this.result = result;
        
        let min = '';
        let max = '';
        let unit = '';
        
        if (result.orderItem?.exam) {
           unit = (result.orderItem.exam as any).unit?.simbolo || '';
           const ranges = (result.orderItem.exam as any).referenceRanges || [];
           if (ranges.length > 0) {
             min = ranges[0].valorMin ?? '';
             max = ranges[0].valorMax ?? '';
           }
        }

        this.resultForm.patchValue({
          valor: result.valor,
          unidad: unit,
          valorMin: min,
          valorMax: max,
          interpretacion: result.interpretacion || ''
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.snackBar.open('Error al cargar el resultado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/results']);
      }
    });
  }

  onSubmit(): void {
    if (this.resultForm.invalid) {
      this.snackBar.open('Complete los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.isEditMode && this.resultId) {
      this.loading = true;
      const updateDto = {
        valorGenerado: this.resultForm.get('valor')?.value
      };
      
      this.resultsService.update(this.resultId, updateDto).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Resultado actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/results']);
        },
        error: (error: any) => {
          this.loading = false;
          this.snackBar.open(error.error?.message || 'Error al actualizar resultado', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('La creación directa de resultados no está permitida', 'Cerrar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.router.navigate(['/results']);
  }
}

