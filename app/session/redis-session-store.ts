import RedisClient from 'ioredis';
import MyRedisStore from './MyRedisStore';
import CryptoService from './CryptoService';
import KMSCryptoService from './KMSCryptoService';

const redisClient = new RedisClient({
  port: 6379,
  host: 'redis',
  db: 0
});

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

const cryptoService = new KMSCryptoService();

const RedisSessionStore = new MyRedisStore({ client: redisClient }, cryptoService);
export default RedisSessionStore;
