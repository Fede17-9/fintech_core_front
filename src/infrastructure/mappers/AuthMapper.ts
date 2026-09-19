import { User } from '../../domain/entities/User';
import { AuthSession } from '../../domain/entities/AuthSession';
import { RegisterUserResponseDataDTO, LoginResponseDataDTO } from '../http/dtos/AuthDTOs';

export class AuthMapper {
  static toUserDomain(dto: RegisterUserResponseDataDTO): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      createdAt: dto.createdAt,
    };
  }

  static toSessionDomain(dto: LoginResponseDataDTO): AuthSession {
    return {
      token: dto.token,
      user: {
        id: dto.user.id,
        name: dto.user.name,
        email: dto.user.email,
      },
    };
  }
}
