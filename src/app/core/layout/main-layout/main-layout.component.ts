import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Pacientes',
      icon: 'people',
      route: '/patients'
    },
    {
      label: 'Exámenes',
      icon: 'science',
      route: '/exams',
      roles: ['ADMINISTRADOR', 'RECEPCION']
    },
    {
      label: 'Órdenes',
      icon: 'assignment',
      route: '/orders'
    },
    {
      label: 'Resultados',
      icon: 'assignment_turned_in',
      route: '/results',
      roles: ['ADMINISTRADOR', 'LABORATORISTA', 'MEDICO', 'VALIDADOR']
    },
    {
      label: 'Administración',
      icon: 'admin_panel_settings',
      route: '/admin',
      roles: ['ADMINISTRADOR']
    }
  ];

  get currentUser() {
    return this.authService.getUser();
  }

  get userName(): string {
    const user = this.currentUser;
    return user ? user.nombres : '';
  }

  shouldShowMenuItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.some(role => this.authService.hasRole(role));
  }

  logout(): void {
    this.authService.logout();
  }
}


