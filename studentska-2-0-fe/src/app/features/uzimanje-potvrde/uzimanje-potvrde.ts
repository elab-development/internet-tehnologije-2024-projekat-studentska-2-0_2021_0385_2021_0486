import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../services/student.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-uzimanje-potvrde',
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './uzimanje-potvrde.html',
  styleUrl: './uzimanje-potvrde.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UzimanjePotvrde {
  private readonly studentService = inject(StudentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly snackBar = inject(MatSnackBar);

  readonly isLoading = signal(false);
  readonly pdfUrl = signal<SafeResourceUrl | null>(null);
  readonly pdfBlob = signal<Blob | null>(null);
  readonly hasError = signal(false);

  generatePdf(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.pdfUrl.set(null);

    this.studentService.generateConfirmationPdf()
      .pipe(
        catchError(error => {
          console.error('Error generating PDF:', error);
          this.hasError.set(true);
          this.snackBar.open('Greška pri generisanju potvrde. Pokušajte ponovo.', 'Zatvori', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(blob => {
        if (blob) {
          this.pdfBlob.set(blob);
          const url = URL.createObjectURL(blob);
          const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.pdfUrl.set(safeUrl);
          
          this.snackBar.open('Potvrda je uspešno generisana!', 'Zatvori', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      });
  }

  downloadPdf(): void {
    const blob = this.pdfBlob();
    if (!blob) {
      this.snackBar.open('Prvo generišite potvrdu.', 'Zatvori', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studentska-potvrda-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.snackBar.open('Potvrda je uspešno preuzeta!', 'Zatvori', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
