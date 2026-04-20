import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  adminSections = [
    { title: 'Usuarios', icon: 'group', route: '/admin/users', description: 'Gestionar usuarios del sistema' },
    { title: 'Roles', icon: 'admin_panel_settings', route: '/admin/roles', description: 'Configurar roles y permisos' },
    { title: 'Exámenes', icon: 'biotech', route: '/admin/exams', description: 'Catálogo de exámenes' },
    { title: 'Rangos de Referencia', icon: 'tune', route: '/admin/ranges', description: 'Configurar rangos normales' },
    { title: 'Auditoría', icon: 'history', route: '/admin/audit', description: 'Logs y trazabilidad' },
    { title: 'Configuración', icon: 'settings', route: '/admin/settings', description: 'Configuración general' }
  ];
}
