import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.css'
})
export class ReportsListComponent {
  reports = [
    { title: 'Resumen Diario', description: 'Órdenes y resultados del día', icon: 'today' },
    { title: 'Producción Mensual', description: 'Estadísticas del mes', icon: 'calendar_month' },
    { title: 'Exámenes por Tipo', description: 'Distribución de exámenes', icon: 'pie_chart' },
    { title: 'Tiempos de Entrega', description: 'Análisis de rendimiento', icon: 'schedule' }
  ];
}
