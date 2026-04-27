import { Component, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat-message.model';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() isLoading = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  private shouldScroll = false;

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  trackById(index: number, message: ChatMessage): string {
    return message.id;
  }

  // Public method to trigger scroll after new message
  requestScroll(): void {
    this.shouldScroll = true;
  }
}

