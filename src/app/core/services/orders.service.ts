import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient } from './patients.service';
import { Exam } from './exams.service';

export interface OrderItem {
  id: string;
  labOrderId: string;
  examId: string;
  exam: Exam;
  result?: Result;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  sampleType?: string;
  observaciones?: string;
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
}

export interface LabOrder {
  id: string;
  patientId: string;
  patient: Patient;
  codigo: string;
  prioridad: 'NORMAL' | 'URGENTE';
  estado: 'CREADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CERRADA' | 'CANCELADA';
  observaciones?: string;
  items: OrderItem[];
  createdById: string;
  updatedById?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateOrderDto {
  patientId: string;
  prioridad?: 'NORMAL' | 'URGENTE';
  observaciones?: string;
  createdById: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  examId: string;
  sampleType?: string;
  observaciones?: string;
}

export interface UpdateOrderDto {
  prioridad?: 'NORMAL' | 'URGENTE';
  estado?: 'CREADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CERRADA' | 'CANCELADA';
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    prioridad?: string;
    patientId?: string;
  }): Observable<LabOrder[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);
    if (params?.prioridad) httpParams = httpParams.set('prioridad', params.prioridad);
    if (params?.patientId) httpParams = httpParams.set('patientId', params.patientId);

    return this.http.get<LabOrder[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<LabOrder> {
    return this.http.get<LabOrder>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateOrderDto): Observable<LabOrder> {
    return this.http.post<LabOrder>(this.apiUrl, data);
  }

  update(id: string, data: UpdateOrderDto): Observable<LabOrder> {
    return this.http.patch<LabOrder>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambios de estado
  startProcessing(id: string): Observable<LabOrder> {
    return this.http.patch<LabOrder>(`${this.apiUrl}/${id}/start`, {});
  }

  complete(id: string): Observable<LabOrder> {
    return this.http.patch<LabOrder>(`${this.apiUrl}/${id}/complete`, {});
  }

  close(id: string): Observable<LabOrder> {
    return this.http.post<LabOrder>(`${this.apiUrl}/${id}/close`, {});
  }

  cancel(id: string): Observable<LabOrder> {
    return this.http.patch<LabOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Órdenes por paciente
  getByPatient(patientId: string): Observable<LabOrder[]> {
    return this.http.get<LabOrder[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
