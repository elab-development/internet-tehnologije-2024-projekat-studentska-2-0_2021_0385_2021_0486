export interface Course {
  id: number;
  naziv: string;
  sifra?: string;
  espb: number;
  semestar?: number;
  godina?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCoursePayload {
  naziv: string;
  espb: number;
  semestar: number;
  godina: number;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  id: number;
}