import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrdersService, LabOrder } from '../../core/services/orders.service';
import { ReportsService } from '../../core/services/reports.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private notificationsService = inject(NotificationsService);
  private reportsService = inject(ReportsService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'codigoOrden', 'paciente', 'fecha', 'estado', 'totalExamenes', 'actions'];
  dataSource = new MatTableDataSource<LabOrder>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    this.loading = true;
    this.ordersService.getAll().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar órdenes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewOrder(order: LabOrder): void {
    this.router.navigate(['/orders', order.id]);
  }

  createOrder(): void {
    this.router.navigate(['/orders/new']);
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      'CREADA': 'estado-creada',
      'EN_PROCESO': 'estado-en-proceso',
      'COMPLETADA': 'estado-completada',
      'CERRADA': 'estado-cerrada',
      'CANCELADA': 'estado-cancelada'
    };
    return classes[estado] || '';
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'CREADA': 'Creada',
      'EN_PROCESO': 'En Proceso',
      'COMPLETADA': 'Completada',
      'CERRADA': 'Cerrada',
      'CANCELADA': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  getPacienteNombre(order: LabOrder): string {
    return `${order.patient?.nombres || ''} ${order.patient?.apellidos || ''}`.trim();
  }

  sendWhatsApp(order: LabOrder, event: Event): void {
    event.stopPropagation();
    
    // Only allow if order has a patient with a phone number
    const phone = order.patient?.contacto;
    if (!phone) {
      this.snackBar.open('El paciente no tiene un número de contacto registrado', 'Cerrar', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Enviar por WhatsApp',
        message: `Â¿Desea enviar los resultados por WhatsApp al número ${phone}?`,
        confirmText: 'Enviar',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Enviando WhatsApp...', '', { duration: 2000 });
        const formattedPhone = this.notificationsService.formatPhoneNumber(phone);
        this.notificationsService.sendOrderByWhatsApp(order.id, formattedPhone).subscribe({
          next: (response: any) => {
            if (response.url) {
              window.open(response.url, '_blank');
              this.snackBar.open('Abriendo WhatsApp...', 'Cerrar', { duration: 3000 });
            } else {
              this.snackBar.open('WhatsApp enviado exitosamente', 'Cerrar', { duration: 3000 });
            }
          },
          error: (error) => {
            // console.error(error);
            this.snackBar.open(error.error?.message || 'Error al enviar WhatsApp', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  printOrder(order: LabOrder, event: Event): void {
    event.stopPropagation();
    this.snackBar.open('Generando reporte PDF...', '', { duration: 2000 });
    this.reportsService.downloadReporteOrden(order.id).subscribe({
      next: (blob) => {
        this.reportsService.downloadFile(blob, `Resultados_${order.codigo}.pdf`);
        this.snackBar.open('Reporte descargado', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al generar el reporte', 'Cerrar', { duration: 3000 });
      }
    });
  }
}

