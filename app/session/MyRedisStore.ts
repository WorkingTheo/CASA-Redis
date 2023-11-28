import RedisStore from "connect-redis";
import { SessionData } from "express-session";
import CryptoService from "./CryptoService";
import KMSCryptoService from "./KMSCryptoService";

interface Serializer {
  parse(s: string): SessionData | Promise<SessionData>;
  stringify(s: SessionData): string;
}

interface RedisStoreOptions {
  client: any;
  prefix?: string;
  scanCount?: number;
  serializer?: Serializer;
  ttl?: number | { (sess: SessionData): number; };
  disableTTL?: boolean;
  disableTouch?: boolean;
}

class MyRedisStore extends RedisStore {
  cryptoService: KMSCryptoService;
  constructor(options: RedisStoreOptions, cryptoService: KMSCryptoService) {
      super(options);
      this.cryptoService = cryptoService;
  }

  async get(sid: string, cb?: (_err?: unknown, _data?: any) => void): Promise<void> {
    try {
      await super.get(sid, async (error?: unknown, data?: SessionData) => {
        if (!data) {
          if (cb) cb(new Error("data is undefined"));
          return;
        }
        const encrypted = data.encrypted;
        if(!encrypted) {
          if (cb) cb(new Error("Failed to get encrypted data"));
          return;
        }

        const sessionString = await this.cryptoService.decrypt(encrypted);
        let sessionData: SessionData;
        try {
          sessionData = JSON.parse(sessionString);
        } catch(error) {
          if (cb) cb(error);
          return;
        }

        sessionData.cookie = data.cookie;
        if (cb) cb(null, sessionData);
      });
      console.log(`get sid: ${sid}`);
    } catch (error) {
      console.error("Error in get method", error);
      if (cb) cb(error);
    }
  }

  async set(sid: string, sess: SessionData, cb?: (_err?: unknown, _data?: any) => void): Promise<void> {
    let sessionString: string; 
    try {
      sessionString = JSON.stringify(sess);
    } catch(error) {
      console.error("Failed to stringify session", error);
      if (cb) cb(error);
      return;
    }

    const encrypted = await this.cryptoService.encrypt(sessionString);

    const sessionWithEncrypted: SessionData = {
      cookie: sess.cookie,
      encrypted: encrypted.toString('base64')
    }

    try {
      await super.set(sid, sessionWithEncrypted, cb);
      console.log(`set sid: ${sid}`);
    } catch (error) {
      console.error("Error in set method", error);
      if (cb) cb(error);
    }
  }
}

export default MyRedisStore;
