import { NgIf } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { DocumentReady } from '../../interfaces/document';
import { ExportFormat } from '../../interfaces/format';
import { Report } from '../../interfaces/report';
import { ReportsService } from '../../services/reports.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NgIf, MatDialogModule],
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

  private destroyRef = inject(DestroyRef);

  constructor(private reportsService: ReportsService, public dialog: MatDialog) {}

  processReport(action: 'preview' | 'download'): void {
    this.reportsService.registerClient()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
        switchMap(() => this.reportsService.resolveDocument(this.clientId, this.instanceId, 'HTML5Interactive')),
        tap(response => this.documentId = response.documentId),
        switchMap(() => {
          if (action === 'download') {
            const formatName = this.format ? this.format.name : 'PDF';
            return this.reportsService.resolveDocument(this.clientId, this.instanceId, formatName, this.documentId);
          } else {
            return of({ documentId: this.documentId });
          }
        }),
        switchMap(response => {
          if (action === 'download') {
            this.documentId = response.documentId;
          }
          return this.pollDocumentReady();
        })
      )
      .subscribe({
        next: () => {
          if (action === 'preview') {
            this.previewReport();
          } else {
            this.downloadReport();
          }
        },
        error: err => console.error(err)
      });
  }

  pollDocumentReady(): Observable<DocumentReady> {
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

  previewReport(): void {
    this.reportsService.getDocumentPage(this.clientId, this.instanceId, this.documentId, '1').pipe(
      takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
      this.dialog.open(PreviewModalComponent, {
        data: { htmlContent: data.pageContent }
      });
    });
  }

  downloadReport(): void {
    this.downloadUrl = this.reportsService.getDownloadLink(this.clientId, this.instanceId, this.documentId);
    const a = document.createElement('a');
    a.href = this.downloadUrl;
    a.download = `${this.report.title}.${this.format ? this.format.name : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}