import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReportsService } from '../../core/services/reports.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { EmailDialogComponent } from './email-dialog.component';
import { WhatsAppDialogComponent } from './whatsapp-dialog.component';

@Component({
  selector: 'app-order-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="actions-container">
      <button mat-raised-button color="primary"
              [disabled]="loading"
              (click)="downloadOrdenPeticion()">
        <mat-icon>print</mat-icon>
        Hoja de Petición
      </button>

      <button mat-raised-button
              [disabled]="loading || !hasResults"
              (click)="downloadReporteCompleto()">
        <mat-icon>description</mat-icon>
        Reporte Completo
      </button>

      <button mat-button [matMenuTriggerFor]="emailMenu"
              [disabled]="loading">
        <mat-icon>email</mat-icon>
        Enviar por Email
      </button>

      <button mat-button [matMenuTriggerFor]="whatsappMenu"
              [disabled]="loading">
        <mat-icon>chat</mat-icon>
        Enviar por WhatsApp
      </button>

      <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
    </div>

    <!-- Menú Email -->
    <mat-menu #emailMenu="matMenu">
      <button mat-menu-item (click)="sendOrdenByEmail()">
        <mat-icon>receipt</mat-icon>
        <span>Enviar Orden</span>
      </button>
      <button mat-menu-item (click)="sendResultsByEmail()" [disabled]="!hasResults">
        <mat-icon>science</mat-icon>
        <span>Enviar Resultados</span>
      </button>
    </mat-menu>

    <!-- Menú WhatsApp -->
    <mat-menu #whatsappMenu="matMenu">
      <button mat-menu-item (click)="sendOrdenByWhatsApp()">
        <mat-icon>receipt</mat-icon>
        <span>Enviar Orden</span>
      </button>
      <button mat-menu-item (click)="sendResultsByWhatsApp()" [disabled]="!hasResults">
        <mat-icon>science</mat-icon>
        <span>Enviar Resultados</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .actions-container {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
  `]
})
export class OrderActionsComponent {
  @Input() orderId!: string;
  @Input() orderCode!: string;
  @Input() patientEmail?: string;
  @Input() patientPhone?: string;
  @Input() hasResults: boolean = false;

  loading = false;

  constructor(
    private reportsService: ReportsService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // ============ DESCARGAS PDF ============

  downloadOrdenPeticion(): void {
    this.loading = true;
    this.reportsService.downloadOrdenPeticion(this.orderId).subscribe({
      next: (blob) => {
        this.reportsService.downloadFile(blob, `orden-peticion-${this.orderCode}.pdf`);
        this.showSuccess('Hoja de petición descargada');
      },
      error: (err) => {
        console.error('Error al descargar:', err);
        this.showError('Error al descargar la hoja de petición');
      },
      complete: () => this.loading = false
    });
  }

  downloadReporteCompleto(): void {
    this.loading = true;
    this.reportsService.downloadReporteOrden(this.orderId).subscribe({
      next: (blob) => {
        this.reportsService.downloadFile(blob, `reporte-completo-${this.orderCode}.pdf`);
        this.showSuccess('Reporte completo descargado');
      },
      error: (err) => {
        console.error('Error al descargar:', err);
        this.showError('Error al descargar el reporte');
      },
      complete: () => this.loading = false
    });
  }

  // ============ ENVÍO POR EMAIL ============

  sendOrdenByEmail(): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Orden por Email',
        defaultEmail: this.patientEmail
      }
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email) {
        this.loading = true;
        this.notificationsService.sendOrderByEmail(this.orderId, email).subscribe({
          next: () => this.showSuccess(`Orden enviada a ${email}`),
          error: (err) => {
            console.error('Error al enviar:', err);
            this.showError('Error al enviar el email');
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  sendResultsByEmail(): void {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Resultados por Email',
        defaultEmail: this.patientEmail
      }
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email) {
        this.loading = true;
        // Aquí asumimos que envías la orden completa con resultados
        this.notificationsService.sendOrderByEmail(this.orderId, email).subscribe({
          next: () => this.showSuccess(`Resultados enviados a ${email}`),
          error: (err) => {
            console.error('Error al enviar:', err);
            this.showError('Error al enviar el email');
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  // ============ ENVÍO POR WHATSAPP ============

  sendOrdenByWhatsApp(): void {
    const dialogRef = this.dialog.open(WhatsAppDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Orden por WhatsApp',
        defaultPhone: this.patientPhone
      }
    });

    dialogRef.afterClosed().subscribe(phone => {
      if (phone) {
        this.loading = true;
        this.notificationsService.sendOrderByWhatsApp(this.orderId, phone).subscribe({
          next: () => this.showSuccess(`Orden enviada a ${phone}`),
          error: (err) => {
            console.error('Error al enviar:', err);
            this.showError('Error al enviar por WhatsApp');
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  sendResultsByWhatsApp(): void {
    const dialogRef = this.dialog.open(WhatsAppDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Resultados por WhatsApp',
        defaultPhone: this.patientPhone
      }
    });

    dialogRef.afterClosed().subscribe(phone => {
      if (phone) {
        this.loading = true;
        this.notificationsService.sendOrderByWhatsApp(this.orderId, phone).subscribe({
          next: () => this.showSuccess(`Resultados enviados a ${phone}`),
          error: (err) => {
            console.error('Error al enviar:', err);
            this.showError('Error al enviar por WhatsApp');
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  // ============ HELPERS ============

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
