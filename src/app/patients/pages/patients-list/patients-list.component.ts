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
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-patients-list',
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
    MatPaginatorModule
  ],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit {
  displayedColumns: string[] = ['documento', 'nombre', 'edad', 'sexo', 'contacto', 'acciones'];

  patients = [
    { id: 1, documento: '12345678', nombre: 'Juan Pérez López', edad: 35, sexo: 'M', contacto: '555-1234', ultimaVisita: '2026-01-10' },
    { id: 2, documento: '87654321', nombre: 'María García Torres', edad: 28, sexo: 'F', contacto: '555-5678', ultimaVisita: '2026-01-12' },
    { id: 3, documento: '11223344', nombre: 'Pedro Martínez Ruiz', edad: 42, sexo: 'M', contacto: '555-9012', ultimaVisita: '2026-01-15' },
    { id: 4, documento: '55667788', nombre: 'Ana López Fernández', edad: 31, sexo: 'F', contacto: '555-3456', ultimaVisita: '2026-01-16' }
  ];

  ngOnInit(): void {}

  viewPatient(patient: any): void {
    console.log('Ver paciente:', patient);
  }

  editPatient(patient: any): void {
    console.log('Editar paciente:', patient);
  }

  createOrder(patient: any): void {
    console.log('Crear orden para:', patient);
  }
}
