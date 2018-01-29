const fs = require('fs');
const express = require('express');
const app = express();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 * 15 } }); //15 MB limit
const bodyParser = require('body-parser');
const ipfsService = require('./ipfs/ipfsService');

app.get('/', (req, res) => res.end('ok'));

app.post('/put', upload.single('file'), (req, res) => {
  const { file } = req;
  if (file) {
    console.log(file);
    // store to ipfs => get adrs
    // store in smart contract key => adrs
    // return the user with ok
  }
});

app.post('/set', bodyParser.json(), async (req, res) => {
  if (!req.body.key || !req.body.value) {
    return res.send({error: 'no key or value params'});
  }
  const r = await ipfsService.put(req.body.value);
  res.send(r)
});

app.get('/get', async (req, res) => {
  if (!req.query.key) {
    return res.send({error: 'no key'});
  }
  const val = await ipfsService.get(req.query.key);
  res.send(val);
});

const server = app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

server.exit = async () => {
  await ipfsService.stop();
  await server.close();
}

module.exports = server;