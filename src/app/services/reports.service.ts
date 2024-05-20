import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportFormat } from '../interfaces/format';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = 'https://demos.telerik.com/reporting/api/reports';
  private reportingUrl = 'https://demos.telerik.com/reporting';

  constructor(private http: HttpClient) {}

  getReports(): Observable<string> {
    return this.http.get(`${this.reportingUrl}`, { responseType: 'text' })
  }

  getAvailableFormats(): Observable<ExportFormat[]> {
    return this.http.get<ExportFormat[]>(`${this.baseUrl}/formats`);
  }

  registerClient(): Observable<{ clientId: string }> {
    return this.http.post<{ clientId: string }>(`${this.baseUrl}/clients`, {});
  }

  getReportSource(dataThumbnail: string): Observable<string> {
    const url = `${this.reportingUrl}/${dataThumbnail}`;
    return this.http.get(url, { responseType: 'text' });
  }

  resolveReportInstance(clientId: string, reportName: string): Observable<{ instanceId: string }> {
    const url = `${this.baseUrl}/clients/${clientId}/instances`;
    const body = { report: reportName, parameterValues: {} };
    return this.http.post<{ instanceId: string }>(url, body);
  }

  resolveDocument(clientId: string, instanceId: string, format: string, baseDocumentID?: string): Observable<{ documentId: string }> {
    const url = `${this.baseUrl}/clients/${clientId}/instances/${instanceId}/documents`;
    const body = { format: format, baseDocumentID: baseDocumentID };
    return this.http.post<{ documentId: string }>(url, body);
  }

  getDocumentInfo(clientId: string, instanceId: string, documentId: string): Observable<{ documentReady: boolean }> {
    const url = `${this.baseUrl}/clients/${clientId}/instances/${instanceId}/documents/${documentId}/info`;
    return this.http.get<{ documentReady: boolean }>(url);
  }

  getDownloadLink(clientId: string, instanceId: string, documentId: string): string {
    return `https://demos.telerik.com/reporting/api/reports/clients/${clientId}/instances/${instanceId}/documents/${documentId}`;
  }
}
