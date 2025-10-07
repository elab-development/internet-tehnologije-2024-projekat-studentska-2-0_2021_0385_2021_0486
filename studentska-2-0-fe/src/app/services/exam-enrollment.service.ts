import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExamEnrollment, CreateExamEnrollmentPayload, UpdateExamEnrollmentPayload } from '../models/exam-enrollment.model';
import { API_BASE } from '../constants/api-base';

@Injectable({ providedIn: 'root' })
export class ExamEnrollmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/enroll`;

  getExamEnrollments(): Observable<ExamEnrollment[]> {
    return this.http.get<ExamEnrollment[] | { data: ExamEnrollment[] }>(this.baseUrl).pipe(
      map((response: ExamEnrollment[] | { data: ExamEnrollment[] }) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getExamEnrollment(id: number): Observable<ExamEnrollment> {
    return this.http.get<ExamEnrollment>(`${this.baseUrl}/${id}`);
  }

  createExamEnrollment(enrollment: CreateExamEnrollmentPayload): Observable<ExamEnrollment> {
    return this.http.post<ExamEnrollment | { data: ExamEnrollment }>(this.baseUrl, enrollment).pipe(
      map((response: ExamEnrollment | { data: ExamEnrollment }) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response as ExamEnrollment;
      })
    );
  }

  updateExamEnrollment(enrollment: UpdateExamEnrollmentPayload): Observable<ExamEnrollment> {
    return this.http.put<ExamEnrollment>(`${this.baseUrl}/${enrollment.id}`, enrollment);
  }

  deleteExamEnrollment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}