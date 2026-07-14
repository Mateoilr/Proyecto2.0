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
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon color="primary">fact_check</mat-icon> 
      Validar Resultado
    </h2>
    <mat-dialog-content>
      
      <div class="review-grid">
        <!-- Detalles Generales -->
        <div class="review-card">
          <div class="card-header">
            <mat-icon>person</mat-icon> Información del Paciente
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="lbl">Paciente:</span>
              <span class="val">{{ data.result.orderItem?.labOrder?.patient?.nombres }} {{ data.result.orderItem?.labOrder?.patient?.apellidos }}</span>
            </div>
            <div class="info-row">
              <span class="lbl">Orden:</span>
              <span class="val">
                <strong>{{ data.result.orderItem?.labOrder?.codigo }}</strong>
                <mat-chip class="small-chip" [style.background-color]="data.result.orderItem?.labOrder?.prioridad === 'URGENTE' ? '#e04a4a' : '#45b6b5'">
                  {{ data.result.orderItem?.labOrder?.prioridad }}
                </mat-chip>
              </span>
            </div>
            <div class="info-row">
              <span class="lbl">Registro:</span>
              <span class="val">{{ data.result.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>

        <!-- Detalles del Examen -->
        <div class="review-card">
          <div class="card-header">
            <mat-icon>science</mat-icon> Datos del Examen
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="lbl">Examen:</span>
              <span class="val">{{ data.result.orderItem?.exam?.nombre }} ({{ data.result.orderItem?.exam?.codigo }})</span>
            </div>
            <div class="info-row">
              <span class="lbl">Técnico:</span>
              <span class="val">{{ data.result.createdBy?.nombres }} {{ data.result.createdBy?.apellidos }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultado Final -->
      <div class="result-highlight">
        <div class="result-header">Resultado Registrado</div>
        <div class="result-value-container">
          <span class="result-value">{{ data.result.valor }}</span>
          <span class="result-unit" *ngIf="data.result.unidad">{{ data.result.unidad }}</span>
        </div>
        
        <div class="result-interpretation" *ngIf="data.result.interpretacion">
          <mat-icon [color]="data.result.interpretacion === 'NORMAL' ? 'primary' : 'warn'">analytics</mat-icon>
          <span><strong>Interpretación / Obs:</strong> {{ data.result.interpretacion }}</span>
        </div>
      </div>

      <!-- Zona de Rechazo (Opcional) -->
      <div class="reject-section" *ngIf="isRejecting">
        <h3 class="reject-title"><mat-icon>warning</mat-icon> Motivo de Rechazo</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Comentario de Rechazo</mat-label>
          <textarea matInput [(ngModel)]="rechazoComentario" rows="3" placeholder="Explique las inconsistencias encontradas..." required></textarea>
        </mat-form-field>
      </div>

    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onCancel()" [disabled]="loading">Cancelar</button>
      
      <ng-container *ngIf="!isRejecting">
        <button mat-stroked-button color="warn" (click)="toggleReject()" class="action-btn">
          <mat-icon>cancel</mat-icon> Rechazar
        </button>
        <button mat-raised-button color="primary" (click)="onValidate()" class="action-btn">
          <mat-icon>check_circle</mat-icon> Validar
        </button>
      </ng-container>

      <ng-container *ngIf="isRejecting">
        <button mat-raised-button color="warn" (click)="onConfirmReject()" [disabled]="!rechazoComentario.trim()" class="action-btn">
          <mat-icon>send</mat-icon> Confirmar Rechazo
        </button>
      </ng-container>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0;
      padding: 24px 24px 16px;
    }
    .review-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
      margin-top: 8px;
    }
    @media (max-width: 600px) {
      .review-grid { grid-template-columns: 1fr; }
    }
    .review-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .card-header {
      background: #f5f5f5;
      padding: 8px 12px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    .card-header mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #666;
    }
    .card-body {
      padding: 12px;
    }
    .info-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
    }
    .info-row:last-child { margin-bottom: 0; }
    .lbl {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }
    .val {
      font-size: 14px;
      color: #333;
      display: flex;
      align-items: center;
    }
    .small-chip {
      color: white !important;
      font-size: 10px;
      min-height: 20px;
      padding: 2px 8px;
      margin-left: 8px;
      border-radius: 12px;
    }
    .result-highlight {
      background: #f0f7ff;
      border: 1px solid #bbdefb;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .result-header {
      color: #1976d2;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 12px;
      margin-bottom: 12px;
    }
    .result-value-container {
      margin-bottom: 16px;
    }
    .result-value {
      font-size: 32px;
      font-weight: bold;
      color: #1565c0;
    }
    .result-unit {
      font-size: 16px;
      color: #1976d2;
      margin-left: 8px;
    }
    .result-interpretation {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      color: #333;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .reject-section {
      background: #fff5f5;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #f44336;
      margin-bottom: 16px;
    }
    .reject-title {
      color: #d32f2f;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 0;
      font-size: 16px;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 0 24px 24px !important;
    }
    .action-btn {
      margin-left: 8px !important;
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
