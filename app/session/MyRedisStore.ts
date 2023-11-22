import RedisStore from "connect-redis";
import { SessionData } from "express-session";

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
  constructor(options: RedisStoreOptions) {
      super(options);
  }

  async get(sid: string, cb?: (_err?: unknown, _data?: any) => void): Promise<void> {
    try {
      await super.get(sid, cb);
      console.log(`get sid: ${sid}`);
    } catch (error) {
      console.error("Error in get method", error);
      if (cb) cb(error);
    }
  }

  async set(sid: string, sess: SessionData, cb?: (_err?: unknown, _data?: any) => void): Promise<void> {
    try {
      await super.set(sid, sess, cb);
      console.log(`set sid: ${sid}`);
    } catch (error) {
      console.error("Error in set method", error);
      if (cb) cb(error);
    }
  }
}

export default MyRedisStore;
