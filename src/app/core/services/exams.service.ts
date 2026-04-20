import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Exam {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoMuestra?: string;
  estado: 'ACTIVE' | 'INACTIVE';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateExamDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoMuestra?: string;
}

export interface UpdateExamDto extends Partial<CreateExamDto> {
  estado?: 'ACTIVE' | 'INACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getAll(params?: { page?: number; limit?: number; search?: string; estado?: string }): Observable<Exam[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);

    return this.http.get<Exam[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateExamDto): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, data);
  }

  update(id: string, data: UpdateExamDto): Observable<Exam> {
    return this.http.patch<Exam>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activate(id: string): Observable<Exam> {
    return this.http.patch<Exam>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<Exam> {
    return this.http.patch<Exam>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
