import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  /**
   * Descargar hoja de petición de análisis en PDF
   */
  downloadOrdenPeticion(orderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/orden-peticion/${orderId}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Descargar reporte completo de orden con resultados
   */
  downloadReporteOrden(orderId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/order/${orderId}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Descargar reporte de un resultado específico
   */
  downloadReporteResultado(resultId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/result/${resultId}/pdf`, {
      responseType: 'blob'
    });
  }

  /**
   * Helper para descargar un blob como archivo
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
