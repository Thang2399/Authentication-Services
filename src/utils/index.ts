import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltOrRounds);
  return hashPassword;
};

export const comparePassword = async (
  originalPassword: string,
  password: string,
) => {
  return await bcrypt.compare(password, originalPassword);
};

export const getFutureTimestamp = (
  numberOfHoursFromNow = 1,
  unit: dayjs.ManipulateType = 'hour',
) => {
  const currentTime = dayjs();
  // Add 1 hour to the current time
  const futureTime = currentTime.add(numberOfHoursFromNow, `${unit}`);

  // Convert the future time to a Unix timestamp
  const timestamp = futureTime.unix();
  return timestamp;
};

export const checkTokenExpireOrNot = (tokenExpiredTime: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenExpiredTime !== 0 && currentTime < tokenExpiredTime;
};
