const fs = require('fs');
const express = require('express');
const app = express();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 * 15 } }); //15 MB limit
const bodyParser = require('body-parser');
const ipfsService = require('./library/ipfs/ipfsService');
const googleStorageService = require('./library/google-storage/googleStorageService');

const projectId = 'blokk-12345'; // todo: this should come from an ENV variable
let namespace = '12345'; // need to move namespace to a middleware, in firebase login

const Storage = require('@google-cloud/storage');
let googleStorage = new Storage({ projectId: projectId });

app.get('/', (req, res) => res.send('ok'));

app.post('/put', upload.single('file'), (req, res) => {
  const { file } = req;
  if (file) {
    // store to ipfs => get adrs
    // store in smart contract key => adrs
    // return the user with ok
  }
});

app.post('/set', bodyParser.json(), async (req, res) => {
  if (!req.body.key || !req.body.value) {
    return res.send({error: 'no key or value params'});
  }
  // TODO: GET NS FROM DB HERE
  const ns = 'sagivo';
  // ----
  const ipfsHash =  await ipfsService.put(req.body.value);
  const blockTx = await ethereumeStore.set(ns, req.body.key, ipfsHash);
  googleStorageService.put(googleStorage, namespace, req.body.key, req.body.value);
  res.send({ ipfsHash, blockTx });
});

app.get('/get/:key', async (req, res) => {
  if (!req.params.key) {
    return res.send({error: 'no key'});
  }
  // TODO: GET NS FROM DB HERE
  const ns = 'sagivo';
  // ----
  const ipfsHash = await ethereumeStore.get(ns, req.params.key);
  if (!ipfsHash.length) return res.json({error: 'no matching namespace/value'});
  const val = await ipfsService.get(ipfsHash);
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
