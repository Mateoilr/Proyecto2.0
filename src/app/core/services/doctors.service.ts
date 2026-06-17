import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Doctor {
  id: string;
  nombres: string;
  apellidos: string;
  especialidad?: string;
  cmp?: string; // Colegio Médico
  telefono?: string;
  email?: string;
  estado: 'ACTIVE' | 'INACTIVE';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateDoctorDto {
  nombres: string;
  apellidos: string;
  especialidad?: string;
  cmp?: string;
  telefono?: string;
  email?: string;
}

export interface UpdateDoctorDto extends Partial<CreateDoctorDto> {
  estado?: 'ACTIVE' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  getAll(params?: { page?: number; limit?: number; search?: string }): Observable<Doctor[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<Doctor[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateDoctorDto): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, data);
  }

  update(id: string, data: UpdateDoctorDto): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
