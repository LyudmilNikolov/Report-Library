import { NgFor } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Report } from '../../interfaces/report';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatRadioModule, FormsModule, NgFor],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  selectedReport: Report | null = null;

  @Output() reportSelected = new EventEmitter<Report>();

  private destroyRef = inject(DestroyRef);
  
  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.reportsService.getReports()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const reportElements = doc.querySelectorAll('.accordion-item');
        this.reports = Array.from(reportElements)
        .filter(element => {
          return element.querySelector('.accordion-toggle h2')?.textContent.trim() !== 'Web Report Designer';
        })
        .map(el => ({
          title: el.querySelector('.accordion-toggle h2')?.textContent.trim() || '',
          description: el.querySelector('.accordion-description')?.textContent.trim() || '',
          dataThumbnail: el.getAttribute('data-thumbnail') || ''
        }));
      });
  }

  selectReport(report: Report): void {
    this.selectedReport = report;
    this.reportSelected.emit(this.selectedReport);
  }
}