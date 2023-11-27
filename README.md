# CASA-TypeScript
CASA project with TypeScript and Redis

## Prerequisites
`docker` must be installed and running

## How to Run
To run: 
  - Pull the repo 
  - run `docker-compose -f docker-compose-local.yaml up`

## Notes for Posterity
### Redis Cluster
When connecting to the redis container from the host machine, the correct `host` would be `localhost` or `127.0.0.1`. 

However, trying `127.0.0.1:6379` in the CASA container, the service would look for Redis inside the same container. For the CASA service to connect to the Redis service, it is required to pass the service name defined in `docker-compose-local.yaml` - in this case `redis`. 

Sources: 
[1]: https://medium.com/commencis/creating-redis-cluster-using-docker-67f65545796d
[2]: https://pierreabreu.medium.com/building-redis-cluster-with-docker-compose-9569ddb6414a
[3]: https://ilhamdcp.hashnode.dev/creating-redis-cluster-with-docker-and-compose

### Localstack KMS 
Connecting to `localstack` from the NodeJs app requires using the `localstack` hostname (since the service is on the same network, we can use the service name as the host name).

In the `localstack` service, the `volumes` directive mounts the `./localstackinit.d` directory from the host into the `/docker-entrypoint-initaws.d` directory in the container. Files in this directory are executed when the container starts, allowing for initialization scripts.

The `kms.sh` script in the `localstackinit.d` directory is executed at the startup of the LocalStack container. The script performs the following actions using awslocal, a wrapper around the AWS CLI designed to interact with LocalStack:

  - `awslocal kms create-key`: This command creates a new Customer Master Key (CMK) in the LocalStack KMS and outputs its details in JSON format.
  - `python3 -c "import sys, json; print(json.load(sys.stdin)['KeyMetadata']['KeyId'])"`: This Python one-liner takes the JSON output from the create-key command, parses it, and extracts the KeyId of the newly created key.
  - `awslocal kms create-alias --alias-name alias/test_event_request_id --target-key-id "$( ... )"`: This command creates an alias named `alias/test_event_request_id` for the CMK that was just created. The target key ID for the alias is obtained from the output of the create-key command (captured and processed by the Python script).
