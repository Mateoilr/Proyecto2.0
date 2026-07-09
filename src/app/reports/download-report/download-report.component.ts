import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-download-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {
  private route = inject(ActivatedRoute);

  type: string | null = null;
  id: string | null = null;
  token: string | null = null;
  pdfUrl: string | null = null;
  isRedirecting = true;

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type'); // 'order' o 'result'
    this.id = this.route.snapshot.paramMap.get('id');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.type && this.id && this.token) {
      this.pdfUrl = `${environment.apiUrl}/reports/public/${this.type}/${this.id}/pdf?token=${this.token}`;
      
      // Auto redirect
      setTimeout(() => {
        window.location.href = this.pdfUrl!;
        
        // Mostrar botón si no cambia de página
        setTimeout(() => {
          this.isRedirecting = false;
        }, 2000);
      }, 1000);
    } else {
      this.isRedirecting = false;
    }
  }

  downloadPdf(): void {
    if (this.pdfUrl) {
      window.location.href = this.pdfUrl;
    }
  }
}
