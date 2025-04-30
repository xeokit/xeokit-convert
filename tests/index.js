import { convert2xkt } from "../src/convert2xkt.js";
import WebIFC from "web-ifc";
convert2xkt({
  WebIFC,
  source: "IfcOpenHouse4.ifc",
  output: "IfcOpenHouse4.ifc.xkt",
  log: (msg) => {
      console.log(msg)
  }
}).then(() => {
  console.log("Converted.");
}, (errMsg) => {
  console.error("Conversion failed: " + errMsg)
});