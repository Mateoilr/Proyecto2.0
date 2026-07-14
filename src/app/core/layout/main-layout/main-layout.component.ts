import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
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
export class MainLayoutComponent implements OnInit {
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
      label: 'Administración de usuarios',
      icon: 'admin_panel_settings',
      route: '/admin/users',
      roles: ['ADMINISTRADOR']
    },
    {
      label: 'Configuración del laboratorio',
      icon: 'settings',
      route: '/admin/settings',
      roles: ['ADMINISTRADOR']
    }
  ];

  isDarkMode = false;
  isMobile = false;

  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    this.breakpointObserver.observe(['(max-width: 960px)']).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  get currentUser() {
    return this.authService.getUser();
  }

  get userName(): string {
    const user = this.currentUser;
    return user ? user.nombres : '';
  }

  shouldShowMenuItem(item: MenuItem): boolean {
    const useRoleGuards = true;

    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    if (!useRoleGuards) {
      return true;
    }

    return item.roles.some(role => this.authService.hasRole(role));
  }

  logout(): void {
    this.authService.logout();
  }
}


