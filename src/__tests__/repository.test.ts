import {
  CheckIfMeasureValueIsConfirmed,
  CheckIfUserExist,
  CheckIfUserHasMeasures,
  ConfirmMeasureValue,
  CreateMeasure,
  CreateUserWithId,
  GetUserById
} from '../lib/repository';

// nao funcionaria para produçao, porem o tempo ta curto
describe('Repository Tests', () => {
  beforeAll(async () => {
    let exists = await CheckIfUserExist('999');
    if (!exists) {
      CreateUserWithId('999');
    }

    exists = await CheckIfUserExist('8888');

    if (!exists) {
      CreateUserWithId('8888');
    }
  });

  it('should return the user with id 999', async () => {
    const user = await GetUserById('999');
    expect(user).toHaveProperty('customer_code', 999);
  });

  it('should check if a user exists and fail', async () => {
    const exists = await CheckIfUserExist('421a');
    expect(exists).toBe(false);
  });

  it('should check if a user exists and pass', async () => {
    const exists = await CheckIfUserExist('999');
    expect(exists).toBe(true);
  });

  it('should check if a user has measures', async () => {
    const hasMeasures = await CheckIfUserHasMeasures('8888');
    expect(hasMeasures).toBe(false);
  });

  it('should create a user with a random id', async () => {
    const id = Math.floor(Math.random() * 9000) + 1000;
    const user = await CreateUserWithId(String(id));
    expect(user).toHaveProperty('customer_code', id);
  });

  it('should create a measure for the customer code 999', async () => {
    const measure = await CreateMeasure('999', 'imagestring', new Date(), 'WATER', '14500');
    expect(measure).toHaveProperty('customerId', 999);
    expect(measure).toHaveProperty('has_confirmed', false);
  });

  it('should confirm a measure value', async () => {
    const measure = await CreateMeasure('999', 'imagestring', new Date(), 'WATER', '14500');
    const confirmedMeasure = await ConfirmMeasureValue(measure.measure_uuid, 1000);
    expect(confirmedMeasure).toHaveProperty('has_confirmed', true);
  });

  it('should check if a measure is confirmed', async () => {
    const measure = await CreateMeasure('999', 'imagestring', new Date(), 'WATER', '14500');
    const isConfirmed = await CheckIfMeasureValueIsConfirmed(measure.measure_uuid)
    expect(isConfirmed).toBe(false);
  });
});
