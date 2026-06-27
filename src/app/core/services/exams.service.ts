import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExamReferenceRange {
  id: string;
  examId: string;
  sexo?: 'M' | 'F' | 'OTRO';
  edadMin?: number;
  edadMax?: number;
  valorMin?: number;
  valorMax?: number;
  textoReferencia?: string;
}

export interface PredefinedValue {
  id: string;
  examId: string;
  valor: string;
}

export interface Exam {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  esCualitativo: boolean;
  categoryId: string;
  unitId?: string;
  sampleTypeId?: string;
  tecnicaId?: string;
  tipoResultado: string;
  estado: 'ACTIVE' | 'INACTIVE';
  referenceRanges?: ExamReferenceRange[];
  predefinedValues?: PredefinedValue[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateExamDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  esCualitativo?: boolean;
  categoriaId: string;
  unidadId?: string;
  muestraId?: string;
  tecnicaId?: string;
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

  addReferenceRange(examId: string, range: any): Observable<ExamReferenceRange> {
    const payload = {
      ...range,
      edadMinAnios: range.edadMin,
      edadMaxAnios: range.edadMax
    };
    return this.http.post<ExamReferenceRange>(`${this.apiUrl}/${examId}/reference-ranges`, payload);
  }

  removeReferenceRange(examId: string, rangeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/reference-ranges/${rangeId}`);
  }

  addPredefinedValue(examId: string, value: { valor: string }): Observable<PredefinedValue> {
    return this.http.post<PredefinedValue>(`${this.apiUrl}/${examId}/predefined-values`, value);
  }

  removePredefinedValue(examId: string, valueId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/predefined-values/${valueId}`);
  }
}
