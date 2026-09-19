import { z } from 'zod';

export const TransferMoneySchema = z.object({
  sourceAccountId: z
    .string({ required_error: 'La cuenta de origen es requerida' })
    .uuid({ message: 'ID de cuenta de origen debe ser un UUID válido' }),
  destinationAccountId: z
    .string({ required_error: 'La cuenta de destino es requerida' })
    .uuid({ message: 'ID de cuenta de destino debe ser un UUID válido' }),
  amount: z
    .number({ required_error: 'El monto es requerido' })
    .positive({ message: 'El monto a transferir debe ser un número estrictamente mayor a cero' }),
  description: z
    .string()
    .max(100, { message: 'La descripción no puede exceder los 100 caracteres' })
    .optional(),
});

export const DepositMoneySchema = z.object({
  accountId: z
    .string({ required_error: 'La cuenta es requerida' })
    .uuid({ message: 'ID de cuenta debe ser un UUID válido' }),
  amount: z
    .number({ required_error: 'El monto es requerido' })
    .positive({ message: 'El monto a depositar debe ser un número estrictamente mayor a cero' }),
});

export const WithdrawalMoneySchema = z.object({
  accountId: z
    .string({ required_error: 'La cuenta es requerida' })
    .uuid({ message: 'ID de cuenta debe ser un UUID válido' }),
  amount: z
    .number({ required_error: 'El monto es requerido' })
    .positive({ message: 'El monto a retirar debe ser un número estrictamente mayor a cero' }),
});

export type TransferFormValues = z.infer<typeof TransferMoneySchema>;
export type DepositFormValues = z.infer<typeof DepositMoneySchema>;
export type WithdrawalFormValues = z.infer<typeof WithdrawalMoneySchema>;
