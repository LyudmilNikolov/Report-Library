import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './preview-modal.component.html',
  styleUrl: './preview-modal.component.scss'
})
export class PreviewModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { htmlContent: string }) {}
}