import * as z from 'zod';
import { Base64 } from 'js-base64';

export const getZodErrorMessage = (error: z.ZodError): string[] => {
  const parsedMessage = JSON.parse(error.message) as Array<{ message: string }>;
  const zodError = parsedMessage.map((item) => item.message);
  return zodError;
};

export const UploadSchema = z.object({
  image: z
    .string({ required_error: 'A imagem é obrigatória' })
    .refine(Base64.isValid, 'Base64 inválido!'),
  customer_code: z
    .string({ required_error: 'Código do cliente é obrigatório' })
    .min(1, 'Codigo do Cliente não deve ser vazio!'),
  measure_datetime: z
    .string({ required_error: 'Data é obrigatória!' })
    // offsets podem ser adicionados com offset: true nesse objeto ⬇️
    .datetime({ message: 'Data deve ser no formato ISO 8601' }),
  measure_type: z.enum(['WATER', 'GAS'], { message: 'Tipo deve ser WATER ou GAS' })
});

export const ConfirmSchema = z.object({
  measure_uuid: z.string({ required_error: 'UUID da medição é obrigatório!' }),
  confirmed_value: z.number({ required_error: 'Valor é obrigatório!' })
});

export const ListParamsSchema = z.object({
  customer_code: z
    .string({ required_error: 'Código do cliente é obrigatório' })
    .min(1, 'Codigo do Cliente não deve ser vazio!'),
  measure_type: z
    .string()
    .refine((value) => {
      const upperCaseValue = value.toUpperCase();
      return ['WATER', 'GAS'].includes(upperCaseValue);
    }, 'Tipo deve ser WATER ou GAS')
    .optional()
});
