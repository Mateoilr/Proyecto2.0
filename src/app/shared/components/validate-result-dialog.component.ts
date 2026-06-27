import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Result } from '../../core/services/results.service';

export interface ValidateResultDialogData {
  result: Result;
}

@Component({
  selector: 'app-validate-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title>Revisar Resultado</h2>
    <mat-dialog-content>
      <!-- Detalles Generales -->
      <div class="review-section">
        <h3>Información del Paciente y Orden</h3>
        <p><strong>Paciente:</strong> {{ data.result.orderItem?.labOrder?.patient?.nombres }} {{ data.result.orderItem?.labOrder?.patient?.apellidos }}</p>
        <p><strong>Orden Médica:</strong> {{ data.result.orderItem?.labOrder?.codigo }} 
           <mat-chip class="small-chip" [style.background-color]="data.result.orderItem?.labOrder?.prioridad === 'URGENTE' ? '#f44336' : '#4caf50'">
             {{ data.result.orderItem?.labOrder?.prioridad }}
           </mat-chip>
        </p>
        <p><strong>Fecha Registro:</strong> {{ data.result.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
      </div>

      <mat-divider></mat-divider>

      <!-- Detalles del Examen -->
      <div class="review-section">
        <h3>Detalles del Examen</h3>
        <p><strong>Examen:</strong> {{ data.result.orderItem?.exam?.nombre }} ({{ data.result.orderItem?.exam?.codigo }})</p>
        
        <div class="result-box">
          <div class="result-value">
            <span class="label">Valor Ingresado:</span>
            <span class="value">{{ data.result.valor }}</span>
          </div>
          <!-- TODO: Backend will implement Reference Ranges in the future. We'll use ngIf here when ready -->
          <div class="result-ranges">
            <mat-icon color="accent" style="vertical-align: middle; margin-right: 4px;">info</mat-icon>
            <span style="font-size: 12px; color: #666;">Los rangos de referencia estarán disponibles en la próxima actualización del servidor.</span>
          </div>
        </div>

        <p *ngIf="data.result.interpretacion">
          <strong>Observaciones del Técnico:</strong><br/>
          {{ data.result.interpretacion }}
        </p>
      </div>

      <mat-divider></mat-divider>

      <!-- Zona de Rechazo (Opcional) -->
      <div class="review-section" *ngIf="isRejecting">
        <h3 style="color: #f44336;">Motivo de Rechazo</h3>
        <mat-form-field appearance="outline" style="width: 100%">
          <mat-label>Comentario de Rechazo</mat-label>
          <textarea matInput [(ngModel)]="rechazoComentario" rows="3" placeholder="Explique las inconsistencias encontradas..." required></textarea>
        </mat-form-field>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding-bottom: 20px; padding-right: 24px;">
      <button mat-button (click)="onCancel()" [disabled]="loading">Cancelar</button>
      
      <ng-container *ngIf="!isRejecting">
        <button mat-stroked-button color="warn" (click)="toggleReject()" style="margin-right: 8px;">
          <mat-icon>cancel</mat-icon>
          Rechazar Resultado
        </button>
        <button mat-raised-button color="primary" (click)="onValidate()">
          <mat-icon>check_circle</mat-icon>
          Validar Resultado
        </button>
      </ng-container>

      <ng-container *ngIf="isRejecting">
        <button mat-raised-button color="warn" (click)="onConfirmReject()" [disabled]="!rechazoComentario.trim()">
          <mat-icon>send</mat-icon>
          Confirmar Rechazo
        </button>
      </ng-container>

    </mat-dialog-actions>
  `,
  styles: [`
    .review-section {
      margin: 16px 0;
    }
    .review-section h3 {
      margin-bottom: 8px;
      font-size: 16px;
      color: #333;
    }
    .review-section p {
      margin: 4px 0;
      color: #555;
    }
    .small-chip {
      color: white !important;
      font-size: 10px;
      min-height: 20px;
      padding: 2px 6px;
      margin-left: 8px;
    }
    .result-box {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
      border-left: 4px solid #2196f3;
    }
    .result-value {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .result-value .label {
      font-weight: 500;
      color: #333;
      margin-right: 8px;
    }
    .result-value .value {
      font-weight: bold;
      color: #2196f3;
    }
    .result-ranges {
      display: flex;
      align-items: center;
      background: #e3f2fd;
      padding: 6px 10px;
      border-radius: 4px;
    }
  `]
})
export class ValidateResultDialogComponent {
  isRejecting = false;
  rechazoComentario = '';
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ValidateResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ValidateResultDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  toggleReject(): void {
    this.isRejecting = true;
  }

  onValidate(): void {
    this.loading = true;
    this.dialogRef.close({ action: 'validate' });
  }

  onConfirmReject(): void {
    if (this.rechazoComentario.trim()) {
      this.loading = true;
      this.dialogRef.close({ 
        action: 'reject', 
        comentario: this.rechazoComentario.trim() 
      });
    }
  }
}
