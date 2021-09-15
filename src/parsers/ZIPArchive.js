import JSZip from "jszip";

/**
 * @private
 */
class ZIPArchive {

    constructor(domParser) {
        this._zip = new JSZip();
        this._domParser = domParser;
    }

    init(blob) {
        return this._zip.loadAsync(blob);
    }

    async getFile(src) {
        const fileText = await this._zip.file(src).async("string");
        if (!fileText) {
            const errMsg = "ZIP entry not found: " + src;
            console.error(errMsg);
            return;
        }
        const xmlDoc = this._domParser.parseFromString(fileText, "text/xml");
        const json = xmlToJSON(xmlDoc, {});
        return {xmlDoc, json};
    }

    destroy() {

    }
}

function xmlToJSON(node, attributeRenamer) {
    if (node.nodeType === node.TEXT_NODE) {
        const v = node.nodeValue;
        if (v.match(/^\s+$/) === null) {
            return v;
        }
    } else if (node.nodeType === node.ELEMENT_NODE ||
        node.nodeType === node.DOCUMENT_NODE) {
        const json = {type: node.nodeName, children: []};
        if (node.nodeType === node.ELEMENT_NODE) {
            for (let i = 0, len = node.attributes.length; i < len; i++) {
                const attribute = node.attributes[i];
                const nm = attributeRenamer[attribute.nodeName] || attribute.nodeName;
                json[nm] = attribute.nodeValue;
            }
        }
        for (let i = 0, len = node.childNodes.length; i < len; i++) {
            const item = node.childNodes[i];
            const jsonPortion = xmlToJSON(item, attributeRenamer);
            if (jsonPortion) {
                json.children.push(jsonPortion);
            }
        }
        return json;
    }
}

export {ZIPArchive};