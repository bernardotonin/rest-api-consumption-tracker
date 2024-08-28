import prisma from './db';
import { WriteBase64Image } from './utils';

// user functions

export const CheckIfUserExist = async (costumer_code: number) => {
  const exists = await prisma.customer.findFirst({
    where: {
      customer_code: costumer_code
    }
  });

  return !!exists;
};

export const CreateUserWithId = async (costumer_code: number) => {
  return await prisma.customer.create({
    data: {
      customer_code: costumer_code
    }
  });
};

// measure functions

export const CheckIfMeasureExistWithDate = async (
  measure_type: string,
  customer_code: number,
  measure_datetime: Date
) => {
  const exists = await prisma.measure.findFirst({
    where: {
      customerId: customer_code,
      measure_type: measure_type,
      measure_datetime: {
        gte: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1),
        lt: new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 1)
      }
    }
  });
  return !!exists;
};

export const CheckIfMeasureExist = async (measure_uuid: string) => {
  const exists = await prisma.measure.findFirst({
    where: {
      measure_uuid: measure_uuid
    }
  });
  return !!exists;
};

export const CreateMeasure = async (
  costumer_code: number,
  image: string,
  measure_datetime: Date,
  measure_type: string,
  measure_value: number
) => {
  const image_url = `http://localhost:3000/images/${WriteBase64Image(image)}`;

  return await prisma.measure.create({
    data: {
      customerId: costumer_code,
      image_url: image_url,
      has_confirmed: false,
      measure_datetime: measure_datetime,
      measure_type: measure_type,
      measure_value: measure_value
    }
  });
};
