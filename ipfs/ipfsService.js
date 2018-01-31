const fs = require('fs');
const IPFS = require('ipfs');
let ipfs;
let ready;

// ipfs.on('ready', () => {
//   ready = true;
//   const strm = fs.createReadStream('/Users/sagivo/dev/side/crypto/blokk/tat.png');
//   ipfs.files.add(strm, (err, res) => {
//     ipfs.files.get(res[0].hash, (err, files) => {
//       fs.writeFile('/Users/sagivo/dev/side/crypto/blokk/o.png', files[0].content, (err, fin) => console.log('done'));
//     });
//   });
// });

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

const put = async (value) => {
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

const stop = () => {
  ipfs.stop();
}

module.exports = { put, get, stop }
