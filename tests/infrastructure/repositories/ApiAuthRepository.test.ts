import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiAuthRepository } from '../../../src/infrastructure/repositories/ApiAuthRepository';
import { apiClient } from '../../../src/infrastructure/http/ApiClient';

describe('ApiAuthRepository', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('register y login delegan en apiClient.post', async () => {
    const mockPost = vi.spyOn(apiClient, 'post')
      .mockResolvedValueOnce({ id: 'u-1', name: 'Ana', email: 'ana@test.com', createdAt: '2026-09-19T00:00:00Z' })
      .mockResolvedValueOnce({ token: 'jwt-ana', user: { id: 'u-1', name: 'Ana', email: 'ana@test.com' } });

    const authRepo = new ApiAuthRepository();

    const user = await authRepo.register({ name: 'Ana', email: 'ana@test.com', password: 'password123' });
    const session = await authRepo.login({ email: 'ana@test.com', password: 'password123' });

    expect(user.email).toBe('ana@test.com');
    expect(session.token).toBe('jwt-ana');
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
