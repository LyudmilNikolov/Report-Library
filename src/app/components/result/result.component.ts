import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { ExportFormat } from '../../interfaces/format';
import { Report } from '../../interfaces/report';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NgIf],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  @Input() report: Report;
  @Input() format: ExportFormat;

  clientId: string;
  instanceId: string;
  downloadUrl: string;
  reportName: string;
  documentId: string;

  constructor(private reportsService: ReportsService) {}

  createClientId(): void {
    this.reportsService.registerClient()
      .pipe(
        tap(response => this.clientId = response.clientId),
        switchMap(() => this.reportsService.getReportSource(this.report.dataThumbnail)),
        switchMap(data => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          const scripts = doc.querySelectorAll('script');
          scripts.forEach(script => {
            if (script.textContent.includes('loadTelerikReportViewer')) {
              const match = script.textContent.match(/report:\s*'([^']+)'/);
              if (match) {
                this.reportName = match[1];
              }
            }
          });
          return this.reportsService.resolveReportInstance(this.clientId, this.reportName);
        }),
        tap(response => this.instanceId = response.instanceId),
        switchMap(() => this.reportsService.resolveDocument(this.clientId, this.instanceId, 'HTML5')),
        tap(response => this.documentId = response.documentId),
        switchMap(() => {
          const formatName = this.format ? this.format.name : 'PDF';
          return this.reportsService.resolveDocument(this.clientId, this.instanceId, formatName, this.documentId);
        }),
        tap(response => this.documentId = response.documentId),
        switchMap(() => this.pollDocumentReady())
      )
      .subscribe({
        next: () => this.downloadReport(),
        error: err => console.error(err)
      });
  }

  pollDocumentReady() {
    return this.reportsService.getDocumentInfo(this.clientId, this.instanceId, this.documentId)
      .pipe(
        switchMap(response => {
          if (response.documentReady) {
            return of(response);
          } else {
            return of(response).pipe(delay(2000), switchMap(() => this.pollDocumentReady()));
          }
        }),
        catchError(err => {
          console.error(err);
          return of({ documentReady: false });
        })
      );
  }

  downloadReport(): void {
    this.downloadUrl = `https://demos.telerik.com/reporting/api/reports/clients/${this.clientId}/instances/${this.instanceId}/documents/${this.documentId}?response-content-disposition=attachment`;
    const a = document.createElement('a');
    a.href = this.downloadUrl;
    a.download = `${this.report.title}.${this.format ? this.format.name : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}