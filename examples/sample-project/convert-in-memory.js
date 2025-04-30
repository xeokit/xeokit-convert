import { convert2xkt } from '@xeokit/xeokit-convert';
import WebIFC from "web-ifc";
import fs from 'fs';

convert2xkt({
    WebIFC,
    sourceData: fs.readFileSync("./assets/Duplex.ifc"),
    sourceFormat: "ifc",
    outputXKT: (xtkArrayBuffer) => {
        fs.writeFileSync("./assets/Duplex.ifc.xkt", xtkArrayBuffer);
    }
}).then(() => {
    console.log("Converted.");
}, (errMsg) => {
    console.error("Conversion failed: " + errMsg)
});