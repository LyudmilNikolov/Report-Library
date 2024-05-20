import { NgFor } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ExportFormat } from '../../interfaces/format';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-export-format',
  standalone: true,
  imports: [MatRadioModule, FormsModule, NgFor],
  templateUrl: './export-format.component.html',
  styleUrl: './export-format.component.scss'
})
export class ExportFormatComponent implements OnInit {
  exportFormats: ExportFormat[] = [];
  selectedFormat: ExportFormat | null = null;

  @Output() formatSelected = new EventEmitter<ExportFormat>();

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.fetchExportFormats();
  }

  fetchExportFormats(): void {
    this.reportsService.getAvailableFormats().subscribe(formats => {
      this.exportFormats = formats;
    });
  }
  selectFormat(format: ExportFormat): void {
    this.selectedFormat = format;
    this.formatSelected.emit(this.selectedFormat);
  }
}
