import { User } from './User';

export interface AuthSession {
  token: string;
  user: User;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error';
