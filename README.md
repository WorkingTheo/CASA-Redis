# CASA-TypeScript
CASA project with TypeScript and Redis

## Prerequisites
`docker` must be installed and running

## How to Run
To run: 
  - Pull the repo 
  - run `docker-compose -f docker-compose-local.yaml up`

## Notes for Posterity
When connecting to the redis container from the host machine, the correct `host` would be `localhost` or `127.0.0.1`. 

However, trying `127.0.0.1:6379` in the CASA container, the service would look for Redis inside the same container. For the CASA service to connect to the Redis service, it is required to pass the service name defined in `docker-compose-local.yaml` - in this case `redis`. 

TODO: redis clusters: https://medium.com/commencis/creating-redis-cluster-using-docker-67f65545796d

redis cluster tutorial: https://pierreabreu.medium.com/building-redis-cluster-with-docker-compose-9569ddb6414a

more redis cluster tutorials: https://ilhamdcp.hashnode.dev/creating-redis-cluster-with-docker-and-compose
