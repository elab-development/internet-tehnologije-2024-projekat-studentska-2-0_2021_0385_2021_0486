import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CourseService, ExamEnrollmentService } from '../../services';
import { Course, ExamEnrollment } from '../../models';
import { catchError, finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-prijava-ispita',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './prijava-ispita.html',
  styleUrl: './prijava-ispita.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrijavaIspita implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly examEnrollmentService = inject(ExamEnrollmentService);

  // Signals for reactive state management
  readonly courses = signal<Course[]>([]);
  readonly enrollments = signal<ExamEnrollment[]>([]);
  readonly isLoading = signal(false);
  readonly isProcessing = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');

  // Computed values
  readonly filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.courses();
    
    return this.courses().filter(course => 
      course.naziv.toLowerCase().includes(term)
    );
  });

  readonly myEnrollments = computed(() => {
    return this.enrollments().filter(enrollment => enrollment.kurs || enrollment.course);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    console.log('Loading courses and enrollments...');

    forkJoin({
      courses: this.courseService.getCourses().pipe(catchError((err) => {
        console.error('Error loading courses:', err);
        if (err.status === 401) {
          this.error.set('Niste ulogovani. Molimo prijavite se da vidite dostupne predmete.');
        }
        return of([]);
      })),
      enrollments: this.examEnrollmentService.getExamEnrollments().pipe(catchError((err) => {
        console.error('Error loading enrollments:', err);
        return of([]);
      }))
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: ({ courses, enrollments }) => {
        console.log('Loaded courses:', courses);
        console.log('Loaded enrollments:', enrollments);
        this.courses.set(courses);
        this.enrollments.set(enrollments);
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.error.set('Greška pri učitavanju podataka. Molimo pokušajte ponovo.');
      }
    });
  }

  loadCourses(): void {
    this.loadData();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  isEnrolled(courseId: number): boolean {
    return this.enrollments().some(enrollment => {
      const enrollmentCourseId = enrollment.kurs?.id || enrollment.course?.id || enrollment.course_id;
      return enrollmentCourseId === courseId && (enrollment.status !== 'rejected' || !enrollment.status);
    });
  }

  enrollInCourse(courseId: number): void {
    if (this.isProcessing()) return;

    this.isProcessing.set(true);
    this.error.set(null);

    console.log('Enrolling in course:', courseId);

    this.examEnrollmentService.createExamEnrollment({ course_id: courseId })
      .pipe(finalize(() => this.isProcessing.set(false)))
      .subscribe({
        next: (enrollment) => {
          console.log('Enrollment successful:', enrollment);
          // Add the new enrollment to the list
          const currentEnrollments = this.enrollments();
          const course = this.courses().find(c => c.id === courseId);
          
          const newEnrollment: ExamEnrollment = {
            ...enrollment,
            kurs: course, // Use kurs to match backend
            course: course // Keep for backward compatibility
          };
          
          this.enrollments.set([...currentEnrollments, newEnrollment]);
        },
        error: (err) => {
          console.error('Full error object:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.error);
          
          let errorMessage = 'Greška pri prijavi ispita. Molimo pokušajte ponovo.';
          
          if (err.status === 401) {
            errorMessage = 'Niste autentifikovani. Molimo prijavite se ponovo.';
          } else if (err.status === 422) {
            errorMessage = 'Neispravni podaci za prijavu.';
          } else if (err.status === 409) {
            errorMessage = 'Već ste prijavljeni na ovaj ispit.';
          } else if (err.status === 404) {
            errorMessage = 'Endpoint za prijavu ispita nije još implementiran u backend-u.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          this.error.set(errorMessage);
        }
      });
  }

  unenrollFromCourse(courseId: number): void {
    if (this.isProcessing()) return;

    const enrollment = this.enrollments().find(e => {
      const enrollmentCourseId = e.kurs?.id || e.course?.id || e.course_id;
      return enrollmentCourseId === courseId;
    });
    if (!enrollment) return;

    this.isProcessing.set(true);
    this.error.set(null);

    this.examEnrollmentService.deleteExamEnrollment(enrollment.id)
      .pipe(finalize(() => this.isProcessing.set(false)))
      .subscribe({
        next: () => {
          // Remove the enrollment from the list
          const updatedEnrollments = this.enrollments().filter(e => e.id !== enrollment.id);
          this.enrollments.set(updatedEnrollments);
        },
        error: (err) => {
          console.error('Error unenrolling from course:', err);
          this.error.set('Greška pri odjavi ispita. Molimo pokušajte ponovo.');
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEnrollmentCourse(enrollment: ExamEnrollment): Course | undefined {
    return enrollment.kurs || enrollment.course;
  }

  getEnrollmentDate(enrollment: ExamEnrollment): string {
    return enrollment.datumPrijave || enrollment.datum_prijave || '';
  }
}
