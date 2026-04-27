import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css']
})
export class MessageBubbleComponent {
  @Input() message!: ChatMessage;

  get formattedText(): string {
    return this.message.text;
  }

  get isUser(): boolean {
    return this.message.sender === 'user';
  }

  get isError(): boolean {
    return !!this.message.isError;
  }

  get timeString(): string {
    return this.message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

