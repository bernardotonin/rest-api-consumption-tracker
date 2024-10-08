import { GoogleGenerativeAI } from '@google/generative-ai';
import { ImageTypeRecord } from './utils';
import { configDotenv } from 'dotenv';

configDotenv();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
const model = gemini.getGenerativeModel({
  model: 'gemini-1.5-pro'
});

export const ExtractTextFromImage = async (image: string) => {
  const prompt =
    'This is a consumption meter, OCR only the characters that represent the consumption, just the numbers, any representantion of a measuring unit should be discarded. Remember that the characters refering to the consumption must be numbers!';
  let result;
  try {
    result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType: ImageTypeRecord[image[0]]
        }
      },
      {
        text: prompt
      }
    ]);
  } catch (error) {
    return false
  }

  return result.response.text();
};
