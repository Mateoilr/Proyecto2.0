import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  nombres: string;
  apellidos?: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles: UserRole[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserRole {
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}

export interface CreateUserDto {
  nombres: string;
  apellidos?: string;
  email: string;
  password: string;
  roleIds: string[];
}

export interface UpdateUserDto {
  nombres?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  roleIds?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(params?: { status?: string }): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  update(id: string, data: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activate(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  // Roles disponibles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiUrl}/roles`);
  }
}
