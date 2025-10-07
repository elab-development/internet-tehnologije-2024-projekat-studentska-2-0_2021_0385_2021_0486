import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { API_BASE } from '../constants/api-base';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE}/courses`;

  getCourses(): Observable<Course[]> {
    console.log('Making GET request to:', this.baseUrl);
    return this.http.get<Course[] | { data: Course[] }>(this.baseUrl).pipe(
      map((response: Course[] | { data: Course[] }) => {
        // Handle Laravel resource format
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        // Handle direct array format
        return Array.isArray(response) ? response : [];
      })
    );
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`);
  }

  createCourse(course: CreateCoursePayload): Observable<{ data: Course; message: string }> {
    return this.http.post<{ data: Course; message: string }>(this.baseUrl, course);
  }

  updateCourse(course: UpdateCoursePayload): Observable<{ data: Course; message: string }> {
    return this.http.put<{ data: Course; message: string }>(`${this.baseUrl}/${course.id}`, course);
  }

  deleteCourse(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}