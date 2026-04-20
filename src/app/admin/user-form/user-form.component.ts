import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UsersService, CreateUserDto, UpdateUserDto, User, Role } from '../../core/services/users.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private snackBar = inject(MatSnackBar);

  userForm!: FormGroup;
  loading = false;
  isEditMode = false;
  userId: string | null = null;
  user: User | null = null;
  roles: Role[] = [];

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    this.initForm();
    this.loadRoles();

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      nombres: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]
      ],
      roleIds: [[], Validators.required]
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  loadUser(id: string): void {
    this.loading = true;
    this.usersService.getById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          nombres: user.nombres,
          email: user.email,
          roleIds: user.roles.map(ur => ur.roleId)
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Error al cargar el usuario', 'Cerrar', { duration: 3000 });
        console.error(error);
        this.router.navigate(['/admin/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loading = true;

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId) {
      const updateDto: UpdateUserDto = {
        nombres: formValue.nombres,
        email: formValue.email,
        roleIds: formValue.roleIds
      };

      if (formValue.password) {
        updateDto.password = formValue.password;
      }

      this.usersService.update(this.userId, updateDto).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    } else {
      const createDto: CreateUserDto = {
        nombres: formValue.nombres,
        email: formValue.email,
        password: formValue.password,
        roleIds: formValue.roleIds
      };

      this.usersService.create(createDto).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error al crear el usuario', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
