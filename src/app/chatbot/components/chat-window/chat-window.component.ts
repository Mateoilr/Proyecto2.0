import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatMessage } from '../../models/chat-message.model';
import { ChatbotService } from '../../services/chatbot.service';
import { MessageListComponent } from '../message-list/message-list.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { QuickRepliesComponent, QuickReply } from '../quick-replies/quick-replies.component';

const STORAGE_KEY = 'syslab_chat_history';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function parseQuickReplies(text: string): QuickReply[] {
  const replies: QuickReply[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Detecta patrones como 1️⃣, 2️⃣, 3️⃣ o 1. 2. 3. o - opción
    const match = trimmed.match(/^(\d+[️⃣]?)\s*[.\-)]?\s*(.+)$/);
    if (match) {
      replies.push({ label: trimmed, value: match[2].trim() });
    }
  }
  // Si no encontró opciones numéricas pero detecta palabras clave comunes
  if (replies.length === 0) {
    const lower = text.toLowerCase();
    if (lower.includes('escribe') || lower.includes('hola')) {
      replies.push({ label: '👋 Hola', value: 'hola' });
    }
  }
  return replies;
}

function formatBotText(text: string): string {
  // Convertir *texto* en negritas
  let formatted = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  // Detectar URLs de WhatsApp y convertirlas en link
  formatted = formatted.replace(
    /(https?:\/\/wa\.me\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="whatsapp-link">Escríbenos por WhatsApp</a>'
  );
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return formatted;
}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageListComponent,
    TypingIndicatorComponent,
    QuickRepliesComponent
  ],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  private chatbotService = inject(ChatbotService);
  private destroy$ = new Subject<void>();

  @Output() close = new EventEmitter<void>();

  messages: ChatMessage[] = [];
  inputText = '';
  isLoading = false;
  quickReplies: QuickReply[] = [];

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MessageListComponent) messageList!: MessageListComponent;

  ngOnInit(): void {
    this.loadHistory();
    if (this.messages.length === 0) {
      this.addBotMessage('¡Hola! Soy el asistente virtual de SysLab. ¿En qué puedo ayudarte?\n\n1️⃣ Horarios de atención\n2️⃣ Precios y cotización\n3️⃣ Requisitos y ayuno\n\nEscribe el número o tu consulta.');
    }
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private focusInput(): void {
    setTimeout(() => this.messageInput?.nativeElement?.focus(), 100);
  }

  private addBotMessage(text: string): void {
    const formatted = formatBotText(text);
    const message: ChatMessage = {
      id: generateId(),
      sender: 'bot',
      text: formatted,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.quickReplies = parseQuickReplies(text);
    this.saveHistory();
    this.scrollToBottom();
  }

  private addUserMessage(text: string): void {
    const message: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.quickReplies = [];
    this.saveHistory();
    this.scrollToBottom();
  }

  private addErrorMessage(text: string): void {
    const message: ChatMessage = {
      id: generateId(),
      sender: 'bot',
      text,
      timestamp: new Date(),
      isError: true
    };
    this.messages.push(message);
    this.saveHistory();
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => this.messageList?.requestScroll(), 50);
  }

  private saveHistory(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
    } catch {
      // silently ignore storage errors
    }
  }

  private loadHistory(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        this.messages = parsed.map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch {
      // ignore corrupt storage
    }
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.addUserMessage(text);
    this.inputText = '';
    this.isLoading = true;

    this.chatbotService
      .sendMessage(text)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.addBotMessage(res.reply);
        },
        error: () => {
          this.isLoading = false;
          this.addErrorMessage('Ups, ocurrió un error al conectar con el asistente. Por favor intenta de nuevo más tarde.');
        }
      });
  }

  onQuickReplySelected(value: string): void {
    this.inputText = value;
    this.sendMessage();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearHistory(): void {
    this.messages = [];
    localStorage.removeItem(STORAGE_KEY);
    this.addBotMessage('¡Hola! Soy el asistente virtual de SysLab. ¿En qué puedo ayudarte?\n\n1️⃣ Horarios de atención\n2️⃣ Precios y cotización\n3️⃣ Requisitos y ayuno\n\nEscribe el número o tu consulta.');
  }
}

