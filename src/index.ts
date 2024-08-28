import express, { Request, Response } from 'express';
import { ValidateConfirmData, ValidateListParams, ValidateUploadData } from './lib/utils';
import { ExtractTextFromImage } from './lib/gemini';
import {
  CheckIfMeasureExist,
  CheckIfMeasureExistWithDate,
  CheckIfMeasureValueIsConfirmed,
  CheckIfUserExist,
  CheckIfUserHasMeasures,
  ConfirmMeasureValue,
  CreateMeasure,
  CreateUserWithId,
  GetUserById,
  GetUserByIdWithQuery
} from './lib/repository';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());

app.post('/upload', ValidateUploadData, async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const UserExists = await CheckIfUserExist(customer_code);

  const MeasureExists = await CheckIfMeasureExistWithDate(
    measure_type,
    customer_code,
    new Date(measure_datetime)
  );

  if (MeasureExists) {
    res.status(409).send({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura desse mês já realizada!'
    });
  }

  if (!UserExists) {
    await CreateUserWithId(customer_code);
  }

  const generatedOCRContent = await ExtractTextFromImage(image);

  if (generatedOCRContent === false) {
    res.status(400).send({
      error: 'Error with Gemini LLM',
      error_description: 'Check your api key'
    });
  }
  let createdMeasure;
  if (typeof generatedOCRContent === 'string') {
    createdMeasure = await CreateMeasure(
      customer_code,
      image,
      measure_datetime,
      measure_type,
      generatedOCRContent
    );
  }

  if (createdMeasure) {
    res.status(200).send({
      image_url: createdMeasure.image_url,
      measure_value: createdMeasure.measure_value,
      measure_uuid: createdMeasure.measure_uuid
    });
  }
});

app.patch('/confirm', ValidateConfirmData, async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  const exists = await CheckIfMeasureExist(measure_uuid);

  if (!exists) {
    res.status(404).send({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Medição não encontrada!'
    });
  }

  const isConfirmed = await CheckIfMeasureValueIsConfirmed(measure_uuid);

  if (isConfirmed) {
    res.status(409).send({
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada!'
    });
  }

  const updateMeasure = await ConfirmMeasureValue(measure_uuid, Number(confirmed_value));

  if (updateMeasure.measure_value !== confirmed_value) {
    res.status(400).send({
      success: false
    });
  }

  if (updateMeasure.measure_value === confirmed_value) {
    res.status(200).send({
      success: true
    });
  }
});

app.get('/:customer_code/list', ValidateListParams, async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  const UserExists = await CheckIfUserExist(customer_code);

  if (!UserExists) {
    res.status(404).send({
      error_code: 'USER_NOT_FOUND',
      error_description: 'Esse usuário não existe!'
    });
  }

  const UserHasMeasures = CheckIfUserHasMeasures(customer_code);

  if (!UserHasMeasures) {
    res.status(404).send({
      error_code: 'MEASURES_NOT_FOUND',
      error_description: '"Nenhuma leitura encontrada!'
    });
  }

  let userData;
  if (measure_type) {
    userData = await GetUserByIdWithQuery(customer_code, String(measure_type).toUpperCase());
  }

  if (!measure_type) {
    userData = await GetUserById(customer_code);
  }


  res.status(200).send(userData);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
