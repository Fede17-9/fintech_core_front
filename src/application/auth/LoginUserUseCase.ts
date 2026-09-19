import { AuthRepository, LoginParams } from '../../domain/repositories/AuthRepository';
import { AuthSession } from '../../domain/entities/AuthSession';

export class LoginUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<AuthSession> {
    return this.authRepository.login(params);
  }
}
