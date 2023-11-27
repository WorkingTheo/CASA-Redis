import { kms } from "./KMSService";

class KMSCryptoService {
  async encrypt(plaintext: string) {
    const params = {
      KeyId: 'alias/test_event_request_id',
      Plaintext: Buffer.from(plaintext),
    };
  
    try {
      const data = await kms.encrypt(params).promise();
      return data.CiphertextBlob;
    } catch (err) {
      console.error('Error encrypting data:', err);
      throw err;
    }
  }

  async decrypt(ciphertextBlob: any) {
    const params = {
      CiphertextBlob: Buffer.from(ciphertextBlob, 'base64'),
    };
  
    try {
      const data = await kms.decrypt(params).promise();
      return data.Plaintext.toString('utf8');
    } catch (err) {
      console.error('Error decrypting data:', err);
      throw err;
    }
  }
}

export default KMSCryptoService;
