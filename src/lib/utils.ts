import { Request, Response, NextFunction } from 'express';
import { getZodErrorMessage, UploadSchema } from './schemas';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const ImageTypeRecord: Record<string, string> = {
  '/': 'image/jpeg',
  i: 'image/png',
  U: 'image/webp'
};

export const ImageExtensionRecord: Record<string, string> = {
  '/': 'jpeg',
  i: 'png',
  U: 'webp'
};

const GenerateUniqueImageName = (base64string: string) => {
  return crypto.createHash('md5').update(base64string).digest('hex');
};

export const WriteBase64Image = (base64string: string) => {
  const buffer = Buffer.from(base64string, 'base64');

  const fileName = `${GenerateUniqueImageName(base64string)}.${ImageExtensionRecord[base64string[0]]}`

  const filePath = path.join(
    __dirname,
    '../../public/images',
    fileName
  );

  fs.writeFileSync(filePath, buffer);
  return fileName;
};

export const ValidateUploadData = (req: Request, res: Response, next: NextFunction) => {
  const validatedBody = UploadSchema.safeParse(req.body);

  if (!validatedBody.success) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: getZodErrorMessage(validatedBody.error)
    });
  }

  if (ImageTypeRecord[validatedBody.data.image[0]] === undefined) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Apenas imagems em formato JPEG, PNG ou WEBP são aceitas.'
    });
  }

  next();
};
