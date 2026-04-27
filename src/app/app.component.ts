import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWidgetComponent } from './chatbot/components/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'syslab-frontend';
}
