import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z
    .string({ required_error: 'El nombre completo es requerido' })
    .min(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre completo no puede exceder 100 caracteres' }),
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email({ message: 'Formato de correo electrónico inválido' }),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, { message: 'La contraseña debe tener mínimo 8 caracteres' }),
});

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email({ message: 'Formato de correo electrónico inválido' }),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(1, { message: 'La contraseña no puede estar vacía' }),
});

export type RegisterUserFormValues = z.infer<typeof RegisterUserSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
