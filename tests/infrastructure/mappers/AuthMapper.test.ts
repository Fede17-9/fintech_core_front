import { describe, it, expect } from 'vitest';
import { AuthMapper } from '../../../src/infrastructure/mappers/AuthMapper';

describe('AuthMapper', () => {
  it('mapea de RegisterUserResponseDataDTO a User domain', () => {
    const dto = {
      id: 'u-10',
      name: 'Carlos Ruiz',
      email: 'carlos@test.com',
      createdAt: '2026-09-19T10:00:00Z',
    };
    const user = AuthMapper.toUserDomain(dto);
    expect(user).toEqual({
      id: 'u-10',
      name: 'Carlos Ruiz',
      email: 'carlos@test.com',
      createdAt: '2026-09-19T10:00:00Z',
    });
  });

  it('mapea de LoginResponseDataDTO a AuthSession domain', () => {
    const dto = {
      token: 'token-abc',
      user: {
        id: 'u-10',
        name: 'Carlos Ruiz',
        email: 'carlos@test.com',
      },
    };
    const session = AuthMapper.toSessionDomain(dto);
    expect(session).toEqual({
      token: 'token-abc',
      user: {
        id: 'u-10',
        name: 'Carlos Ruiz',
        email: 'carlos@test.com',
      },
    });
  });
});
