import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatbotResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = `${environment.apiUrl}/chatbot`;
  private http = inject(HttpClient);

  sendMessage(message: string): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(this.apiUrl, { message });
  }
}

