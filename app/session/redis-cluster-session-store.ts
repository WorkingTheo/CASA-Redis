import RedisClient from 'ioredis';
import MyRedisStore from './MyRedisStore';

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

const RedisSessionStore = new MyRedisStore({ client: redisClient });
export default RedisSessionStore;
