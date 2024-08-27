import * as z from 'zod';
import { Base64 } from 'js-base64';

export const getZodErrorMessage = (error: z.ZodError): string[] => {
  const parsedMessage = JSON.parse(error.message) as Array<{ message: string }>;
  const zodError = parsedMessage.map((item) => item.message);
  return zodError;
};

export const UploadSchema = z.object({
  image: z.string({ required_error: 'A imagem é obrigatória' }).refine(Base64.isValid, 'Base64 inválido!'),
  customer_code: z.string({ required_error: 'Código do cliente é obrigatório' }),
  measure_datetime: z
    .string({ required_error: 'Data é obrigatória!' })
    // offsets podem ser adicionados com offset: true nesse objeto ⬇️
    .datetime({ message: 'Data deve ser no formato ISO 8601' }),
  measure_type: z.enum(['WATER', 'GAS'], { message: 'Tipo deve ser WATER ou GAS' })
});
