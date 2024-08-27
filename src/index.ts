import express, { Request, Response, NextFunction } from 'express';
import { ValidateUploadData } from './lib/utils';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ date: Date.UTC(2024) });
});

app.post('/upload', ValidateUploadData , (req: Request, res: Response) => {
  res.send('validation passed');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
