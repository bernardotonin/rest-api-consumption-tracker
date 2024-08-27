import express, { Request, Response } from 'express';
import { ValidateUploadData } from './lib/utils';
import { ExtractTextFromImage } from './lib/gemini';


const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());

app.post('/upload', ValidateUploadData , async (req: Request, res: Response) => {
  const generatedContent = await ExtractTextFromImage(req.body.image, res)
  res.send({ response: generatedContent })
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
