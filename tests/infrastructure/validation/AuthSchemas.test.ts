import { describe, it, expect } from 'vitest';
import { LoginSchema, RegisterUserSchema } from '../../../src/infrastructure/validation/AuthSchemas';

describe('AuthSchemas', () => {
  it('LoginSchema rechaza emails inválidos o contraseñas vacías', () => {
    const invalidEmail = LoginSchema.safeParse({ email: 'invalid-email', password: '123' });
    expect(invalidEmail.success).toBe(false);

    const emptyPass = LoginSchema.safeParse({ email: 'user@test.com', password: '' });
    expect(emptyPass.success).toBe(false);

    const valid = LoginSchema.safeParse({ email: 'user@test.com', password: 'password' });
    expect(valid.success).toBe(true);
  });

  it('RegisterUserSchema valida min 3 caracteres para nombre y min 8 para contraseña', () => {
    const shortName = RegisterUserSchema.safeParse({ name: 'Ab', email: 'user@test.com', password: '12345678' });
    expect(shortName.success).toBe(false);

    const shortPass = RegisterUserSchema.safeParse({ name: 'Juan', email: 'user@test.com', password: '123' });
    expect(shortPass.success).toBe(false);

    const valid = RegisterUserSchema.safeParse({ name: 'Juan Perez', email: 'user@test.com', password: '12345678' });
    expect(valid.success).toBe(true);
  });
});
