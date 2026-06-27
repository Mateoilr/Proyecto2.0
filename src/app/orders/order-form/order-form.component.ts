import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, startWith, map, debounceTime, switchMap } from 'rxjs';

import { OrdersService, CreateOrderDto } from '../../core/services/orders.service';
import { PatientsService, Patient } from '../../core/services/patients.service';
import { ExamsService, Exam } from '../../core/services/exams.service';

@Component({
  selector: 'app-order-form',
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
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);
  private patientsService = inject(PatientsService);
  private examsService = inject(ExamsService);
  private snackBar = inject(MatSnackBar);

  orderForm!: FormGroup;
  filteredPatients$!: Observable<Patient[]>;
  availableExams: Exam[] = [];
  selectedExams: Exam[] = [];
  loading = false;
  isEditMode = false;
  orderId?: string;
  orderStatus?: string;

  ngOnInit(): void {
    this.initForm();
    this.setupPatientAutocomplete();

    this.orderId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.orderId;

    if (this.isEditMode && this.orderId) {
      this.loadOrderForEdit(this.orderId);
    } else {
      this.loadExams();
    }
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      patientSearch: ['', Validators.required],
      patientId: ['', Validators.required],
      prioridad: ['NORMAL', Validators.required],
      observaciones: [''],
      examIds: this.fb.array([], Validators.required)
    });
  }

  get examIdsArray(): FormArray {
    return this.orderForm.get('examIds') as FormArray;
  }

  setupPatientAutocomplete(): void {
    this.filteredPatients$ = this.orderForm.get('patientSearch')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        const searchTerm = typeof value === 'string' ? value : '';
        if (searchTerm.length < 2) {
          return [];
        }
        return this.patientsService.getAll({ search: searchTerm, limit: 10 });
      })
    );
  }

  displayPatient(patient: Patient | null): string {
    return patient ? `${patient.nombres} ${patient.apellidos} - ${patient.documento}` : '';
  }

  onPatientSelected(patient: Patient): void {
    if (this.isEditMode) return;
    this.orderForm.patchValue({
      patientId: patient.id
    });
  }

  loadExams(): void {
    this.loading = true;
    this.examsService.getAll().subscribe({
      next: (exams) => {
        this.availableExams = exams.filter(exam => exam.estado === 'ACTIVE');
        this.loading = false;
        if (this.availableExams.length === 0) {
          this.snackBar.open('No hay exámenes activos disponibles', 'Cerrar', { duration: 5000 });
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open(
          error.error?.message || 'Error al cargar exámenes. Verifique que el backend esté corriendo',
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  loadOrderForEdit(id: string): void {
    this.loading = true;
    this.ordersService.getById(id).subscribe({
      next: (order) => {
        this.orderStatus = order.estado;
        
        // Disable non-editable fields
        this.orderForm.get('patientSearch')?.disable();
        this.orderForm.get('patientId')?.disable();
        
        // Patch editable fields
        this.orderForm.patchValue({
          patientSearch: order.patient,
          patientId: order.patientId,
          prioridad: order.prioridad,
          observaciones: order.observaciones
        });

        // Set selected exams purely for visual representation (we won't submit them)
        this.availableExams = order.items.map(item => item.exam);
        order.items.forEach(item => {
          this.selectedExams.push(item.exam);
          this.examIdsArray.push(this.fb.control(item.exam.id));
        });
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar la orden para edición', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/orders']);
      }
    });
  }

  isExamSelected(exam: Exam): boolean {
    return this.selectedExams.some(e => e.id === exam.id);
  }

  toggleExam(exam: Exam): void {
    if (this.isEditMode) return; // Prevent changing exams in edit mode

    const index = this.selectedExams.findIndex(e => e.id === exam.id);

    if (index >= 0) {
      this.selectedExams.splice(index, 1);
      this.examIdsArray.removeAt(index);
    } else {
      this.selectedExams.push(exam);
      this.examIdsArray.push(this.fb.control(exam.id));
    }
  }

  removeExam(exam: Exam): void {
    if (this.isEditMode) return; // Prevent changing exams in edit mode
    
    const index = this.selectedExams.findIndex(e => e.id === exam.id);
    if (index >= 0) {
      this.selectedExams.splice(index, 1);
      this.examIdsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid && !this.isEditMode) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.selectedExams.length === 0 && !this.isEditMode) {
      this.snackBar.open('Debe seleccionar al menos un examen', 'Cerrar', { duration: 3000 });
      return;
    }

    // Obtener el usuario actual del localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.snackBar.open('Error: Usuario no autenticado', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      this.snackBar.open('Error: ID de usuario no válido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.orderId) {
      const updateDto = {
        prioridad: this.orderForm.get('prioridad')?.value,
        observaciones: this.orderForm.get('observaciones')?.value
      };

      this.ordersService.update(this.orderId, updateDto).subscribe({
        next: (order) => {
          this.snackBar.open('Orden actualizada exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar la orden', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      const createDto: CreateOrderDto = {
        patientId: this.orderForm.get('patientId')?.value,
        prioridad: this.orderForm.get('prioridad')?.value,
        observaciones: this.orderForm.get('observaciones')?.value || undefined,
        examIds: this.selectedExams.map(exam => exam.id)
      };

      this.ordersService.create(createDto).subscribe({
        next: (order) => {
          this.snackBar.open('Orden creada exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al crear la orden', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.orderId) {
      this.router.navigate(['/orders', this.orderId]);
    } else {
      this.router.navigate(['/orders']);
    }
  }
}
