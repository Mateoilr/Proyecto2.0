import { MenuItem } from './menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: ['ADMIN', 'MEDICO', 'LABORATORISTA', 'RECEPCIONISTA']
  },
  {
    label: 'Pacientes',
    icon: 'people',
    route: '/patients',
    roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA']
  },
  {
    label: 'Órdenes',
    icon: 'assignment',
    route: '/orders',
    roles: ['ADMIN', 'MEDICO', 'LABORATORISTA', 'RECEPCIONISTA']
  },
  {
    label: 'Resultados',
    icon: 'science',
    route: '/results',
    roles: ['ADMIN', 'MEDICO', 'LABORATORISTA']
  },
  {
    label: 'Reportes',
    icon: 'assessment',
    route: '/reports',
    roles: ['ADMIN', 'MEDICO']
  },
  {
    label: 'Administración',
    icon: 'manage_accounts',
    route: '/admin/users',
    roles: ['ADMIN']
  },
  {
    label: 'Configuración',
    icon: 'settings',
    route: '/admin/settings',
    roles: ['ADMIN']
  }
];
