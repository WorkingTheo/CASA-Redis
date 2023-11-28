import AWS from 'aws-sdk';

const isLocal = process.env.NODE_ENV !== 'production';

if (isLocal) {
  AWS.config.update({
    region: 'eu-west-2',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  });
}

export const kms = new AWS.KMS({
  region: 'eu-west-2',
  endpoint: 'http://localstack:4566'
});

export const getEncryptionKey = () => {
  kms.describeKey({ KeyId: 'alias/test_event_request_id' }, (err, data) => {
    if (err) {
      console.error("Error", err);
      return null;
    } else {
      console.log("KMS: Key", data);
      return data;
    }
  });
}
