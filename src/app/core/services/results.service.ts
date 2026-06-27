import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateResultDto {
  orderItemId: string;
  valorGenerado: string;
  observaciones?: string;
}

export interface Result {
  id: string;
  orderItemId: string;
  valor: string;
  interpretacion?: string;
  estado: 'REGISTRADO' | 'VALIDADO' | 'RECHAZADO' | 'ENTREGADO';
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
      prioridad: string;
      patient: {
        id: string;
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

  getAll(params?: { estado?: string; orderId?: string }): Observable<Result[]> {
    return this.http.get<Result[]>(this.apiUrl, { params: params || {} });
  }

  getPendingValidation(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/pending-validation`);
  }

  getById(id: string): Observable<Result> {
    return this.http.get<Result>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateResultDto): Observable<Result> {
    return this.http.post<Result>(this.apiUrl, data);
  }

  validate(id: string): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/${id}/validate`, {});
  }

  reject(id: string): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/${id}/reject`, {});
  }

  deliver(id: string): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/${id}/deliver`, {});
  }

  update(id: string, data: Partial<CreateResultDto> & { interpretacion?: string }): Observable<Result> {
    return this.http.patch<Result>(`${this.apiUrl}/${id}`, data);
  }
}


