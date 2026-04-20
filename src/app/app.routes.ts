import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Auth
import { LoginComponent } from './auth/login/login.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Patients
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { PatientFormComponent } from './patients/patient-form/patient-form.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';

// Exams
import { ExamListComponent } from './exams/exam-list/exam-list.component';
import { ExamFormComponent } from './exams/exam-form/exam-form.component';

// Orders
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderFormComponent } from './orders/order-form/order-form.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';

// Results
import { ResultListComponent } from './results/result-list/result-list.component';
import { ResultFormComponent } from './results/result-form/result-form.component';

// Admin
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { AuditLogComponent } from './admin/audit-log/audit-log.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // RUTAS PÚBLICAS
  {
    path: 'login',
    component: LoginComponent
  },

  // RUTAS PROTEGIDAS CON LAYOUT
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      // Pacientes - Acceso para todos los roles autenticados
      {
        path: 'patients',
        children: [
          { path: '', component: PatientListComponent },
          { path: 'new', component: PatientFormComponent },
          { path: ':id', component: PatientDetailComponent },
          { path: ':id/edit', component: PatientFormComponent }
        ]
      },

      // Exámenes - Solo ADMINISTRADOR y RECEPCION
      {
        path: 'exams',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR', 'RECEPCION'] },
        children: [
          { path: '', component: ExamListComponent },
          { path: 'new', component: ExamFormComponent },
          { path: ':id/edit', component: ExamFormComponent }
        ]
      },

      // Órdenes - Acceso para todos los roles autenticados
      {
        path: 'orders',
        children: [
          { path: '', component: OrderListComponent },
          { path: 'new', component: OrderFormComponent },
          { path: ':id', component: OrderDetailComponent },
          { path: ':id/edit', component: OrderFormComponent }
        ]
      },

      // Resultados - ADMINISTRADOR, LABORATORISTA, MEDICO, VALIDADOR
      {
        path: 'results',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR', 'LABORATORISTA', 'MEDICO', 'VALIDADOR'] },
        children: [
          { path: '', component: ResultListComponent },
          { path: ':id/edit', component: ResultFormComponent }
        ]
      },

      // Admin - Solo ADMINISTRADOR
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'users', component: UserListComponent },
          { path: 'users/new', component: UserFormComponent },
          { path: 'users/:id/edit', component: UserFormComponent },
          { path: 'audit', component: AuditLogComponent }
        ]
      }
    ]
  },

  // REDIRECCIÓN FINAL
  {
    path: '**',
    redirectTo: '/patients'
  }
];
