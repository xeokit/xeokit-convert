/**
 * A property set within an {@link XKTModel}.
 *
 * These are shared among {@link XKTMetaObject}s.
 *
 * * Created by {@link XKTModel#createPropertySet}
 * * Stored in {@link XKTModel#propertySets} and {@link XKTModel#propertySetsList}
 * * Has an ID, a type, and a human-readable name
 *
 * @class XKTPropertySet
 */
class XKTPropertySet {

    /**
     * @private
     */
    constructor(propertySetId, propertySetType, propertySetName, properties) {

        /**
         * Unique ID of this ````XKTPropertySet```` in {@link XKTModel#propertySets}.
         *
         * @type {String}
         */
        this.propertySetId = propertySetId;

        /**
         * Indicates the ````XKTPropertySet````'s type.
         *
         * This defaults to "default".
         *
         * @type {string}
         */
        this.propertySetType = propertySetType;

        /**
         * Indicates the XKTPropertySet meta object name.
         *
         * This defaults to {@link XKTPropertySet#propertySetId}.
         *
         * @type {string}
         */
        this.propertySetName = propertySetName;

        /**
         * The properties within this ````XKTPropertySet````.
         *
         * @type {*[]}
         */
        this.properties = properties;
    }
}

export {XKTPropertySet};