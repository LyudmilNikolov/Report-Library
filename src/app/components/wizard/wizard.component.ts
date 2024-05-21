import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ExportFormat } from '../../interfaces/format';
import { Report } from '../../interfaces/report';
import { ExportFormatComponent } from '../export-format/export-format.component';
import { ReportsComponent } from '../reports/reports.component';
import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [MatStepperModule, ExportFormatComponent, ReportsComponent, ResultComponent, ReactiveFormsModule],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss'
})
export class WizardComponent implements OnInit {
  public reportFormGroup: FormGroup;
  public formatFormGroup: FormGroup;
  selectedReport: Report | null = null;
  selectedFormat: ExportFormat | null = null;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.reportFormGroup = this._formBuilder.group({
      reportCtrl: ['', Validators.required]
    });
    this.formatFormGroup = this._formBuilder.group({
      formatCtrl: ['']
    });
  }

  onReportSelected(report: Report): void {
    this.selectedReport = report;
    this.reportFormGroup.controls['reportCtrl'].setValue(report.title);
  }

  onFormatSelected(format: ExportFormat): void {
    this.selectedFormat = format;
    this.formatFormGroup.controls['formatCtrl'].setValue(format.name);
  }
}
