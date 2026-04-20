import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateResultDto {
  orderItemId: string;
  valor: string;
  unidad?: string;
  valorMin?: number;
  valorMax?: number;
  interpretacion?: string;
  createdById: string;
}

export interface UpdateResultDto {
  valor?: string;
  unidad?: string;
  valorMin?: number;
  valorMax?: number;
  interpretacion?: string;
}

export interface Result {
  id: string;
  orderItemId: string;
  valor: string;
  unidad?: string;
  valorMin?: number;
  valorMax?: number;
  interpretacion?: string;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'VALIDADO';
  createdById?: string;
  validatedById?: string;
  validatedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderItem?: {
    exam: {
      nombre: string;
      codigo: string;
    };
    labOrder: {
      codigo: string;
      patient: {
        nombres: string;
        apellidos: string;
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private apiUrl = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) {}

  getAll(params?: { estado?: string }): Observable<Result[]> {
    return this.http.get<Result[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Result> {
    return this.http.get<Result>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateResultDto): Observable<Result> {
    return this.http.post<Result>(this.apiUrl, data);
  }

  update(id: string, data: UpdateResultDto): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambios de estado
  deliver(id: string): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/${id}/deliver`, {});
  }

  validate(id: string, validatedById: string): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/${id}/validate`, { validatedById });
  }

  reject(id: string, reason: string): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  // Resultados pendientes
  getPending(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/pending`);
  }

  // Resultados por orden
  getByOrder(orderId: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/order/${orderId}`);
  }
}
