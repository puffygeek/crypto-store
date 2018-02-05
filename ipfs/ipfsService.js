const fs = require('fs');
const IPFS = require('ipfs');
let ipfs;
let ready;

const init = async () => {
  if (ready) return true;

  return new Promise((resolve, reject) => {
    ipfs = new IPFS();
    ipfs.on('ready', () => {
      ready = true;
      resolve();
    });
  });
}

const convertToBuffer = (value) => {
  switch (typeof(value)) {
    case 'string': return Buffer.from(value, 'utf8'); break;
    case 'number': return Buffer.from(value.toString(), 'utf8'); break;
    case 'object': return Buffer.from(JSON.stringify(value), 'utf8'); break;
    case Buffer: return value;
  }
}

const set = async (value) => {
  if (!ready) await init();
  value = convertToBuffer(value);
  const files = await ipfs.files.add(value);
  return files[0].hash;
}

const get = async (key) => {
  if (!ready) await init();

  const obj = (await ipfs.files.get(key))[0];
  if (obj.readable) return obj;
  return obj.content.toString('utf8');
}

const put = async (data) => {
  if (!ready) await init();
  const files = await ipfs.files.add(data);
  return files[0].hash;
}

const pull = async (key) => {
  if (!ready) await init();
  return ipfs.files.catReadableStream(key);
}

const stop = () => {
  if (ready) ipfs.stop();
}

module.exports = { put, pull, set, get, stop }
