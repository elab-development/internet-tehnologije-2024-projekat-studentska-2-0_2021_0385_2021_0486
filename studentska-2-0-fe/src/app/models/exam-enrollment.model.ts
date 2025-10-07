import { Course } from './course.model';
import { Student } from './auth.models';

export interface ExamEnrollment {
  id: number;
  datumPrijave: string; // Changed from datum_prijave to match backend
  ocena: number | null;
  // Relations (when populated by backend)
  student?: Student;
  kurs?: Course; // Changed from course to kurs to match backend
  
  // Legacy properties for backward compatibility
  student_id?: number;
  course_id?: number;
  datum_prijave?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  course?: Course;
}

export interface CreateExamEnrollmentPayload {
  course_id: number;
}

export interface UpdateExamEnrollmentPayload {
  id: number;
  status?: 'pending' | 'approved' | 'rejected';
  ocena?: number;
}