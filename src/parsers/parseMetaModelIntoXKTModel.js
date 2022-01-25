/**
 * @desc Parses JSON metamodel into an {@link XKTModel}.
 *
 * @param {Object} params Parsing parameters.
 * @param {JSON} params.metaModelData Metamodel data.
 * @param {String[]} [params.excludeTypes] Types to exclude from parsing.
 * @param {String[]} [params.includeTypes] Types to include in parsing.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {function} [params.log] Logging callback.
 * @returns {Promise}
 */
function parseMetaModelIntoXKTModel({metaModelData, xktModel, includeTypes, excludeTypes, log}) {

    return new Promise(function (resolve, reject) {

        const metaObjects = metaModelData.metaObjects || [];

        xktModel.modelId = metaModelData.revisionId || ""; // HACK
        xktModel.projectId = metaModelData.projectId || "";
        xktModel.revisionId = metaModelData.revisionId || "";
        xktModel.author = metaModelData.author || "";
        xktModel.createdAt = metaModelData.createdAt || "";
        xktModel.creatingApplication = metaModelData.creatingApplication || "";
        xktModel.schema = metaModelData.schema || "";

        let includeTypesMap;
        if (includeTypes) {
            includeTypesMap = {};
            for (let i = 0, len = includeTypes.length; i < len; i++) {
                includeTypesMap[includeTypes[i]] = true;
            }
        }

        let excludeTypesMap;
        if (excludeTypes) {
            excludeTypesMap = {};
            for (let i = 0, len = excludeTypes.length; i < len; i++) {
                excludeTypesMap[excludeTypes[i]] = true;
            }
        }

        let countMetaObjects = 0;

        for (let i = 0, len = metaObjects.length; i < len; i++) {

            const metaObject = metaObjects[i];
            const type = metaObject.type;

            if (excludeTypesMap && excludeTypesMap[type]) {
                continue;
            }

            if (includeTypesMap && !includeTypesMap[type]) {
                continue;
            }

            xktModel.createMetaObject({
                metaObjectId: metaObject.id,
                metaObjectType: metaObject.type,
                metaObjectName: metaObject.name,
                parentMetaObjectId: metaObject.parent,
                propertySetIds: metaObject.propertySetIds,
            });

            countMetaObjects++;
        }

        if (log) {
            log("Converted meta objects: " + countMetaObjects);
        }

        resolve();
    });
}

export {parseMetaModelIntoXKTModel};
