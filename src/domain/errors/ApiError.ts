export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  status: 'fail' | 'error';
  code: string;
  message: string;
  errors?: FieldError[];
}

export class ApiError extends Error {
  readonly httpStatus: number;
  readonly code: string;
  readonly errors?: FieldError[];

  constructor(message: string, httpStatus: number, code: string, errors?: FieldError[]) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.code = code;
    this.errors = errors;
  }
}
