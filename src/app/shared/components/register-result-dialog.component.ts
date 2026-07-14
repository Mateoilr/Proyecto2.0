import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RegisterResultDialogData {
  examName: string;
  valorGenerado?: string;
  observaciones?: string;
}

@Component({
  selector: 'app-register-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.valorGenerado ? 'Editar' : 'Registrar' }} Resultado</h2>
    <mat-dialog-content>
      <p style="margin-bottom: 20px; color: #666;">
        Ingrese el resultado para el examen: <strong>{{ data.examName }}</strong>
      </p>
      
      <mat-form-field appearance="outline" style="width: 100%; margin-bottom: 8px;">
        <mat-label>Valor del Resultado</mat-label>
        <input matInput [(ngModel)]="valorGenerado" placeholder="Ej. 120" required>
        <mat-icon matPrefix>science</mat-icon>
      </mat-form-field>
      
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Observaciones (Opcional)</mat-label>
        <textarea matInput [(ngModel)]="observaciones" rows="3" placeholder="Añadir comentarios..."></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!valorGenerado.trim()">
        Guardar Resultado
      </button>
    </mat-dialog-actions>
  `
})
export class RegisterResultDialogComponent {
  valorGenerado: string = '';
  observaciones: string = '';

  constructor(
    public dialogRef: MatDialogRef<RegisterResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegisterResultDialogData
  ) {
    if (data.valorGenerado) this.valorGenerado = data.valorGenerado;
    if (data.observaciones) this.observaciones = data.observaciones;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.valorGenerado.trim()) {
      this.dialogRef.close({
        valorGenerado: this.valorGenerado.trim(),
        observaciones: this.observaciones.trim() || undefined
      });
    }
  }
}
