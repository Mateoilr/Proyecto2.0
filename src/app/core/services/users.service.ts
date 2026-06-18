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



  update(id: string, data: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  replaceRoles(id: string, roleIds: string[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/roles`, { roleIds });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, estado: 'ACTIVE' | 'INACTIVE'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/status`, { status: estado });
  }
}
