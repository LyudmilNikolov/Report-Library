import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/wizard', pathMatch: 'full' },
  { 
    path: 'wizard', 
    loadComponent: () => import('./components/wizard/wizard.component')
      .then(wizardModule => wizardModule.WizardComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./components/reports/reports.component')
      .then(reportsModule => reportsModule.ReportsComponent)
  },
  { 
    path: 'export-format', 
    loadComponent: () => import('./components/export-format/export-format.component')
      .then(exportFormatModule => exportFormatModule.ExportFormatComponent)
  },
  { 
    path: 'result', 
    loadComponent: () => import('./components/result/result.component')
      .then(resultModule => resultModule.ResultComponent)
  },
  {
    path: '**',
    redirectTo: 'wizard'
  },
];
