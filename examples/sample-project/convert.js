import { convert2xkt } from '@xeokit/xeokit-convert';

// No need to import WebIFC explicitly - it will be loaded dynamically if needed
convert2xkt({
  source: "./assets/Duplex.ifc",
  output: "./assets/Duplex.ifc.xkt",
  log: (msg) => {
      console.log(msg)
  }
}).then(() => {
  console.log("Converted.");
}, (errMsg) => {
  console.error("Conversion failed: " + errMsg)
});