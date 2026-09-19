import { AuthRepository, RegisterParams, LoginParams } from '../../domain/repositories/AuthRepository';
import { User } from '../../domain/entities/User';
import { AuthSession } from '../../domain/entities/AuthSession';
import { apiClient } from '../http/ApiClient';
import { RegisterUserResponseDataDTO, LoginResponseDataDTO, RegisterUserRequestDTO, LoginRequestDTO } from '../http/dtos/AuthDTOs';
import { AuthMapper } from '../mappers/AuthMapper';

export class ApiAuthRepository implements AuthRepository {
  async register(params: RegisterParams): Promise<User> {
    const dto = await apiClient.post<RegisterUserResponseDataDTO, RegisterUserRequestDTO>(
      '/api/auth/register',
      params
    );
    return AuthMapper.toUserDomain(dto);
  }

  async login(params: LoginParams): Promise<AuthSession> {
    const dto = await apiClient.post<LoginResponseDataDTO, LoginRequestDTO>(
      '/api/auth/login',
      params
    );
    return AuthMapper.toSessionDomain(dto);
  }
}
