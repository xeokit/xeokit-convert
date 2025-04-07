import { convert2xkt } from '@xeokit/xeokit-convert';
import WebIFC from "web-ifc/web-ifc-api-node.js";
convert2xkt({
  WebIFC,
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