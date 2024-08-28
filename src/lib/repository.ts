import prisma from './db';
import { WriteBase64Image } from './utils';

// user functions

export const CheckIfUserExist = async (costumer_code: string) => {
  const exists = await prisma.customer.findFirst({
    where: {
      customer_code: Number(costumer_code)
    }
  });

  return !!exists;
};

export const CheckIfUserHasMeasures = async (costumer_code: string) => {
  const user = await prisma.customer.findFirst({
    where: {
      customer_code: Number(costumer_code)
    },
    include: {
      measures: true
    }
  });

  return user?.measures !== null;
};

export const CreateUserWithId = async (costumer_code: string) => {
  return await prisma.customer.create({
    data: {
      customer_code: Number(costumer_code)
    }
  });
};

export const GetUserById = async (costumer_code: string) => {
  return await prisma.customer.findFirst({
    where: {
      customer_code: Number(costumer_code)
    },
    include: {
      measures: true
    }
  });
};

export const GetUserByIdWithQuery = async (costumer_code: string, measure_type: string) => {
  return await prisma.customer.findFirst({
    where: {
      customer_code: Number(costumer_code)
    },
    include: {
      measures: {
        where: {
          measure_type: measure_type
        }
      }
    }
  });
};

// measure functions

export const CheckIfMeasureExistWithDate = async (
  measure_type: string,
  customer_code: string,
  measure_datetime: Date
) => {
  const exists = await prisma.measure.findFirst({
    where: {
      customerId: Number(customer_code),
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
  costumer_code: string,
  image: string,
  measure_datetime: Date,
  measure_type: string,
  measure_value: string
) => {
  const image_url = `http://localhost:3000/images/${WriteBase64Image(image)}`;

  return await prisma.measure.create({
    data: {
      customerId: Number(costumer_code),
      image_url: image_url,
      has_confirmed: false,
      measure_datetime: measure_datetime,
      measure_type: measure_type,
      measure_value: Number(measure_value)
    }
  });
};

// so pode chamar esse metodo apos verificar se esse uuid existe no banco
export const CheckIfMeasureValueIsConfirmed = async (measure_uuid: string) => {
  const measure = await prisma.measure.findUnique({
    where: {
      measure_uuid: measure_uuid
    },
    select: {
      has_confirmed: true
    }
  });

  return measure?.has_confirmed;
};

export const ConfirmMeasureValue = async (measure_uuid: string, confirmed_value: number) => {
  const measure = await prisma.measure.update({
    where: {
      measure_uuid: measure_uuid
    },
    data: {
      measure_value: confirmed_value,
      has_confirmed: true
    }
  });

  return measure;
};
