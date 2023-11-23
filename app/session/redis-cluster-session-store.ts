import RedisClient from 'ioredis';
import MyRedisStore from './MyRedisStore';
import CryptoService from './CryptoService';

const redisClient = new RedisClient.Cluster([
  {
    port: 6373,
    host: 'redis-node-1'
  },
]);

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

const cryptoService = new CryptoService();

const RedisSessionStore = new MyRedisStore({ client: redisClient }, cryptoService);
export default RedisSessionStore;
