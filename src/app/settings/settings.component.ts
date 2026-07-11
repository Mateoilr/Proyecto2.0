import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from './services/settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);

  settingsForm: FormGroup = this.fb.group({
    nombreEmpresa: ['', Validators.required],
    direccion: [''],
    telefono: [''],
    correoRemitente: ['', Validators.email],
    sitioWeb: ['']
  });

  isLoading = true;
  isSaving = false;

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this.isLoading = true;
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        if (settings) {
          this.settingsForm.patchValue(settings);
        }
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error: No se pudo cargar la configuración', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.settingsForm.invalid) return;

    this.isSaving = true;
    this.settingsService.updateSettings(this.settingsForm.value).subscribe({
      next: () => {
        this.snackBar.open('Configuración actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.isSaving = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 3000 });
        this.isSaving = false;
      }
    });
  }
}
