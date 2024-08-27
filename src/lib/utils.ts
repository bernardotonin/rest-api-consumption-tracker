import { Request, Response, NextFunction } from 'express';
import { getZodErrorMessage, UploadSchema } from './schemas';

export const ImageExtensionRecord: Record<string, string> = {
  '/': 'image/jpeg',
  i: 'image/png',
  U: 'image/webp'
};

export const ValidateUploadData = (req: Request, res: Response, next: NextFunction) => {
  const validatedBody = UploadSchema.safeParse(req.body);

  if (!validatedBody.success) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: getZodErrorMessage(validatedBody.error)
    });
  }

  if(ImageExtensionRecord[validatedBody.data.image[0]] === undefined){
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Apenas imagems em formato JPEG, PNG ou WEBP são aceitas.'
    });
  }

  next();
};
