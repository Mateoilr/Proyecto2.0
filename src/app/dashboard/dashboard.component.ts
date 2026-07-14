import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { DashboardService } from '../core/services/dashboard.service';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  route?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  stats: StatCard[] = [];
  quickActions: QuickAction[] = [];
  recentActivity: any[] = [];

  get currentUser() {
    return this.authService.getUser();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  ngOnInit(): void {
    this.setupDashboardByRole();
  }

  setupDashboardByRole(): void {
    const roles = this.authService.getRoles();
    const isAdmin = roles.includes('ADMINISTRADOR');
    const isSecretario = roles.includes('SECRETARIO');
    const isLaboratorista = roles.includes('LABORATORISTA');
    const isValidador = roles.includes('VALIDADOR');

    if (isAdmin) {
      this.stats = [
        { title: 'Órdenes Hoy', value: 0, icon: 'assignment', color: '#329d9c', route: '/orders' },
        { title: 'Por Validar', value: 0, icon: 'fact_check', color: '#F29C38', route: '/results' },
        { title: 'Pacientes', value: 0, icon: 'people', color: '#4A90E2', route: '/patients' },
        { title: 'Exámenes Pend.', value: 0, icon: 'science', color: '#748799', route: '/orders' },
        { title: 'Exámenes Disp.', value: 0, icon: 'biotech', color: '#9C27B0', route: '/exams' }
      ];
      this.quickActions = [
        { title: 'Nueva Orden', description: 'Crear nueva orden', icon: 'add_task', color: '#329d9c', route: '/orders/new' },
        { title: 'Ver Órdenes', description: 'Consultar órdenes', icon: 'assignment', color: '#4A90E2', route: '/orders' },
        { title: 'Nuevo Paciente', description: 'Registrar paciente', icon: 'person_add', color: '#F29C38', route: '/patients/new' },
        { title: 'Ver Pacientes', description: 'Consultar pacientes', icon: 'people', color: '#9C27B0', route: '/patients' },
        { title: 'Ingresar Resultados', description: 'Registrar resultados', icon: 'biotech', color: '#E91E63', route: '/orders' },
        { title: 'Validar Resultados', description: 'Aprobar o rechazar', icon: 'fact_check', color: '#FF5722', route: '/results' },
        { title: 'Ver Usuarios', description: 'Gestión de sistema', icon: 'manage_accounts', color: '#3F51B5', route: '/admin/users' },
        { title: 'Auditoría', description: 'Log de actividades', icon: 'history', color: '#607D8B', route: '/admin/audit' },
        { title: 'Exámenes', description: 'Gestión de exámenes', icon: 'science', color: '#748799', route: '/exams' }
      ];
    } else if (isSecretario) {
      this.stats = [
        { title: 'Órdenes Hoy', value: 0, icon: 'assignment', color: '#329d9c', route: '/orders' },
        { title: 'Pacientes', value: 0, icon: 'people', color: '#4A90E2', route: '/patients' }
      ];
      this.quickActions = [
        { title: 'Nueva Orden', description: 'Crear una orden de exámenes', icon: 'add_task', color: '#329d9c', route: '/orders/new' },
        { title: 'Ver Órdenes', description: 'Consultar órdenes existentes', icon: 'assignment', color: '#4A90E2', route: '/orders' },
        { title: 'Nuevo Paciente', description: 'Registrar un paciente', icon: 'person_add', color: '#F29C38', route: '/patients/new' },
        { title: 'Ver Pacientes', description: 'Consultar pacientes', icon: 'people', color: '#9C27B0', route: '/patients' }
      ];
    } else if (isLaboratorista) {
      this.stats = [
        { title: 'Órdenes Hoy', value: 0, icon: 'assignment', color: '#329d9c', route: '/orders' },
        { title: 'Exámenes Pend.', value: 0, icon: 'pending_actions', color: '#F29C38', route: '/orders' }
      ];
      this.quickActions = [
        { title: 'Ver Órdenes', description: 'Consultar órdenes', icon: 'assignment', color: '#4A90E2', route: '/orders' },
        { title: 'Ingresar Resultados', description: 'Registrar análisis', icon: 'biotech', color: '#E91E63', route: '/orders' },
        { title: 'Ver Exámenes', description: 'Consultar catálogo', icon: 'science', color: '#748799', route: '/exams' }
      ];
    } else if (isValidador) {
      this.stats = [
        { title: 'Por Validar', value: 0, icon: 'fact_check', color: '#F29C38', route: '/results' },
        { title: 'Órdenes Hoy', value: 0, icon: 'assignment', color: '#329d9c', route: '/orders' }
      ];
      this.quickActions = [
        { title: 'Validar Resultados', description: 'Aprobar o rechazar', icon: 'fact_check', color: '#FF5722', route: '/results' },
        { title: 'Ver Órdenes', description: 'Consultar órdenes', icon: 'assignment', color: '#4A90E2', route: '/orders' },
        { title: 'Ver Pacientes', description: 'Consultar pacientes', icon: 'people', color: '#9C27B0', route: '/patients' }
      ];
    }

    // 2. Cargar datos reales usando el nuevo endpoint
    this.loadRealStats(isAdmin, isSecretario, isLaboratorista, isValidador);
  }

  private loadRealStats(isAdmin: boolean, isSecretario: boolean, isLaboratorista: boolean, isValidador: boolean): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        if (isAdmin) {
          this.updateStat('Órdenes Hoy', data.ordersToday || 0);
          this.updateStat('Por Validar', data.pendingValidations || 0);
          this.updateStat('Pacientes', data.registeredPatients || 0);
          this.updateStat('Exámenes Pend.', data.pendingOrderItems || 0);
          this.updateStat('Exámenes Disp.', data.activeExams || 0);
        }
        
        if (isSecretario) {
          this.updateStat('Órdenes Hoy', data.ordersToday || 0);
          this.updateStat('Pacientes', data.registeredPatients || 0);
        }
        
        if (isLaboratorista) {
          this.updateStat('Órdenes Hoy', data.ordersToday || 0);
          this.updateStat('Exámenes Pend.', data.pendingOrderItems || 0);
        }
        
        if (isValidador) {
          this.updateStat('Por Validar', data.pendingValidations || 0);
          this.updateStat('Órdenes Hoy', data.ordersToday || 0);
        }

        if (data.recentActivity) {
          this.recentActivity = data.recentActivity;
        }
      },
      error: (error) => {
        // console.error('Error fetching dashboard stats:', error);
      }
    });
  }

  private updateStat(title: string, value: number) {
    const stat = this.stats.find(s => s.title === title);
    if (stat) {
      stat.value = value;
    }
  }

  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  translateEntity(entity: string): string {
    const translations: { [key: string]: string } = {
      'LabOrder': 'Orden de Laboratorio',
      'Patient': 'Paciente',
      'Result': 'Resultado',
      'User': 'Usuario',
      'Exam': 'Examen',
      'OrderItem': 'Muestra/Prueba'
    };
    return translations[entity] || entity;
  }
}

