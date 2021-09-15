/**
 * A meta object within an {@link XKTModel}.
 *
 * These are plugged together into a parent-child hierarchy to represent structural
 * metadata for the {@link XKTModel}.
 *
 * The leaf XKTMetaObjects are usually associated with
 * an {@link XKTEntity}, which they do so by sharing the same ID,
 * ie. where {@link XKTMetaObject#metaObjectId} == {@link XKTEntity#entityId}.
 *
 * * Created by {@link XKTModel#createMetaObject}
 * * Stored in {@link XKTModel#metaObjects} and {@link XKTModel#metaObjectsList}
 * * Has an ID, a type, and a human-readable name
 * * May have a parent {@link XKTMetaObject}
 * * When no children, is usually associated with an {@link XKTEntity}
 *
 * @class XKTMetaObject
 */
class XKTMetaObject {

    /**
     * @private
     * @param metaObjectId
     * @param propertySetIds
     * @param metaObjectType
     * @param metaObjectName
     * @param parentMetaObjectId
     */
    constructor(metaObjectId, propertySetIds, metaObjectType, metaObjectName, parentMetaObjectId) {

        /**
         * Unique ID of this ````XKTMetaObject```` in {@link XKTModel#metaObjects}.
         *
         * For a BIM model, this will be an IFC product ID.
         *
         * If this is a leaf XKTMetaObject, where it is not a parent to any other XKTMetaObject,
         * then this will be equal to the ID of an {@link XKTEntity} in {@link XKTModel#entities},
         * ie. where {@link XKTMetaObject#metaObjectId} == {@link XKTEntity#entityId}.
         *
         * @type {String}
         */
        this.metaObjectId = metaObjectId;

        /**
         * Unique ID of one or more property sets that contains additional metadata about this
         * {@link XKTMetaObject}. The property sets can be stored in an external system, or
         * within the {@link XKTModel}, as {@link XKTPropertySet}s within {@link XKTModel#propertySets}.
         *
         * @type {String[]}
         */
        this.propertySetIds = propertySetIds;

        /**
         * Indicates the XKTMetaObject meta object type.
         *
         * This defaults to "default".
         *
         * @type {string}
         */
        this.metaObjectType = metaObjectType;

        /**
         * Indicates the XKTMetaObject meta object name.
         *
         * This defaults to {@link XKTMetaObject#metaObjectId}.
         *
         * @type {string}
         */
        this.metaObjectName = metaObjectName;

        /**
         * The parent XKTMetaObject, if any.
         *
         * Will be null if there is no parent.
         *
         * @type {String}
         */
        this.parentMetaObjectId = parentMetaObjectId;
    }
}

export {XKTMetaObject};