import CryptoJS from "crypto-js";

const KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "unicopag-dev";

export const encrypt = (t: string): string => CryptoJS.AES.encrypt(t, KEY).toString();
export const decrypt = (t: string): string => {
  const bytes = CryptoJS.AES.decrypt(t, KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
