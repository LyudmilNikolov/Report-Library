import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientResponse, DocumentReady, DocumentResponse, InstanceResponse } from '../interfaces/document';
import { ExportFormat } from '../interfaces/format';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  /**
    * The base URLs for the Telerik Reporting API.
  */
  private baseUrl = 'https://demos.telerik.com/reporting/api/reports';
  private reportingUrl = 'https://demos.telerik.com/reporting';

  constructor(private http: HttpClient) {}

  /**
    * Resolves all available Reports.
    * @returns Observable that resolves to a HTML as string representing the available reports.
  */
  getReports(): Observable<string> {
    return this.http.get(`${this.reportingUrl}`, { responseType: 'text' })
  }

  /**
    * Resolves a list of available Formats to export.
    * @returns Observable that resolves to a ExportFormat array representing the available formats.
  */
  getAvailableFormats(): Observable<ExportFormat[]> {
    return this.http.get<ExportFormat[]>(`${this.baseUrl}/formats`);
  }

  /**
    * Registers a new client with the Telerik Reporting API.
    * @returns Observable that resolves to a ClientResponse object representing the registered client.
  */
  registerClient(): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.baseUrl}/clients`, {});
  }

  /**
    * Resolves the reportName needed for creating Report Instance.
    * @param dataThumbnail - The name to use for the downloaded report file.
    * @returns Observable that resolves to string, representing configuration options for downloading a report.
  */
  getReportSource(dataThumbnail: string): Observable<string> {
    const url = `${this.reportingUrl}/${dataThumbnail}`;
    return this.http.get(url, { responseType: 'text' });
  }

  /**
    * Resolves a report instance for a given client and report name.
    * @param clientId - The unique identifier for the client.
    * @param reportName - The name of the report to resolve an instance for.
    * @returns Observable that resolves to an InstanceResponse object representing the resolved instance.
  */
  resolveReportInstance(clientId: string, reportName: string): Observable<InstanceResponse> {
    const url = `${this.baseUrl}/clients/${clientId}/instances`;
    const body = { report: reportName, parameterValues: {} };
    return this.http.post<InstanceResponse>(url, body);
  }

  /**
    * Resolves a document for a given client and instance.
    * @param clientId - The unique identifier for the client.
    * @param instanceId - The unique identifier for the instance.
    * @param format - The desired document export format.
    * @param baseDocumentID - The unique identifier for the document.
    * @returns Observable that resolves to a DocumentResponse object representing the resolved document.
  */
  resolveDocument(clientId: string, instanceId: string, format: string, baseDocumentID?: string): Observable<DocumentResponse> {
    const url = `${this.baseUrl}/clients/${clientId}/instances/${instanceId}/documents`;
    const body = { format: format, baseDocumentID: baseDocumentID };
    return this.http.post<DocumentResponse>(url, body);
  }

  /**
    * Resolves a document when is ready for download.
    * @param clientId - The unique identifier for the client.
    * @param instanceId - The unique identifier for the instance.
    * @param documentId - The unique identifier for the document.
    * @returns Observable that resolves to a DocumentReady object representing the resolved document info.
  */
  getDocumentInfo(clientId: string, instanceId: string, documentId: string): Observable<DocumentReady> {
    const url = `${this.baseUrl}/clients/${clientId}/instances/${instanceId}/documents/${documentId}/info`;
    return this.http.get<{ documentReady: boolean }>(url);
  }

  /**
    * Resolves the url for the Document.
    * @param clientId - The unique identifier for the client.
    * @param instanceId - The unique identifier for the instance.
    * @param documentId - The unique identifier for the document.
    * @returns url string.
  */
  getDownloadLink(clientId: string, instanceId: string, documentId: string): string {
    return `https://demos.telerik.com/reporting/api/reports/clients/${clientId}/instances/${instanceId}/documents/${documentId}`;
  }
}
