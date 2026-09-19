import { describe, it, expect } from 'vitest';
import { ApiError } from '../../../src/domain/errors/ApiError';

describe('ApiError Domain Unit Tests', () => {
  it('asignar correctamente sus campos y nombre de error', () => {
    const error = new ApiError('Transacción fallida', 400, 'INSUFFICIENT_FUNDS', [
      { field: 'amount', message: 'El monto excede el saldo disponible' },
    ]);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Transacción fallida');
    expect(error.httpStatus).toBe(400);
    expect(error.code).toBe('INSUFFICIENT_FUNDS');
    expect(error.errors).toHaveLength(1);
    expect(error.errors?.[0]).toEqual({
      field: 'amount',
      message: 'El monto excede el saldo disponible',
    });
  });

  it('soporta errores opcionales sin errores de campo', () => {
    const error = new ApiError('No autorizado', 401, 'UNAUTHORIZED');
    expect(error.httpStatus).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.errors).toBeUndefined();
  });
});
