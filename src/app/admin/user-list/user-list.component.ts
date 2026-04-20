import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { UsersService, User } from '../../core/services/users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  users: User[] = [];
  loading = true;
  displayedColumns = ['nombre', 'email', 'roles', 'estado', 'acciones'];

  searchControl = new FormControl('');
  statusControl = new FormControl('');

  ngOnInit(): void {
    this.loadUsers();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.loadUsers();
    });

    this.statusControl.valueChanges.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.loading = true;
    const params: any = {};

    if (this.searchControl.value) {
      params.search = this.searchControl.value;
    }

    if (this.statusControl.value) {
      params.status = this.statusControl.value;
    }

    this.usersService.getAll(params).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  getEstadoColor(estado: string): string {
    return estado === 'ACTIVE' ? '#4caf50' : '#f44336';
  }

  getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      'ADMINISTRADOR': '#9c27b0',
      'RECEPCION': '#2196f3',
      'LABORATORISTA': '#ff9800',
      'MEDICO': '#4caf50',
      'VALIDADOR': '#00bcd4'
    };
    return colors[role] || '#666';
  }

  onCreate(): void {
    this.router.navigate(['/admin/users/new']);
  }

  onEdit(user: User): void {
    this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  onToggleStatus(user: User): void {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'activar' : 'desactivar';

    if (confirm(`¿Está seguro de que desea ${action} este usuario?`)) {
      this.usersService.update(user.id, { status: newStatus }).subscribe({
        next: () => {
          this.snackBar.open(`Usuario ${action === 'activar' ? 'activado' : 'desactivado'} exitosamente`, 'Cerrar', { duration: 3000 });
          this.loadUsers();
        },
        error: (error: any) => {
          this.snackBar.open('Error al cambiar el estado del usuario', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  onDelete(user: User): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usersService.delete(user.id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }
}
