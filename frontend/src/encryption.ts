import CryptoJS from 'crypto-js';

const SECRET_KEY = 'Suresh_Singh';

export const encrypt = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString(); // Base64 string
};

export const decrypt = (ciphertext: string): any => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};
