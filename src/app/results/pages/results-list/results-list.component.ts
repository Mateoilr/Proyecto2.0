import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MatBadgeModule
  ],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.css'
})
export class ResultsListComponent implements OnInit {
  displayedColumns: string[] = ['orden', 'paciente', 'examen', 'valor', 'estado', 'fecha', 'acciones'];

  pendingResults = [
    { id: 1, orden: 'ORD-001', paciente: 'Juan Pérez', examen: 'Hemograma', valor: '14.5 g/dL', estado: 'REGISTRADO', fecha: '2026-01-16 10:30' },
    { id: 2, orden: 'ORD-002', paciente: 'María García', examen: 'Glucosa', valor: '95 mg/dL', estado: 'REGISTRADO', fecha: '2026-01-16 11:00' }
  ];

  validatedResults = [
    { id: 3, orden: 'ORD-003', paciente: 'Pedro López', examen: 'TSH', valor: '2.5 mU/L', estado: 'VALIDADO', fecha: '2026-01-16 09:00' },
    { id: 4, orden: 'ORD-004', paciente: 'Ana Torres', examen: 'Creatinina', valor: '0.9 mg/dL', estado: 'VALIDADO', fecha: '2026-01-15 15:30' }
  ];

  ngOnInit(): void {}

  getStatusColor(estado: string): string {
    return estado === 'VALIDADO' ? '' : 'warn';
  }

  validateResult(result: any): void {
    console.log('Validar resultado:', result);
  }

  viewResult(result: any): void {
    console.log('Ver resultado:', result);
  }

  rejectResult(result: any): void {
    console.log('Rechazar resultado:', result);
  }
}
