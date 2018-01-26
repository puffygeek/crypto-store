const fs = require('fs');
const express = require('express');
const app = express();

const IPFS = require('ipfs');
const ipfs = new IPFS();

ipfs.on('ready', () => {
  const strm = fs.createReadStream('/Users/sagivo/dev/side/crypto/blokk/tat.png');
  ipfs.swarm.peers(function (err, peerInfos) {
    console.log('???',peerInfos);
  });
  // ipfs.files.add(strm, (err, res) => {
  //   ipfs.files.get(res[0].hash, (err, files) => {
  //     fs.writeFile('/Users/sagivo/dev/side/crypto/blokk/o.png', files[0].content, (err, fin) => console.log('done'));
  //   });
  // });
})

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/ipfs', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));