const fs = require('fs');
const express = require('express');
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
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      const namespace = 'sagivo'; // TODO: GET NAMESPACE FROM MIDDLEWARE
      cb(null, `${namespace}-${file.originalname}`);
    }
  })
});

module.exports = class Server {
  constructor(params = {}) {
    this.app = express()
    if (params.middleware) {
      this.app.use(params.middleware);
    }
  }

  start(params = {}) {
    const port = params.port || 3000;

    this.app.get('/', (req, res) => res.send('ok'));

    this.app.post('/put', upload.single('file'), async (req, res) => {
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

    this.app.get('/pull/:key', async (req, res) => {
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

    this.app.post('/set', bodyParser.json(), async (req, res) => {
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

    this.app.get('/get/:key', async (req, res) => {
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

    this.server = this.app.listen(port, () => {
      console.log(`Example this.app listening on port ${ port }!`);
    });
  }

  async exit() {
    await ipfsService.stop();
    await this.server.close();
  }
}
