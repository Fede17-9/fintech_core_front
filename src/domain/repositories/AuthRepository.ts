import { User } from '../entities/User';
import { AuthSession } from '../entities/AuthSession';

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthRepository {
  register(params: RegisterParams): Promise<User>;
  login(params: LoginParams): Promise<AuthSession>;
}
