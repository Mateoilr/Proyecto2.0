import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface OrderItemSampleDto {
  // Ajustar si la API exige campos extra
  // El doc dice: PATCH /api/order-items/:id/sample
  // y no especifica el body; por ahora dejamos flexible.
  [key: string]: unknown;
}

export interface RegisterOrderItemResultDto {
  // Ajustar si la API exige campos extra
  // El doc dice: POST /api/order-items/:id/result
  // y no especifica el body; por ahora dejamos estructura típica.
  valor: string;
  unidad?: string;
  valorMin?: number;
  valorMax?: number;
  interpretacion?: string;
  createdById?: string;
}

export interface OrderItem {
  id: string;
  labOrderId: string;
  examId: string;
  // Los nombres exactos pueden variar; dejamos campos útiles.
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  sampleType?: string;
  observaciones?: string;

  // Resultado (si la API lo incluye en el GET)
  result?: {
    id: string;
    orderItemId: string;
    valor: string;
    unidad?: string;
    valorMin?: number;
    valorMax?: number;
    interpretacion?: string;
    estado?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderItemsService {
  private apiUrl = `${environment.apiUrl}/order-items`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.apiUrl}/${id}`);
  }

  sample(id: string, data: OrderItemSampleDto = {}): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.apiUrl}/${id}/sample`, data);
  }

  result(id: string, data: RegisterOrderItemResultDto): Observable<OrderItem> {
    return this.http.post<OrderItem>(`${this.apiUrl}/${id}/result`, data);
  }
}

