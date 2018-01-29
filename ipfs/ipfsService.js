const fs = require('fs');

const Storage = require('@google-cloud/storage');
let googleStorage;
const projectId = 'YOUR_PROJECT_ID';
const bucketName = 'my-new-bucket';

const init = async () => {
  if (ready) return true;

  return new Promise((resolve, reject) => {
    googleStorage = new Storage({
      projectId: projectId
    }).then(res => {
      resolve();
    });
  });
};

const convertToBuffer = (value) => {
  switch (typeof(value)) {
    case 'string': return Buffer.from(value, 'utf8'); break;
    case 'number': return Buffer.from(value.toString(), 'utf8'); break;
    case 'object': return Buffer.from(JSON.stringify(value), 'utf8'); break;
    case Buffer: return value;
  }
}

const put = async (value) => {
  if (!ready) await init();
  await googleStorage.upload(value, {destination: destination});
}

const get = async (key) => {
  if (!ready) await init();

  const obj = (await ipfs.files.get(key))[0];
  if (obj.readable) return obj;
  return obj.content.toString('utf8');
}

const stop = () => {
  ipfs.stop(process.exit);
}

module.exports = { put, get, stop }
