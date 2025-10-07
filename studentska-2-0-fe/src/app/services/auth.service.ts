import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, Student } from '../models/auth.models';
import { BehaviorSubject } from 'rxjs';
import { API_BASE } from '../constants/api-base';

const TOKEN_KEY = 'auth.token';
const STUDENT_KEY = 'auth.student';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _token$ = new BehaviorSubject<string | null>(this.restoreToken());
  private readonly _student$ = new BehaviorSubject<Student | null>(this.restoreStudent());

  // Public observables for components to consume (convert to signals in components if desired)
  readonly token$ = this._token$.asObservable();
  readonly student$ = this._student$.asObservable();

  // Synchronous access for guards/interceptors
  get tokenValue(): string | null { return this._token$.value; }
  get studentValue(): Student | null { return this._student$.value; }

  private restoreToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private restoreStudent(): Student | null {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as Student;
      return s;
    } catch {
      return null;
    }
  }

  private persist(token: string | null, student: Student | null): void {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
    if (student) localStorage.setItem(STUDENT_KEY, JSON.stringify(student)); else localStorage.removeItem(STUDENT_KEY);
  }

  register(payload: RegisterPayload) {
    return this.http.post<RegisterResponse>(`${API_BASE}/register`, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(`${API_BASE}/login`, payload);
  }

  handleLoginSuccess(res: LoginResponse) {
    const token = res.access_token;
    // Normalize student index field for consistent UI consumption
    const student: Student = {
      ...res.student,
    };
    this._token$.next(token);
    this._student$.next(student);
    this.persist(token, student);
  }

  logout() {
    return this.http.post(`${API_BASE}/logout`, {}).subscribe({
      next: () => this.clear(),
      error: () => this.clear(), // if token invalid, still clear locally
    });
  }

  clear() {
    this._token$.next(null);
    this._student$.next(null);
    this.persist(null, null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenValue;
  }
}
