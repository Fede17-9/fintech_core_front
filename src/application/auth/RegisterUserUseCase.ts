import { AuthRepository, RegisterParams } from '../../domain/repositories/AuthRepository';
import { User } from '../../domain/entities/User';

export class RegisterUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(params: RegisterParams): Promise<User> {
    return this.authRepository.register(params);
  }
}
