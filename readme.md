Crypto Store
============
Crypto store is a tool to push data on the blockchain and on IPFS.


Install
-------
```bash
yarn install
```

Run
----
To run this project requires the Google Cloud credentials, create a google credentials JSON file and export the file as follow:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=${FOLDER_TO_GOOGLE_CREDENTIALS_JSON}
```


Run the server
```bash
node index.js
```

Test
----
First time you need to run truffle migrate, that will create the contract:
```bash
truffle migrate
```

To run the tests:
```bash
truffle develop
yarn test
```
