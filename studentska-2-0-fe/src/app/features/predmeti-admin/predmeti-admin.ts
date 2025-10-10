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
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CourseService } from '../../services/course.service';
import { Course, CreateCoursePayload, UpdateCoursePayload, CourseSearchParams, CourseSearchResponse } from '../../models/course.model';
import { catchError, finalize, of, debounceTime, distinctUntilChanged } from 'rxjs';

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
    MatSelectModule,
    MatPaginatorModule,
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
  readonly searchResponse = signal<CourseSearchResponse | null>(null);
  readonly isLoading = signal(false);
  readonly isCreating = signal(false);
  readonly selectedCourse = signal<Course | null>(null);
  readonly showDetails = signal(false);

  // Search form
  searchForm: FormGroup = this.fb.group({
    naziv: [''],
    sifra_predmeta: [''],
    espb: [''],
    semestar: [''],
    godina: [''],
    sort_by: ['naziv'],
    sort_order: ['asc']
  });

  // Current search parameters
  private currentSearchParams: CourseSearchParams = {
    page: 1,
    per_page: 15,
    sort_by: 'naziv',
    sort_order: 'asc'
  };

  // Table configuration
  readonly displayedColumns = ['naziv', 'sifra', 'espb', 'semestar', 'godina', 'actions'];

  ngOnInit(): void {
    this.searchCourses();
    this.setupSearchFormSubscription();
  }

  private setupSearchFormSubscription(): void {
    // Auto-search when naziv or sifra_predmeta changes
    this.searchForm.get('naziv')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.searchCourses());
      
    this.searchForm.get('sifra_predmeta')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.searchCourses());
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.scrollTop > 0) {
      target.classList.add('scrolled');
    } else {
      target.classList.remove('scrolled');
    }
  }

  searchCourses(): void {
    this.isLoading.set(true);
    
    // Build search parameters from form
    const formValues = this.searchForm.value;
    const searchParams: CourseSearchParams = {
      ...this.currentSearchParams,
      naziv: formValues.naziv || undefined,
      sifra_predmeta: formValues.sifra_predmeta || undefined,
      espb: formValues.espb || undefined,
      semestar: formValues.semestar || undefined,
      godina: formValues.godina || undefined,
      sort_by: formValues.sort_by || 'naziv',
      sort_order: formValues.sort_order || 'asc'
    };
    
    this.courseService.searchCourses(searchParams)
      .pipe(
        catchError(error => {
          console.error('Error searching courses:', error);
          this.snackBar.open('Greška pri pretragama kurseva', 'Zatvori', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(response => {
        if (response) {
          this.searchResponse.set(response);
          this.courses.set(response.data);
        }
      });
  }

  clearFilters(): void {
    this.searchForm.reset({
      naziv: '',
      sifra_predmeta: '',
      espb: '',
      semestar: '',
      godina: '',
      sort_by: 'naziv',
      sort_order: 'asc'
    });
    this.currentSearchParams = {
      page: 1,
      per_page: 15,
      sort_by: 'naziv',
      sort_order: 'asc'
    };
    this.searchCourses();
  }

  onPageChange(event: PageEvent): void {
    this.currentSearchParams = {
      ...this.currentSearchParams,
      page: event.pageIndex + 1,
      per_page: event.pageSize
    };
    this.searchCourses();
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
          this.searchCourses();
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
          this.searchCourses();
          this.closeDetails();
        }
      });
  }

  deleteCourse(course: Course): void {
    if (confirm(`Da li ste sigurni da želite da obrišete kurs "${course.naziv}"?`)) {
      this.courseService
        .deleteCourse(course.id)
        .pipe(
          catchError((error) => {
            console.error('Error deleting course:', error);
            this.snackBar.open('Greška pri brisanju kursa', 'Zatvori', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
            return of(null);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Kurs je uspešno obrisan!', 'Zatvori', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.searchCourses();
          this.closeDetails();
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
          <mat-label>Šifra predmeta</mat-label>
          <input matInput formControlName="sifra_predmeta" placeholder="Unesite šifru predmeta">
          <mat-error *ngIf="courseForm.get('sifra_predmeta')?.hasError('required')">
            Šifra predmeta je obavezna
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
          <input matInput type="number" formControlName="godina_studija" placeholder="Godina studija">
          <mat-error *ngIf="courseForm.get('godina_studija')?.hasError('required')">
            Godina je obavezna
          </mat-error>
          <mat-error *ngIf="courseForm.get('godina_studija')?.hasError('min') || courseForm.get('godina_studija')?.hasError('max')">
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
    sifra_predmeta: ['', [Validators.required]],
    espb: ['', [Validators.required, Validators.min(1)]],
    semestar: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
    godina: ['', [Validators.required, Validators.min(1), Validators.max(4)]]
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.course) {
      this.courseForm.patchValue({
        naziv: this.data.course.naziv,
        sifra_predmeta: this.data.course.sifra,
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
