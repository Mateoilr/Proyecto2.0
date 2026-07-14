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
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ExamsService, Exam, ExamReferenceRange, PredefinedValue } from '../../core/services/exams.service';
import { CatalogsService, CatalogItem } from '../../core/services/catalogs.service';
import { forkJoin } from 'rxjs';

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
    MatSnackBarModule,
    MatTableModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private examsService = inject(ExamsService);
  private catalogsService = inject(CatalogsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  examForm!: FormGroup;
  rangeForm!: FormGroup;
  valueForm!: FormGroup;

  loading = false;
  isEditMode = false;
  examId?: string;

  categorias: CatalogItem[] = [];
  tiposMuestra: CatalogItem[] = [];
  unidades: CatalogItem[] = [];
  tecnicas: CatalogItem[] = [];

  // Configuration items
  referenceRanges: ExamReferenceRange[] = [];
  predefinedValues: PredefinedValue[] = [];

  // Table columns
  rangeColumns: string[] = ['sexo', 'edades', 'valores', 'texto', 'actions'];

  ngOnInit(): void {
    this.initForm();
    this.initConfigForms();
    this.loadCatalogs();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.examId = id;
      this.loadExam(this.examId);
    }
  }

  initForm(): void {
    this.examForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      categoriaId: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      esCualitativo: [false],
      unidadId: [''],
      muestraId: [''],
      tecnicaId: [''],
      estado: ['ACTIVE']
    });
  }

  initConfigForms(): void {
    this.rangeForm = this.fb.group({
      sexo: [''],
      edadMin: [null, [Validators.min(0)]],
      edadMax: [null, [Validators.min(0)]],
      valorMin: [null],
      valorMax: [null],
      textoReferencia: ['']
    });

    this.valueForm = this.fb.group({
      valor: ['', Validators.required]
    });
  }

  loadCatalogs(): void {
    forkJoin({
      categorias: this.catalogsService.getCategories(),
      tiposMuestra: this.catalogsService.getSampleTypes(),
      unidades: this.catalogsService.getMeasurementUnits(),
      tecnicas: this.catalogsService.getTechniques()
    }).subscribe({
      next: (results) => {
        this.categorias = results.categorias;
        this.tiposMuestra = results.tiposMuestra;
        this.unidades = results.unidades;
        this.tecnicas = results.tecnicas;
      },
      error: () => {
        this.snackBar.open('Error al cargar catálogos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadExam(id: string): void {
    this.loading = true;
    this.examsService.getById(id).subscribe({
      next: (exam) => {
        this.examForm.patchValue({
          codigo: exam.codigo,
          nombre: exam.nombre,
          descripcion: exam.descripcion,
          categoriaId: exam.categoryId,
          precio: exam.precio,
          esCualitativo: exam.esCualitativo,
          unidadId: exam.unitId,
          muestraId: exam.sampleTypeId,
          tecnicaId: exam.tecnicaId,
          estado: exam.estado
        });
        
        this.referenceRanges = exam.referenceRanges || [];
        this.predefinedValues = exam.predefinedValues || [];
        
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

      const payload = { ...this.examForm.value };

      // Limpiar strings vacíos que causan errores de UUID o validación en el backend
      if (!payload.unidadId) delete payload.unidadId;
      if (!payload.muestraId) delete payload.muestraId;
      if (!payload.tecnicaId) delete payload.tecnicaId;
      if (!payload.descripcion) delete payload.descripcion;

      // El backend no espera el campo "estado" al crear (CreateExamDto no lo tiene)
      if (!this.isEditMode) {
        delete payload.estado;
      }

      const request = this.isEditMode && this.examId
        ? this.examsService.update(this.examId, payload)
        : this.examsService.create(payload);

      request.subscribe({
        next: (savedExam) => {
          this.snackBar.open(
            `Examen ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          
          if (!this.isEditMode) {
            // Si acabamos de crearlo, redirigimos a la vista de edición para que pueda configurar los valores de referencia.
            this.router.navigate(['/exams', savedExam.id, 'edit']);
          } else {
            this.router.navigate(['/exams']);
          }
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || error.message || 'Error al guardar examen', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.examForm);
    }
  }

  // ---- Reference Ranges Configuration ----

  onAddReferenceRange(): void {
    if (!this.examId || this.rangeForm.invalid) return;

    const values = this.rangeForm.value;
    // Basic validation
    if (values.valorMin == null && values.valorMax == null && !values.textoReferencia) {
      this.snackBar.open('Debe proveer valor Min/Max o un texto de referencia', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.examsService.addReferenceRange(this.examId, values).subscribe({
      next: (range) => {
        this.referenceRanges = [...this.referenceRanges, range];
        this.rangeForm.reset();
        this.snackBar.open('Rango agregado', 'Cerrar', { duration: 2000 });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al agregar rango', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onRemoveReferenceRange(rangeId: string): void {
    if (!this.examId) return;
    this.loading = true;
    this.examsService.removeReferenceRange(this.examId, rangeId).subscribe({
      next: () => {
        this.referenceRanges = this.referenceRanges.filter(r => r.id !== rangeId);
        this.snackBar.open('Rango eliminado', 'Cerrar', { duration: 2000 });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al eliminar rango', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  // ---- Predefined Values Configuration ----

  onAddPredefinedValue(): void {
    if (!this.examId || this.valueForm.invalid) return;
    this.loading = true;
    this.examsService.addPredefinedValue(this.examId, this.valueForm.value).subscribe({
      next: (val) => {
        this.predefinedValues = [...this.predefinedValues, val];
        this.valueForm.reset();
        this.snackBar.open('Valor agregado', 'Cerrar', { duration: 2000 });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al agregar valor', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onRemovePredefinedValue(valueId: string): void {
    if (!this.examId) return;
    this.loading = true;
    this.examsService.removePredefinedValue(this.examId, valueId).subscribe({
      next: () => {
        this.predefinedValues = this.predefinedValues.filter(v => v.id !== valueId);
        this.snackBar.open('Valor eliminado', 'Cerrar', { duration: 2000 });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Error al eliminar valor', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
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
