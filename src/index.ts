import express, { Request, Response } from 'express';
import { ValidateUploadData } from './lib/utils';
import { ExtractTextFromImage } from './lib/gemini';
import {
  CheckIfMeasureExistWithDate,
  CheckIfUserExist,
  CreateMeasure,
  CreateUserWithId
} from './lib/repository';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());

app.post('/upload', ValidateUploadData, async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const UserExists = await CheckIfUserExist(Number(customer_code));

  const MeasureExists = await CheckIfMeasureExistWithDate(
    measure_type,
    Number(customer_code),
    new Date(measure_datetime)
  );

  if (MeasureExists) {
    res.send({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura desse mês já realizada!'
    });
  }

  if (!UserExists) {
    await CreateUserWithId(Number(customer_code));
  }

  const generatedOCRContent = await ExtractTextFromImage(image, res);

  const createdMeasure = await CreateMeasure(
    Number(customer_code),
    image,
    measure_datetime,
    measure_type,
    Number(generatedOCRContent)
  );

  if (createdMeasure) {
    res.send({
      image_url: createdMeasure.image_url,
      measure_value: createdMeasure.measure_value,
      measure_uuid: createdMeasure.measure_uuid
    });
  }
});

app.patch('/confirm')

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
