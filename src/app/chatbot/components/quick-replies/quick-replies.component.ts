import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuickReply {
  label: string;
  value: string;
}

@Component({
  selector: 'app-quick-replies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-replies.component.html',
  styleUrls: ['./quick-replies.component.css']
})
export class QuickRepliesComponent {
  @Input() replies: QuickReply[] = [];
  @Output() selected = new EventEmitter<string>();

  onSelect(value: string): void {
    this.selected.emit(value);
  }
}

