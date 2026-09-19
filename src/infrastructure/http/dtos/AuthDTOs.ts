export interface RegisterUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserResponseDataDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDataDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
