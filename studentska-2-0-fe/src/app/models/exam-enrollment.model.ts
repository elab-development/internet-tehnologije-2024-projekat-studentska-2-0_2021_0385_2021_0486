import { Course } from './course.model';

export interface ExamEnrollment {
  id: number;
  datumPrijave: string; // Changed from datum_prijave to match backend
  ocena: number | null;
  kurs?: Course; // Changed from course to kurs to match backend
}

export interface CreateExamEnrollmentPayload {
  course_id: number;
}

export interface UpdateExamEnrollmentPayload {
  id: number;
  status?: 'pending' | 'approved' | 'rejected';
  ocena?: number;
}