import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-download-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  type: string | null = null;
  id: string | null = null;
  token: string | null = null;
  pdfUrl: string | null = null;
  isRedirecting = true;
  blobUrl: string | null = null;
  safeBlobUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.type && this.id && this.token) {
      this.pdfUrl = `${environment.apiUrl}/reports/public/${this.type}/${this.id}/pdf?token=${this.token}`;
      this.fetchAndDownloadPdf();
    } else {
      this.isRedirecting = false;
    }
  }

  fetchAndDownloadPdf(): void {
    if (!this.pdfUrl) return;

    this.http.get(this.pdfUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.blobUrl = URL.createObjectURL(blob);
        this.safeBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
        this.isRedirecting = false;
      },
      error: (err) => {
        console.error('Error downloading PDF', err);
        this.isRedirecting = false;
        this.snackBar.open('Error al obtener el PDF. El enlace puede haber expirado.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  downloadPdf(): void {
    if (this.blobUrl) {
      this.triggerDownload(this.blobUrl);
    } else {
      this.fetchAndDownloadPdf();
    }
  }

  private triggerDownload(url: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${this.type === 'order' ? 'Orden' : 'Resultado'}_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
