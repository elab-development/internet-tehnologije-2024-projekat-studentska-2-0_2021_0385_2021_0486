export type RegisterPayload = {
  ime: string;
  prezime: string;
  broj_indeksa: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type Student = {
  id?: number;
  ime: string;
  prezime: string;
  brojIndeksa?: string;
  email: string;
  status?: string;
  uloga?: string; // role
};

export type LoginResponse = {
  access_token: string;
  token_type: 'Bearer';
  student: Student;
};

export type RegisterResponse = {
  message: string;
  student: Student;
};
