const fs = require('fs');
const express = require('express');
const app = express();
const multer  = require('multer');
const bodyParser = require('body-parser');
const ipfsService = require('./ipfs/ipfsService');
const ethereumeStore = require('./storage/ethereum');
const upload = multer({
  dest: 'uploads/',
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, //5 MB limit
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `${__dirname}/uploads`;
      // if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      const namespace = 'sagivo'; // TODO: GET NAMESPACE FROM MIDDLEWARE
      cb(null, `${namespace}-${file.originalname}`);
    }
  })
});

app.get('/', (req, res) => res.send('ok'));

app.post('/put', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file || !req.body.key) {
    if (file) fs.unlinkSync(file.path);
    return res.send({error: 'no file or key name was provided'});
  }
  // TODO: GET NS FROM DB HERE
  const ns = 'sagivo';
  // ----
  if (file) {
    const readableStream = fs.createReadStream(file.path);
    const ipfsHash =  await ipfsService.put(readableStream);
    const blockTx = await ethereumeStore.set(ns, req.body.key, ipfsHash);
    // TODO: store in other services here
    fs.unlinkSync(file.path);
    res.json({ ipfsHash, blockTx });
  }
});

app.get('/pull/:key', async (req, res) => {
  if (!req.params.key) {
    return res.json({error: 'no key'});
  }
  // TODO: GET NS FROM DB HERE
  const ns = 'sagivo';
  // ----
  const ipfsHash = await ethereumeStore.get(ns, req.params.key);
  if (!ipfsHash.length) return res.json({error: 'no matching namespace/value'});

  const fileStream = await ipfsService.pull(ipfsHash);
  fileStream.pipe(res);
});

app.post('/set', bodyParser.json(), async (req, res) => {
  if (!req.body.key || !req.body.value) {
    return res.json({error: 'no key or value params'});
  }
  // TODO: GET NS FROM DB HERE
  const ns = 'sagivo';
  // ----
  const ipfsHash =  await ipfsService.set(req.body.value);
  const blockTx = await ethereumeStore.set(ns, req.body.key, ipfsHash);
  res.json({ ipfsHash, blockTx });
});

app.get('/get/:key', async (req, res) => {
  if (!req.params.key) {
    return res.json({error: 'no key'});
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
