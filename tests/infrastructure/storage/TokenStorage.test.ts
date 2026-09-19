import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TokenStorage } from '../../../src/infrastructure/storage/TokenStorage';

describe('TokenStorage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    TokenStorage.removeToken();
  });

  it('guarda, recupera y elimina tokens en localStorage', () => {
    TokenStorage.setToken('auth-token-123');
    expect(TokenStorage.getToken()).toBe('auth-token-123');

    TokenStorage.removeToken();
    expect(TokenStorage.getToken()).toBeNull();
  });

  it('captura excepciones de localStorage de manera segura devolviendo null o ignorando errores', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });

    expect(TokenStorage.getToken()).toBeNull();
    expect(() => TokenStorage.setToken('token')).not.toThrow();
    expect(() => TokenStorage.removeToken()).not.toThrow();
  });
});
