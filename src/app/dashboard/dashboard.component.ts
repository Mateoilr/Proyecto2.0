import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  route?: string;
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

  stats: StatCard[] = [
    {
      title: 'Órdenes de Hoy',
      value: 0,
      icon: 'assignment',
      color: '#329d9c', 
      route: '/orders'
    },
    {
      title: 'Resultados Pendientes',
      value: 0,
      icon: 'pending_actions',
      color: '#F29C38', 
      route: '/results'
    },
    {
      title: 'Pacientes',
      value: 0,
      icon: 'people',
      color: '#4A90E2', 
      route: '/patients'
    },
    {
      title: 'Exámenes Activos',
      value: 0,
      icon: 'science',
      color: '#748799', 
      route: '/exams'
    }
  ];

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
    // TODO: Cargar estadísticas reales desde el backend
    this.loadStats();
  }

  loadStats(): void {
    // Simulación de datos - reemplazar con llamadas reales al backend
    // this.ordersService.getStats().subscribe(...)
  }

  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
