import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'paciente', 'examenes', 'estado', 'prioridad', 'fecha', 'acciones'];

  orders = [
    { id: 1, codigo: 'ORD-2026-001', paciente: 'Juan Pérez', examenes: 3, estado: 'EN_PROCESO', prioridad: 'NORMAL', fecha: '2026-01-16 08:30' },
    { id: 2, codigo: 'ORD-2026-002', paciente: 'María García', examenes: 2, estado: 'VALIDADO', prioridad: 'URGENTE', fecha: '2026-01-16 09:15' },
    { id: 3, codigo: 'ORD-2026-003', paciente: 'Pedro López', examenes: 5, estado: 'CREADA', prioridad: 'NORMAL', fecha: '2026-01-16 10:00' },
    { id: 4, codigo: 'ORD-2026-004', paciente: 'Ana Torres', examenes: 1, estado: 'ENTREGADO', prioridad: 'NORMAL', fecha: '2026-01-15 14:20' }
  ];

  ngOnInit(): void {}

  getStatusColor(estado: string): string {
    const colors: any = {
      'CREADA': 'accent',
      'EN_PROCESO': 'primary',
      'VALIDADO': 'warn',
      'ENTREGADO': ''
    };
    return colors[estado] || '';
  }

  getStatusLabel(estado: string): string {
    const labels: any = {
      'CREADA': 'Creada',
      'EN_PROCESO': 'En Proceso',
      'VALIDADO': 'Validado',
      'ENTREGADO': 'Entregado'
    };
    return labels[estado] || estado;
  }

  viewOrder(order: any): void {
    console.log('Ver orden:', order);
  }

  editOrder(order: any): void {
    console.log('Editar orden:', order);
  }
}
