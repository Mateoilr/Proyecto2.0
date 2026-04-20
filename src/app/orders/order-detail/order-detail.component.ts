import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { OrdersService, LabOrder } from '../../core/services/orders.service';
import { ResultsService } from '../../core/services/results.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { EmailDialogComponent } from '../../shared/components/email-dialog.component';
import { WhatsAppDialogComponent } from '../../shared/components/whatsapp-dialog.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private resultsService = inject(ResultsService);
  private notificationsService = inject(NotificationsService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  order: LabOrder | null = null;
  loading = true;
  displayedColumns = ['examen', 'estado', 'muestra', 'resultado'];

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.ordersService.getById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar la orden', 'Cerrar', { duration: 3000 });
        console.error(error);
        this.router.navigate(['/orders']);
      }
    });
  }

  getEstadoColor(estado: string): string {
    const colors: Record<string, string> = {
      'CREADA': '#2196f3',
      'EN_PROCESO': '#ff9800',
      'COMPLETADA': '#4caf50',
      'CERRADA': '#9e9e9e',
      'CANCELADA': '#f44336'
    };
    return colors[estado] || '#666';
  }

  canSendNotifications(): boolean {
    return this.order?.estado === 'CERRADA';
  }

  getItemEstadoColor(estado: string): string {
    const colors: Record<string, string> = {
      'PENDIENTE': '#ff9800',
      'EN_PROCESO': '#2196f3',
      'COMPLETADO': '#4caf50',
      'CANCELADO': '#f44336'
    };
    return colors[estado] || '#666';
  }

  getPrioridadColor(prioridad: string): string {
    return prioridad === 'URGENTE' ? '#f44336' : '#4caf50';
  }

  getAge(fechaNacimiento: Date | string): number {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }

  onEdit(): void {
    if (this.order) {
      this.router.navigate(['/orders', this.order.id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.order) return;

    if (confirm('¿Está seguro de que desea eliminar esta orden?')) {
      this.ordersService.delete(this.order.id).subscribe({
        next: () => {
          this.snackBar.open('Orden eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar la orden', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  onRegisterResult(orderItemId: string): void {
    const valor = prompt('Ingrese el valor del resultado:');
    if (!valor) return;

    const unidad = prompt('Ingrese la unidad (opcional):');

    // Obtener el usuario actual
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.snackBar.open('Error: Usuario no autenticado', 'Cerrar', { duration: 3000 });
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      this.snackBar.open('Error: ID de usuario no válido', 'Cerrar', { duration: 3000 });
      return;
    }

    this.resultsService.create({
      orderItemId,
      valor,
      unidad: unidad || undefined,
      createdById: user.id
    }).subscribe({
      next: () => {
        this.snackBar.open('Resultado registrado exitosamente', 'Cerrar', { duration: 3000 });
        if (this.order) {
          this.loadOrder(this.order.id);
        }
      },
      error: (error: any) => {
        this.snackBar.open(error.error?.message || 'Error al registrar el resultado', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  onCloseOrder(): void {
    if (!this.order) return;

    if (confirm('¿Está seguro de que desea cerrar esta orden? Después de cerrarla podrá enviar las notificaciones.')) {
      this.ordersService.close(this.order.id).subscribe({
        next: (closedOrder) => {
          this.snackBar.open('Orden cerrada exitosamente', 'Cerrar', { duration: 3000 });
          this.order = closedOrder;
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Error al cerrar la orden',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    }
  }

  onSendEmail(): void {
    if (!this.order) return;

    if (!this.canSendNotifications()) {
      this.snackBar.open(
        'Solo se pueden enviar notificaciones de órdenes en estado CERRADA',
        'Cerrar',
        { duration: 5000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Orden por Email',
        defaultEmail: this.order.patient.contacto || ''
      }
    });

    dialogRef.afterClosed().subscribe(email => {
      if (email && this.order) {
        this.notificationsService.sendOrderByEmail(this.order.id, email).subscribe({
          next: (response) => {
            this.snackBar.open('Orden enviada por email exitosamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open(
              error.error?.message || 'Error al enviar el email',
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onSendWhatsApp(): void {
    if (!this.order) return;

    if (!this.canSendNotifications()) {
      this.snackBar.open(
        'Solo se pueden enviar notificaciones de órdenes en estado CERRADA',
        'Cerrar',
        { duration: 5000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(WhatsAppDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar Orden por WhatsApp',
        defaultPhone: this.order.patient.contacto || ''
      }
    });

    dialogRef.afterClosed().subscribe(phoneNumber => {
      if (phoneNumber && this.order) {
        this.notificationsService.sendOrderByWhatsApp(this.order.id, phoneNumber).subscribe({
          next: (response) => {
            this.snackBar.open('Orden enviada por WhatsApp exitosamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open(
              error.error?.message || 'Error al enviar por WhatsApp',
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
      }
    });
  }
}
