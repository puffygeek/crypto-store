const fs = require('fs');
const googleStorageConf = require('../../config/googleStorageConf');
const {bucketName} = googleStorageConf;


const getFilePath = (namespace, key) => namespace + "/" + key;

const put = async (googleStorage, namespace, key, value) => {
  let filePath = getFilePath(namespace, key);
  var tmp = require('tmp');
  var tmpObj = tmp.fileSync();
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
    let filePath = getFilePath(namespace, key);
    var retContent;
    var myBucket = googleStorage.bucket(bucketName);
    var file = myBucket.file(filePath);
    file.download(function (err, contents) {
      if (err) reject(err);
      retContent = contents;
      resolve();
    });
  });
  return myPromise;
}

module.exports = { put, get }
