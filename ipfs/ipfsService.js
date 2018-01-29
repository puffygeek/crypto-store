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
  console.log(obj);
  if (obj.readable) return obj;
  return obj.content.toString('utf8');
}

const test = async () => {
  const strm = fs.createReadStream('/Users/sagivo/dev/side/crypto/crypto-store/tat.png');

  // const a = await store(strm);
  const a = await store('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Dictum sit amet justo donec enim diam vulputate ut. Cursus turpis massa tincidunt dui. At varius vel pharetra vel turpis nunc eget lorem dolor. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Mauris ultrices eros in cursus turpis massa tincidunt. Interdum posuere lorem ipsum dolor sit amet consectetur. Non diam phasellus vestibulum lorem sed risus. Id porta nibh venenatis cras sed felis. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Blandit aliquam etiam erat velit scelerisque in dictum. Lectus arcu bibendum at varius vel pharetra. Et ultrices neque ornare aenean euismod. In tellus integer feugiat scelerisque varius. Tellus id interdum velit laoreet id. Risus nec feugiat in fermentum posuere. Aliquet nec ullamcorper sit amet risus nullam. Urna nec tincidunt praesent semper feugiat nibh. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero. Arcu bibendum at varius vel pharetra. Pulvinar neque laoreet suspendisse interdum consectetur libero. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Quam vulputate dignissim suspendisse in est ante. Quis enim lobortis scelerisque fermentum. Lorem mollis aliquam ut porttitor leo. A diam sollicitudin tempor id. Iaculis at erat pellentesque adipiscing commodo elit at. Mi in nulla posuere sollicitudin aliquam. Aliquam ut porttitor leo a diam sollicitudin tempor. Lorem dolor sed viverra ipsum. Auctor augue mauris augue neque gravida in fermentum. Mattis pellentesque id nibh tortor. Ullamcorper sit amet risus nullam. Et malesuada fames ac turpis egestas. Ac turpis egestas sed tempus. Porta non pulvinar neque laoreet suspendisse interdum. Tortor consequat id porta nibh venenatis cras sed. Feugiat in fermentum posuere urna. Mauris cursus mattis molestie a iaculis at erat pellentesque. Amet commodo nulla facilisi nullam vehicula ipsum a arcu. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Lacus vestibulum sed arcu non odio euismod lacinia at quis. Nulla facilisi etiam dignissim diam quis enim lobortis. Aenean euismod elementum nisi quis eleifend quam adipiscing. Donec pretium vulputate sapien nec sagittis aliquam. Habitant morbi tristique senectus et netus et malesuada. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Fusce id velit ut tortor pretium. Massa sed elementum tempus egestas sed. Suspendisse sed nisi lacus sed viverra tellus in. Turpis massa sed elementum tempus egestas sed sed. Et ligula ullamcorper malesuada proin libero. Sit amet massa vitae tortor. Tortor at auctor urna nunc. Integer quis auctor elit sed vulputate mi sit amet mauris. Ac tincidunt vitae semper quis lectus nulla at volutpat. Et malesuada fames ac turpis egestas maecenas pharetra convallis. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non. Nec feugiat nisl pretium fusce id velit ut. Platea dictumst vestibulum rhoncus est pellentesque. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. Tortor consequat id porta nibh venenatis cras sed. Massa tincidunt nunc pulvinar sapien et. Vel facilisis volutpat est velit egestas. Condimentum mattis pellentesque id nibh tortor id aliquet. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Enim tortor at auctor urna nunc id. Arcu dictum varius duis at consectetur lorem donec. Sit amet justo donec enim diam. Ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Et malesuada fames ac turpis egestas. Rutrum quisque non tellus orci ac auctor augue mauris.');
  const res = await get(a);
  fs.writeFile('/Users/sagivo/dev/side/crypto/crypto-store/o.txt', res);
  // console.log(res);
}

const stop = () => {
  // return new Promise((resolve) => {
    ipfs.stop(process.exit);

  // })
}

// test();
module.exports = { put, get, stop }