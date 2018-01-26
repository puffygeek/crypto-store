const fs = require('fs');
const express = require('express');
const app = express();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 * 15 } }); //15 MB limit

app.get('/', (req, res) => res.send('ok'));

app.post('/put', upload.single('file'), (req, res) => {
  const { file } = req;
  if (file) {
    console.log(file);
    // store to ipfs => get adrs
    // store in smart contract key => adrs
    // return the user with ok
  }
});

app.post('/set', (req, res) => {
});

app.get('/ipfs', (req, res) => {
  res.send('Hello World!');
});

module.exports = app.listen(3000, () => console.log('Example app listening on port 3000!'));
