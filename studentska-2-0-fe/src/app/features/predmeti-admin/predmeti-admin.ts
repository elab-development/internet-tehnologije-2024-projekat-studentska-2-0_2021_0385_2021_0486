import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CourseService } from '../../services/course.service';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../../models/course.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-predmeti-admin',
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './predmeti-admin.html',
  styleUrl: './predmeti-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredmetiAdmin implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  // Signals for state management
  readonly courses = signal<Course[]>([]);
  readonly isLoading = signal(false);
  readonly isCreating = signal(false);
  readonly selectedCourse = signal<Course | null>(null);
  readonly showDetails = signal(false);

  // Table configuration
  readonly displayedColumns = ['naziv', 'sifra', 'espb', 'semestar', 'godina', 'actions'];

  ngOnInit(): void {
    this.loadCourses();
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.scrollTop > 0) {
      target.classList.add('scrolled');
    } else {
      target.classList.remove('scrolled');
    }
  }

  loadCourses(): void {
    this.isLoading.set(true);
    
    this.courseService.getCourses()
      .pipe(
        catchError(error => {
          console.error('Error loading courses:', error);
          this.snackBar.open('Greška pri učitavanju kurseva', 'Zatvori', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of([]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(courses => {
        this.courses.set(courses);
      });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CourseFormDialog, {
      width: '500px',
      data: { mode: 'create', course: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCourse(result);
      }
    });
  }

  openEditDialog(course: Course): void {
    const dialogRef = this.dialog.open(CourseFormDialog, {
      width: '500px',
      data: { mode: 'edit', course: { ...course } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCourse({ id: course.id, ...result });
      }
    });
  }

  viewDetails(course: Course): void {
    this.selectedCourse.set(course);
    this.showDetails.set(true);
  }

  closeDetails(): void {
    this.showDetails.set(false);
    this.selectedCourse.set(null);
  }

  createCourse(payload: CreateCoursePayload): void {
    this.isCreating.set(true);

    this.courseService.createCourse(payload)
      .pipe(
        catchError(error => {
          console.error('Error creating course:', error);
          this.snackBar.open('Greška pri kreiranju kursa', 'Zatvori', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        }),
        finalize(() => this.isCreating.set(false))
      )
      .subscribe(response => {
        if (response) {
          this.snackBar.open('Kurs je uspešno kreiran!', 'Zatvori', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCourses();
        }
      });
  }

  updateCourse(payload: UpdateCoursePayload): void {
    this.courseService.updateCourse(payload)
      .pipe(
        catchError(error => {
          console.error('Error updating course:', error);
          this.snackBar.open('Greška pri ažuriranju kursa', 'Zatvori', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.snackBar.open('Kurs je uspešno ažuriran!', 'Zatvori', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCourses();
          this.closeDetails();
        }
      });
  }

  deleteCourse(course: Course): void {
    if (confirm(`Da li ste sigurni da želite da obrišete kurs "${course.naziv}"?`)) {
      this.courseService.deleteCourse(course.id)
        .pipe(
          catchError(error => {
            console.error('Error deleting course:', error);
            this.snackBar.open('Greška pri brisanju kursa', 'Zatvori', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.snackBar.open('Kurs je uspešno obrisan!', 'Zatvori', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadCourses();
            this.closeDetails();
          }
        });
    }
  }
}

// Course Form Dialog Component
@Component({
  selector: 'course-form-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ data.mode === 'create' ? 'add' : 'edit' }}</mat-icon>
      {{ data.mode === 'create' ? 'Dodaj novi kurs' : 'Izmeni kurs' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="courseForm" class="course-form">
        <mat-form-field>
          <mat-label>Naziv kursa</mat-label>
          <input matInput formControlName="naziv" placeholder="Unesite naziv kursa">
          <mat-error *ngIf="courseForm.get('naziv')?.hasError('required')">
            Naziv kursa je obavezan
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>ESPB</mat-label>
          <input matInput type="number" formControlName="espb" placeholder="Broj ESPB bodova">
          <mat-error *ngIf="courseForm.get('espb')?.hasError('required')">
            ESPB je obavezan
          </mat-error>
          <mat-error *ngIf="courseForm.get('espb')?.hasError('min')">
            ESPB mora biti veći od 0
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Semestar</mat-label>
          <input matInput type="number" formControlName="semestar" placeholder="Broj semestra">
          <mat-error *ngIf="courseForm.get('semestar')?.hasError('required')">
            Semestar je obavezan
          </mat-error>
          <mat-error *ngIf="courseForm.get('semestar')?.hasError('min') || courseForm.get('semestar')?.hasError('max')">
            Semestar mora biti između 1 i 8
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Godina studija</mat-label>
          <input matInput type="number" formControlName="godina" placeholder="Godina studija">
          <mat-error *ngIf="courseForm.get('godina')?.hasError('required')">
            Godina je obavezna
          </mat-error>
          <mat-error *ngIf="courseForm.get('godina')?.hasError('min') || courseForm.get('godina')?.hasError('max')">
            Godina mora biti između 1 i 4
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Otkaži</button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="courseForm.invalid || isSubmitting"
              (click)="onSubmit()">
        {{ data.mode === 'create' ? 'Kreiraj' : 'Sačuvaj' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .course-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
    
    mat-form-field {
      width: 100%;
    }
    
    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
    }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class CourseFormDialog {
  readonly data = inject<{ mode: 'create' | 'edit', course: Course | null }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CourseFormDialog>);
  readonly fb = inject(FormBuilder);

  isSubmitting = false;
  
  courseForm: FormGroup = this.fb.group({
    naziv: ['', [Validators.required]],
    espb: ['', [Validators.required, Validators.min(1)]],
    semestar: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
    godina: ['', [Validators.required, Validators.min(1), Validators.max(4)]]
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.course) {
      this.courseForm.patchValue({
        naziv: this.data.course.naziv,
        espb: this.data.course.espb,
        semestar: this.data.course.semestar,
        godina: this.data.course.godina
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.dialogRef.close(this.courseForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
