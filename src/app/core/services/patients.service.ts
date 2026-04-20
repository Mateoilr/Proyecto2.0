import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Patient {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: 'CEDULA' | 'PASAPORTE' | 'RUC';
  documento: string;
  fechaNacimiento: Date | string;
  sexo: 'M' | 'F' | 'OTRO';
  direccion?: string;
  contacto?: string;
  email?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePatientDto {
  nombres: string;
  apellidos: string;
  tipoDocumento: 'CEDULA' | 'PASAPORTE' | 'RUC';
  documento: string;
  fechaNacimiento: Date | string;
  sexo: 'M' | 'F' | 'OTRO';
  direccion?: string;
  contacto?: string;
  email?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getAll(params?: { page?: number; limit?: number; search?: string }): Observable<Patient[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<Patient[]>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  create(data: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, data);
  }

  update(id: string, data: UpdatePatientDto): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByDocument(documento: string): Observable<Patient | null> {
    return this.http.get<Patient>(`${this.apiUrl}/search/document/${documento}`);
  }
}
