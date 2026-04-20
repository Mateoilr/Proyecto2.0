import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationsService } from '../../core/services/notifications.service';

export interface WhatsAppDialogData {
  title: string;
  defaultPhone?: string;
}

@Component({
  selector: 'app-whatsapp-dialog',
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
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width: 100%">
        <mat-label>Número de WhatsApp</mat-label>
        <input matInput type="tel" [(ngModel)]="phoneNumber" placeholder="+593995492656">
        <mat-icon matPrefix>phone</mat-icon>
        <mat-hint>Formato: +593995492656 (incluir código de país)</mat-hint>
      </mat-form-field>
      <p class="help-text" *ngIf="!isValidPhone() && phoneNumber">
        ⚠️ El número debe incluir el código de país (+593 para Ecuador)
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!isValidPhone()">
        Enviar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .help-text {
      color: #f44336;
      font-size: 12px;
      margin-top: 8px;
    }
  `]
})
export class WhatsAppDialogComponent {
  phoneNumber: string = '';

  constructor(
    public dialogRef: MatDialogRef<WhatsAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WhatsAppDialogData,
    private notificationsService: NotificationsService
  ) {
    if (data.defaultPhone) {
      this.phoneNumber = this.notificationsService.formatPhoneNumber(data.defaultPhone);
    }
  }

  isValidPhone(): boolean {
    return this.notificationsService.validatePhoneNumber(this.phoneNumber);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.isValidPhone()) {
      this.dialogRef.close(this.phoneNumber);
    }
  }
}
