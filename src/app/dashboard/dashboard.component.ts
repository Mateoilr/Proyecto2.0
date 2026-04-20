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
      title: 'Órdenes Hoy',
      value: 0,
      icon: 'assignment',
      color: '#2196f3',
      route: '/orders'
    },
    {
      title: 'Resultados Pendientes',
      value: 0,
      icon: 'pending_actions',
      color: '#ff9800',
      route: '/results'
    },
    {
      title: 'Pacientes',
      value: 0,
      icon: 'people',
      color: '#4caf50',
      route: '/patients'
    },
    {
      title: 'Exámenes Activos',
      value: 0,
      icon: 'science',
      color: '#9c27b0',
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
