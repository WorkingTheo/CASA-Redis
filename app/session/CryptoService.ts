import CryptoJS, { AES } from "crypto-js";

class CryptoService {
  secretKey: string;

  generateSecretKey = (): string => {
    const keyLength = 32; // 32 bytes = 256 bits (AES-256)
    const buffer = new Uint8Array(keyLength);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  };

  constructor() {
    this.secretKey = this.generateSecretKey();
  }

  encrypt(data: any) {
    const encryptedData = AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string) {
    const decryptedData = AES.decrypt(encryptedData, this.secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}

export default CryptoService;
