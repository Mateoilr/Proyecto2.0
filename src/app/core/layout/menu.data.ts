import { MenuItem } from './menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['ADMINISTRADOR', 'VALIDADOR', 'LABORATORISTA', 'SECRETARIO']
  },
  {
    label: 'Pacientes',
    icon: 'people',
    route: '/patients',
    roles: ['ADMINISTRADOR', 'VALIDADOR', 'SECRETARIO']
  },
  {
    label: 'Órdenes',
    icon: 'assignment',
    route: '/orders',
    roles: ['ADMINISTRADOR', 'VALIDADOR', 'LABORATORISTA', 'SECRETARIO']
  },
  {
    label: 'Resultados',
    icon: 'science',
    route: '/results',
    roles: ['ADMINISTRADOR', 'VALIDADOR', 'LABORATORISTA']
  },
  {
    label: 'Reportes',
    icon: 'assessment',
    route: '/reports',
    roles: ['ADMINISTRADOR', 'VALIDADOR']
  },
  {
    label: 'Administración',
    icon: 'manage_accounts',
    route: '/admin/users',
    roles: ['ADMINISTRADOR']
  },
  {
    label: 'Configuración',
    icon: 'settings',
    route: '/admin/settings',
    roles: ['ADMINISTRADOR']
  }
];
