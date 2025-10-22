export interface RegisterPayload {
  ime: string;
  prezime: string;
  broj_indeksa: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Student {
  id?: number;
  ime: string;
  prezime: string;
  brojIndeksa?: string;
  email: string;
  status?: string;
  uloga?: string; // role
}

export interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
  student: Student;
}

export interface RegisterResponse {
  message: string;
  student: Student;
}
