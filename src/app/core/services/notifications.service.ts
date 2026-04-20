import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SendEmailDto {
  email: string;
}

export interface SendWhatsAppDto {
  phoneNumber: string; // Formato: +593995492656
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  auditLogId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  /**
   * Enviar resultado por email con PDF adjunto
   */
  sendResultByEmail(resultId: string, email: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(
      `${this.apiUrl}/result/${resultId}/email`,
      { email }
    );
  }

  /**
   * Enviar orden completa por email con PDF adjunto
   */
  sendOrderByEmail(orderId: string, email: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(
      `${this.apiUrl}/order/${orderId}/email`,
      { email }
    );
  }

  /**
   * Enviar resultado por WhatsApp
   */
  sendResultByWhatsApp(resultId: string, phoneNumber: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(
      `${this.apiUrl}/result/${resultId}/whatsapp`,
      { phoneNumber }
    );
  }

  /**
   * Enviar orden por WhatsApp
   */
  sendOrderByWhatsApp(orderId: string, phoneNumber: string): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(
      `${this.apiUrl}/order/${orderId}/whatsapp`,
      { phoneNumber }
    );
  }

  /**
   * Validar formato de teléfono para WhatsApp
   */
  validatePhoneNumber(phone: string): boolean {
    const regex = /^\+\d{10,15}$/;
    return regex.test(phone);
  }

  /**
   * Formatear número de teléfono para WhatsApp
   * Ejemplo: 0995492656 -> +593995492656
   */
  formatPhoneNumber(phone: string, countryCode: string = '+593'): string {
    // Remover espacios y guiones
    phone = phone.replace(/[\s-]/g, '');

    // Si empieza con 0, reemplazar con código de país
    if (phone.startsWith('0')) {
      return countryCode + phone.substring(1);
    }

    // Si no tiene código de país, agregarlo
    if (!phone.startsWith('+')) {
      return countryCode + phone;
    }

    return phone;
  }
}
