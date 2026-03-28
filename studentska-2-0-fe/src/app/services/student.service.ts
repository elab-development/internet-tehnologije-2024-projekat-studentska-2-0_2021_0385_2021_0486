import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/auth.models';
import { API_BASE } from '../constants/api-base';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/students`;

  getStudents(): Observable<{ data: Student[] }> {
    return this.http.get<{ data: Student[] }>(this.baseUrl);
  }

  getStudent(id: number): Observable<{ data: Student }> {
    return this.http.get<{ data: Student }>(`${this.baseUrl}/${id}`);
  }

  updateStudent(id: number, student: Partial<Student>): Observable<{ data: Student; message: string }> {
    return this.http.put<{ data: Student; message: string }>(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  generateConfirmationPdf(): Observable<Blob> {
    return this.http.get(`${API_BASE}/student-confirmation-pdf`, {
      responseType: 'blob'
    });
  }
}