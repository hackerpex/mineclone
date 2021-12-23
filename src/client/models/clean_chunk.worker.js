const path = require('path');


const {
    Worker, isMainThread, parentPort, workerData
  } = require('worker_threads');

  
require('ts-node').register();
require(path.resolve(__dirname, workerData.path));


parentPort.postMessage(
    "dado devolvido"
  );