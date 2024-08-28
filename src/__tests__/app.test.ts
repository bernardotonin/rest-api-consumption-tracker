import request from 'supertest';
import { app } from '../app';
import { pngImage } from '../lib/b64images';

describe('App Tests', () => {
  describe('POST /upload', () => {
    // testar isso sem mockar o OCR e muito chato
    it('should create a new measure with user id 1002', async () => {
      const requestBody = {
        image: pngImage,
        measure_datetime: '2020-03-28T01:54:26Z',
        measure_type: 'WATER',
        customer_code: '1002'
      };
      const response = await request(app).post('/upload').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('measure_uuid');
    });

    it('should try to create a new measure with invalid data', async () => {
      const requestBody = {
        image: '',
        measure_datetime: '202-03-T01:54:26Z',
        measure_type: 'ELETRICITY',
        customer_code: `402a`
      };
      const response = await request(app).post('/upload').send(requestBody);
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error_description');
    });

    it('should try to create a duplicate measure', async () => {
      const requestBody = {
        image: pngImage,
        measure_datetime: '2020-03-28T01:54:26Z',
        measure_type: 'WATER',
        customer_code: '1002'
      };
      const response = await request(app).post('/upload').send(requestBody);
  
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error_description');
    });
  });

  describe('PATCH /confirm', () => {
    it('should confirm a measure', async () => {
      const CreateMeasureRequestBody = {
        image: pngImage,
        measure_datetime: '2024-10-28T01:54:26Z',
        measure_type: 'WATER',
        customer_code: '1000'
      };
      const createMeasureResponse = await request(app)
        .post('/upload')
        .send(CreateMeasureRequestBody);

      const ConfirmMeasureBody = {
        measure_uuid: createMeasureResponse.body.measure_uuid,
        confirmed_value: 1000
      };

      const confirmMeasureResponse = await request(app).patch('/confirm').send(ConfirmMeasureBody);

      expect(confirmMeasureResponse.status).toBe(200);
      expect(confirmMeasureResponse.body).toHaveProperty('success');
    });
    it('should try to confirm a measure that has already been confirmed', async () => {
      const CreateMeasureRequestBody = {
        image: pngImage,
        measure_datetime: '2024-10-28T01:54:26Z',
        measure_type: 'WATER',
        customer_code: '1000'
      };
      const createMeasureResponse = await request(app).post('/upload').send(CreateMeasureRequestBody);

      const ConfirmMeasureBody = {
        measure_uuid: createMeasureResponse.body.measure_uuid,
        confirmed_value: 1000
      };

      await request(app).patch('/confirm').send(ConfirmMeasureBody);

      const ReconfirmMeasureResponse = await request(app).patch('/confirm').send(ConfirmMeasureBody);

      expect(ReconfirmMeasureResponse.statusCode).toBe(409);
      expect(ReconfirmMeasureResponse.body).toHaveProperty('error_code');
    });
    it('should try to confirm a measure with wrong data', async () => {
      const ConfirmMeasureBody = {
        measure_uuid: '',
        confirmed_value: 'a'
      };

      const ConfirmMeasureResponse = await request(app).patch('/confirm').send(ConfirmMeasureBody);

      expect(ConfirmMeasureResponse.statusCode).toBe(400);
      expect(ConfirmMeasureResponse.body).toHaveProperty('error_code');
    });
    it('should try to confirm a measure that does not exist', async () => {
      const ConfirmMeasureBody = {
        measure_uuid: 'a',
        confirmed_value: 1000
      };

      const ConfirmMeasureResponse = await request(app).patch('/confirm').send(ConfirmMeasureBody);

      expect(ConfirmMeasureResponse.statusCode).toBe(404);
      expect(ConfirmMeasureResponse.body).toHaveProperty('error_code');
    });
  });

  describe('GET /<customer_id>/list', () => {
    it('should try to list with a invalid query parameter', async () => {

      const response = await request(app).get('/1/list?measure_type=a')
    
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error_code');
    });

    it('should try to get record that doesnt exists', async () => {
      const response = await request(app).get('/1233/list?measure_type=water')
    
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error_code');
    });

    it('should get records', async () => {

      const response = await request(app).get('/1/list')
    
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('customer_code');
    });

  })
});
