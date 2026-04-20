import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
  change?: number;
}

interface PendingTask {
  id: number;
  paciente: string;
  examen: string;
  prioridad: 'URGENTE' | 'NORMAL';
  estado: string;
  tiempo: string;
}

interface RecentActivity {
  accion: string;
  usuario: string;
  tiempo: string;
  tipo: 'success' | 'warning' | 'info';
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatBadgeModule
  ]
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  // Estadísticas principales
  stats: StatCard[] = [
    { label: 'Órdenes Hoy', value: 24, icon: 'assignment', color: 'primary', change: 12 },
    { label: 'En Proceso', value: 8, icon: 'pending_actions', color: 'accent', change: -3 },
    { label: 'Pendientes Validar', value: 5, icon: 'fact_check', color: 'warn', change: 2 },
    { label: 'Entregados', value: 15, icon: 'check_circle', color: 'success', change: 8 }
  ];

  // Distribución de estados
  ordersByStatus = [
    { estado: 'CREADA', cantidad: 3, porcentaje: 12 },
    { estado: 'EN_PROCESO', cantidad: 8, porcentaje: 33 },
    { estado: 'VALIDADO', cantidad: 5, porcentaje: 21 },
    { estado: 'ENTREGADO', cantidad: 8, porcentaje: 34 }
  ];

  // Exámenes más solicitados
  topExams = [
    { nombre: 'Hemograma Completo', cantidad: 15 },
    { nombre: 'Glucosa', cantidad: 12 },
    { nombre: 'Perfil Lipídico', cantidad: 10 },
    { nombre: 'Creatinina', cantidad: 8 },
    { nombre: 'TSH', cantidad: 6 }
  ];

  // Tareas pendientes
  pendingTasks: PendingTask[] = [
    { id: 1, paciente: 'Juan Pérez', examen: 'Hemograma', prioridad: 'URGENTE', estado: 'Muestra tomada', tiempo: 'Hace 30 min' },
    { id: 2, paciente: 'María García', examen: 'Glucosa', prioridad: 'NORMAL', estado: 'En análisis', tiempo: 'Hace 1h' },
    { id: 3, paciente: 'Pedro López', examen: 'TSH', prioridad: 'URGENTE', estado: 'Por validar', tiempo: 'Hace 15 min' },
    { id: 4, paciente: 'Ana Torres', examen: 'Perfil Lipídico', prioridad: 'NORMAL', estado: 'Muestra tomada', tiempo: 'Hace 2h' }
  ];

  // Actividad reciente
  recentActivities: RecentActivity[] = [
    { accion: 'Resultado validado: Hemograma - Juan Pérez', usuario: 'Dr. Ramírez', tiempo: 'Hace 5 min', tipo: 'success' },
    { accion: 'Nueva orden creada: María López', usuario: 'Recepción', tiempo: 'Hace 10 min', tipo: 'info' },
    { accion: 'Muestra tomada: Glucosa - Pedro Sánchez', usuario: 'Lab. García', tiempo: 'Hace 20 min', tipo: 'info' },
    { accion: 'Resultado rechazado: TSH - Ana Martínez', usuario: 'Dr. Flores', tiempo: 'Hace 35 min', tipo: 'warning' }
  ];

  // Accesos rápidos según rol
  quickActions: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.roles[0] || '';
      this.userName = user.nombres;
      this.loadQuickActions();
    }
  }

  loadQuickActions(): void {
    // Accesos rápidos según el rol del usuario
    if (this.userRole === 'ADMIN') {
      this.quickActions = [
        { label: 'Gestionar Usuarios', icon: 'group', route: '/admin/users' },
        { label: 'Configurar Exámenes', icon: 'settings', route: '/admin/exams' },
        { label: 'Ver Reportes', icon: 'assessment', route: '/reports' },
        { label: 'Auditoría', icon: 'history', route: '/admin/audit' }
      ];
    } else if (this.userRole === 'LABORATORISTA') {
      this.quickActions = [
        { label: 'Registrar Muestra', icon: 'science', route: '/orders' },
        { label: 'Capturar Resultados', icon: 'edit_note', route: '/results' },
        { label: 'Ver Órdenes', icon: 'assignment', route: '/orders' }
      ];
    } else if (this.userRole === 'MEDICO') {
      this.quickActions = [
        { label: 'Validar Resultados', icon: 'fact_check', route: '/results' },
        { label: 'Ver Pacientes', icon: 'people', route: '/patients' },
        { label: 'Reportes Clínicos', icon: 'description', route: '/reports' }
      ];
    } else if (this.userRole === 'RECEPCIONISTA') {
      this.quickActions = [
        { label: 'Registrar Paciente', icon: 'person_add', route: '/patients' },
        { label: 'Nueva Orden', icon: 'add_box', route: '/orders/new' },
        { label: 'Ver Órdenes', icon: 'assignment', route: '/orders' },
        { label: 'Entregar Resultados', icon: 'local_shipping', route: '/results' }
      ];
    }
  }

  getStatusColor(estado: string): string {
    const colors: any = {
      'CREADA': 'primary',
      'EN_PROCESO': 'accent',
      'VALIDADO': 'warn',
      'ENTREGADO': 'success'
    };
    return colors[estado] || 'primary';
  }

  getPriorityColor(prioridad: string): string {
    return prioridad === 'URGENTE' ? 'warn' : 'accent';
  }

  getActivityIcon(tipo: string): string {
    const icons: any = {
      'success': 'check_circle',
      'warning': 'warning',
      'info': 'info'
    };
    return icons[tipo] || 'info';
  }

  getPendingTasksRoute(): string {
    const routes: any = {
      'LABORATORISTA': '/orders?filter=in-process',
      'MEDICO': '/results?filter=pending-validation',
      'RECEPCIONISTA': '/orders?filter=ready-to-deliver',
      'ADMIN': '/orders'
    };
    return routes[this.userRole] || '/orders';
  }
}
