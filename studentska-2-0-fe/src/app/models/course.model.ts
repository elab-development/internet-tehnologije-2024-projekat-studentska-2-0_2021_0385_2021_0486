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
  sifra_predmeta: string;
  espb: number;
  semestar?: number;
  godina?: number;
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {
  id: number;
}

export interface CourseSearchParams {
  naziv?: string;
  sifra_predmeta?: string;
  espb?: number;
  semestar?: number;
  godina?: number;
  espb_min?: number;
  espb_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CourseSearchResponse {
  data: Course[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  message: string;
}