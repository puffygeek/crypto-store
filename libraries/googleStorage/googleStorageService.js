const fs = require('fs');
const {bucketName} = require('../../configs/googleConf');

const getFilePath = (namespace, key) => namespace + "/" + key;

const put = async (googleStorage, namespace, key, value) => {
  const filePath = getFilePath(namespace, key);
  const tmp = require('tmp');
  const tmpObj = tmp.fileSync();
  fs.writeFile(tmpObj.name, value, (err) => {
    if (err) throw err;
    googleStorage
      .bucket(bucketName)
      .upload(tmpObj.name, {destination: filePath})
      .then( () => {
        console.log();
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    // todo: implement streaming upload https://cloud.google.com/nodejs/getting-started/using-cloud-storage
  });
}

const get = async (googleStorage, namespace, key) => {
  var myPromise = new Promise((resolve, reject) => {
    const filePath = getFilePath(namespace, key);
    const myBucket = googleStorage.bucket(bucketName);
    const file = myBucket.file(filePath);
    file.download(function (err, contents) {
      if (err) reject(err);
      resolve(contents);
    });
  });
  return myPromise;
}

module.exports = { put, get }
