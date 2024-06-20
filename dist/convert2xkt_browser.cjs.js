'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Some temporary vars to help avoid garbage collection
const FloatArrayType = Float64Array ;

const tempMat1 = new FloatArrayType(16);
const tempMat2 = new FloatArrayType(16);
const tempVec4 = new FloatArrayType(4);

/**
 * @private
 */
const math = {

    MIN_DOUBLE: -Number.MAX_SAFE_INTEGER,
    MAX_DOUBLE:  Number.MAX_SAFE_INTEGER,

    /**
     * The number of radiians in a degree (0.0174532925).
     * @property DEGTORAD
     * @type {Number}
     */
    DEGTORAD: 0.0174532925,

    /**
     * The number of degrees in a radian.
     * @property RADTODEG
     * @type {Number}
     */
    RADTODEG: 57.295779513,

    /**
     * Returns a new, uninitialized two-element vector.
     * @method vec2
     * @param [values] Initial values.
     * @static
     * @returns {Number[]}
     */
    vec2(values) {
        return new FloatArrayType(values || 2);
    },

    /**
     * Returns a new, uninitialized three-element vector.
     * @method vec3
     * @param [values] Initial values.
     * @static
     * @returns {Number[]}
     */
    vec3(values) {
        return new FloatArrayType(values || 3);
    },

    /**
     * Returns a new, uninitialized four-element vector.
     * @method vec4
     * @param [values] Initial values.
     * @static
     * @returns {Number[]}
     */
    vec4(values) {
        return new FloatArrayType(values || 4);
    },

    /**
     * Returns a new, uninitialized 3x3 matrix.
     * @method mat3
     * @param [values] Initial values.
     * @static
     * @returns {Number[]}
     */
    mat3(values) {
        return new FloatArrayType(values || 9);
    },

    /**
     * Converts a 3x3 matrix to 4x4
     * @method mat3ToMat4
     * @param mat3 3x3 matrix.
     * @param mat4 4x4 matrix
     * @static
     * @returns {Number[]}
     */
    mat3ToMat4(mat3, mat4 = new FloatArrayType(16)) {
        mat4[0] = mat3[0];
        mat4[1] = mat3[1];
        mat4[2] = mat3[2];
        mat4[3] = 0;
        mat4[4] = mat3[3];
        mat4[5] = mat3[4];
        mat4[6] = mat3[5];
        mat4[7] = 0;
        mat4[8] = mat3[6];
        mat4[9] = mat3[7];
        mat4[10] = mat3[8];
        mat4[11] = 0;
        mat4[12] = 0;
        mat4[13] = 0;
        mat4[14] = 0;
        mat4[15] = 1;
        return mat4;
    },

    /**
     * Returns a new, uninitialized 4x4 matrix.
     * @method mat4
     * @param [values] Initial values.
     * @static
     * @returns {Number[]}
     */
    mat4(values) {
        return new FloatArrayType(values || 16);
    },

    /**
     * Converts a 4x4 matrix to 3x3
     * @method mat4ToMat3
     * @param mat4 4x4 matrix.
     * @param mat3 3x3 matrix
     * @static
     * @returns {Number[]}
     */
    mat4ToMat3(mat4, mat3) { // TODO
        //return new FloatArrayType(values || 9);
    },

    /**
     * Returns a new UUID.
     * @method createUUID
     * @static
     * @return string The new UUID
     */
    createUUID: ((() => {
        const lut = [];
        for (let i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        return () => {
            const d0 = Math.random() * 0xffffffff | 0;
            const d1 = Math.random() * 0xffffffff | 0;
            const d2 = Math.random() * 0xffffffff | 0;
            const d3 = Math.random() * 0xffffffff | 0;
            return `${lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff]}-${lut[d1 & 0xff]}${lut[d1 >> 8 & 0xff]}-${lut[d1 >> 16 & 0x0f | 0x40]}${lut[d1 >> 24 & 0xff]}-${lut[d2 & 0x3f | 0x80]}${lut[d2 >> 8 & 0xff]}-${lut[d2 >> 16 & 0xff]}${lut[d2 >> 24 & 0xff]}${lut[d3 & 0xff]}${lut[d3 >> 8 & 0xff]}${lut[d3 >> 16 & 0xff]}${lut[d3 >> 24 & 0xff]}`;
        };
    }))(),

    /**
     * Clamps a value to the given range.
     * @param {Number} value Value to clamp.
     * @param {Number} min Lower bound.
     * @param {Number} max Upper bound.
     * @returns {Number} Clamped result.
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Floating-point modulus
     * @method fmod
     * @static
     * @param {Number} a
     * @param {Number} b
     * @returns {*}
     */
    fmod(a, b) {
        if (a < b) {
            console.error("math.fmod : Attempting to find modulus within negative range - would be infinite loop - ignoring");
            return a;
        }
        while (b <= a) {
            a -= b;
        }
        return a;
    },

    /**
     * Negates a four-element vector.
     * @method negateVec4
     * @static
     * @param {Array(Number)} v Vector to negate
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    negateVec4(v, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = -v[0];
        dest[1] = -v[1];
        dest[2] = -v[2];
        dest[3] = -v[3];
        return dest;
    },

    /**
     * Adds one four-element vector to another.
     * @method addVec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    addVec4(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] + v[0];
        dest[1] = u[1] + v[1];
        dest[2] = u[2] + v[2];
        dest[3] = u[3] + v[3];
        return dest;
    },

    /**
     * Adds a scalar value to each element of a four-element vector.
     * @method addVec4Scalar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    addVec4Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] + s;
        dest[1] = v[1] + s;
        dest[2] = v[2] + s;
        dest[3] = v[3] + s;
        return dest;
    },

    /**
     * Adds one three-element vector to another.
     * @method addVec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    addVec3(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] + v[0];
        dest[1] = u[1] + v[1];
        dest[2] = u[2] + v[2];
        return dest;
    },

    /**
     * Adds a scalar value to each element of a three-element vector.
     * @method addVec4Scalar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    addVec3Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] + s;
        dest[1] = v[1] + s;
        dest[2] = v[2] + s;
        return dest;
    },

    /**
     * Subtracts one four-element vector from another.
     * @method subVec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Vector to subtract
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    subVec4(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] - v[0];
        dest[1] = u[1] - v[1];
        dest[2] = u[2] - v[2];
        dest[3] = u[3] - v[3];
        return dest;
    },

    /**
     * Subtracts one three-element vector from another.
     * @method subVec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Vector to subtract
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    subVec3(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] - v[0];
        dest[1] = u[1] - v[1];
        dest[2] = u[2] - v[2];
        return dest;
    },

    /**
     * Subtracts one two-element vector from another.
     * @method subVec2
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Vector to subtract
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    subVec2(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] - v[0];
        dest[1] = u[1] - v[1];
        return dest;
    },

    /**
     * Subtracts a scalar value from each element of a four-element vector.
     * @method subVec4Scalar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    subVec4Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] - s;
        dest[1] = v[1] - s;
        dest[2] = v[2] - s;
        dest[3] = v[3] - s;
        return dest;
    },

    /**
     * Sets each element of a 4-element vector to a scalar value minus the value of that element.
     * @method subScalarVec4
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    subScalarVec4(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = s - v[0];
        dest[1] = s - v[1];
        dest[2] = s - v[2];
        dest[3] = s - v[3];
        return dest;
    },

    /**
     * Multiplies one three-element vector by another.
     * @method mulVec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    mulVec4(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] * v[0];
        dest[1] = u[1] * v[1];
        dest[2] = u[2] * v[2];
        dest[3] = u[3] * v[3];
        return dest;
    },

    /**
     * Multiplies each element of a four-element vector by a scalar.
     * @method mulVec34calar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    mulVec4Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;
        dest[3] = v[3] * s;
        return dest;
    },

    /**
     * Multiplies each element of a three-element vector by a scalar.
     * @method mulVec3Scalar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    mulVec3Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;
        return dest;
    },

    /**
     * Multiplies each element of a two-element vector by a scalar.
     * @method mulVec2Scalar
     * @static
     * @param {Array(Number)} v The vector
     * @param {Number} s The scalar
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, v otherwise
     */
    mulVec2Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        return dest;
    },

    /**
     * Divides one three-element vector by another.
     * @method divVec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    divVec3(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] / v[0];
        dest[1] = u[1] / v[1];
        dest[2] = u[2] / v[2];
        return dest;
    },

    /**
     * Divides one four-element vector by another.
     * @method divVec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @param  {Array(Number)} [dest] Destination vector
     * @return {Array(Number)} dest if specified, u otherwise
     */
    divVec4(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        dest[0] = u[0] / v[0];
        dest[1] = u[1] / v[1];
        dest[2] = u[2] / v[2];
        dest[3] = u[3] / v[3];
        return dest;
    },

    /**
     * Divides a scalar by a three-element vector, returning a new vector.
     * @method divScalarVec3
     * @static
     * @param v vec3
     * @param s scalar
     * @param dest vec3 - optional destination
     * @return [] dest if specified, v otherwise
     */
    divScalarVec3(s, v, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = s / v[0];
        dest[1] = s / v[1];
        dest[2] = s / v[2];
        return dest;
    },

    /**
     * Divides a three-element vector by a scalar.
     * @method divVec3Scalar
     * @static
     * @param v vec3
     * @param s scalar
     * @param dest vec3 - optional destination
     * @return [] dest if specified, v otherwise
     */
    divVec3Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] / s;
        dest[1] = v[1] / s;
        dest[2] = v[2] / s;
        return dest;
    },

    /**
     * Divides a four-element vector by a scalar.
     * @method divVec4Scalar
     * @static
     * @param v vec4
     * @param s scalar
     * @param dest vec4 - optional destination
     * @return [] dest if specified, v otherwise
     */
    divVec4Scalar(v, s, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = v[0] / s;
        dest[1] = v[1] / s;
        dest[2] = v[2] / s;
        dest[3] = v[3] / s;
        return dest;
    },


    /**
     * Divides a scalar by a four-element vector, returning a new vector.
     * @method divScalarVec4
     * @static
     * @param s scalar
     * @param v vec4
     * @param dest vec4 - optional destination
     * @return [] dest if specified, v otherwise
     */
    divScalarVec4(s, v, dest) {
        if (!dest) {
            dest = v;
        }
        dest[0] = s / v[0];
        dest[1] = s / v[1];
        dest[2] = s / v[2];
        dest[3] = s / v[3];
        return dest;
    },

    /**
     * Returns the dot product of two four-element vectors.
     * @method dotVec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @return The dot product
     */
    dotVec4(u, v) {
        return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3]);
    },

    /**
     * Returns the cross product of two four-element vectors.
     * @method cross3Vec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @return The cross product
     */
    cross3Vec4(u, v) {
        const u0 = u[0];
        const u1 = u[1];
        const u2 = u[2];
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        return [
            u1 * v2 - u2 * v1,
            u2 * v0 - u0 * v2,
            u0 * v1 - u1 * v0,
            0.0];
    },

    /**
     * Returns the cross product of two three-element vectors.
     * @method cross3Vec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @return The cross product
     */
    cross3Vec3(u, v, dest) {
        if (!dest) {
            dest = u;
        }
        const x = u[0];
        const y = u[1];
        const z = u[2];
        const x2 = v[0];
        const y2 = v[1];
        const z2 = v[2];
        dest[0] = y * z2 - z * y2;
        dest[1] = z * x2 - x * z2;
        dest[2] = x * y2 - y * x2;
        return dest;
    },


    sqLenVec4(v) { // TODO
        return math.dotVec4(v, v);
    },

    /**
     * Returns the length of a four-element vector.
     * @method lenVec4
     * @static
     * @param {Array(Number)} v The vector
     * @return The length
     */
    lenVec4(v) {
        return Math.sqrt(math.sqLenVec4(v));
    },

    /**
     * Returns the dot product of two three-element vectors.
     * @method dotVec3
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @return The dot product
     */
    dotVec3(u, v) {
        return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
    },

    /**
     * Returns the dot product of two two-element vectors.
     * @method dotVec4
     * @static
     * @param {Array(Number)} u First vector
     * @param {Array(Number)} v Second vector
     * @return The dot product
     */
    dotVec2(u, v) {
        return (u[0] * v[0] + u[1] * v[1]);
    },


    sqLenVec3(v) {
        return math.dotVec3(v, v);
    },


    sqLenVec2(v) {
        return math.dotVec2(v, v);
    },

    /**
     * Returns the length of a three-element vector.
     * @method lenVec3
     * @static
     * @param {Array(Number)} v The vector
     * @return The length
     */
    lenVec3(v) {
        return Math.sqrt(math.sqLenVec3(v));
    },

    distVec3: ((() => {
        const vec = new FloatArrayType(3);
        return (v, w) => math.lenVec3(math.subVec3(v, w, vec));
    }))(),

    /**
     * Returns the length of a two-element vector.
     * @method lenVec2
     * @static
     * @param {Array(Number)} v The vector
     * @return The length
     */
    lenVec2(v) {
        return Math.sqrt(math.sqLenVec2(v));
    },

    distVec2: ((() => {
        const vec = new FloatArrayType(2);
        return (v, w) => math.lenVec2(math.subVec2(v, w, vec));
    }))(),

    /**
     * @method rcpVec3
     * @static
     * @param v vec3
     * @param dest vec3 - optional destination
     * @return [] dest if specified, v otherwise
     *
     */
    rcpVec3(v, dest) {
        return math.divScalarVec3(1.0, v, dest);
    },

    /**
     * Normalizes a four-element vector
     * @method normalizeVec4
     * @static
     * @param v vec4
     * @param dest vec4 - optional destination
     * @return [] dest if specified, v otherwise
     *
     */
    normalizeVec4(v, dest) {
        const f = 1.0 / math.lenVec4(v);
        return math.mulVec4Scalar(v, f, dest);
    },

    /**
     * Normalizes a three-element vector
     * @method normalizeVec4
     * @static
     */
    normalizeVec3(v, dest) {
        const f = 1.0 / math.lenVec3(v);
        return math.mulVec3Scalar(v, f, dest);
    },

    /**
     * Normalizes a two-element vector
     * @method normalizeVec2
     * @static
     */
    normalizeVec2(v, dest) {
        const f = 1.0 / math.lenVec2(v);
        return math.mulVec2Scalar(v, f, dest);
    },

    /**
     * Gets the angle between two vectors
     * @method angleVec3
     * @param v
     * @param w
     * @returns {number}
     */
    angleVec3(v, w) {
        let theta = math.dotVec3(v, w) / (Math.sqrt(math.sqLenVec3(v) * math.sqLenVec3(w)));
        theta = theta < -1 ? -1 : (theta > 1 ? 1 : theta);  // Clamp to handle numerical problems
        return Math.acos(theta);
    },

    /**
     * Creates a three-element vector from the rotation part of a sixteen-element matrix.
     * @param m
     * @param dest
     */
    vec3FromMat4Scale: ((() => {

        const tempVec3 = new FloatArrayType(3);

        return (m, dest) => {

            tempVec3[0] = m[0];
            tempVec3[1] = m[1];
            tempVec3[2] = m[2];

            dest[0] = math.lenVec3(tempVec3);

            tempVec3[0] = m[4];
            tempVec3[1] = m[5];
            tempVec3[2] = m[6];

            dest[1] = math.lenVec3(tempVec3);

            tempVec3[0] = m[8];
            tempVec3[1] = m[9];
            tempVec3[2] = m[10];

            dest[2] = math.lenVec3(tempVec3);

            return dest;
        };
    }))(),

    /**
     * Converts an n-element vector to a JSON-serializable
     * array with values rounded to two decimal places.
     */
    vecToArray: ((() => {
        function trunc(v) {
            return Math.round(v * 100000) / 100000
        }

        return v => {
            v = Array.prototype.slice.call(v);
            for (let i = 0, len = v.length; i < len; i++) {
                v[i] = trunc(v[i]);
            }
            return v;
        };
    }))(),

    /**
     * Converts a 3-element vector from an array to an object of the form ````{x:999, y:999, z:999}````.
     * @param arr
     * @returns {{x: *, y: *, z: *}}
     */
    xyzArrayToObject(arr) {
        return {"x": arr[0], "y": arr[1], "z": arr[2]};
    },

    /**
     * Converts a 3-element vector object of the form ````{x:999, y:999, z:999}```` to an array.
     * @param xyz
     * @param  [arry]
     * @returns {*[]}
     */
    xyzObjectToArray(xyz, arry) {
        arry = arry || new FloatArrayType(3);
        arry[0] = xyz.x;
        arry[1] = xyz.y;
        arry[2] = xyz.z;
        return arry;
    },

    /**
     * Duplicates a 4x4 identity matrix.
     * @method dupMat4
     * @static
     */
    dupMat4(m) {
        return m.slice(0, 16);
    },

    /**
     * Extracts a 3x3 matrix from a 4x4 matrix.
     * @method mat4To3
     * @static
     */
    mat4To3(m) {
        return [
            m[0], m[1], m[2],
            m[4], m[5], m[6],
            m[8], m[9], m[10]
        ];
    },

    /**
     * Returns a 4x4 matrix with each element set to the given scalar value.
     * @method m4s
     * @static
     */
    m4s(s) {
        return [
            s, s, s, s,
            s, s, s, s,
            s, s, s, s,
            s, s, s, s
        ];
    },

    /**
     * Returns a 4x4 matrix with each element set to zero.
     * @method setMat4ToZeroes
     * @static
     */
    setMat4ToZeroes() {
        return math.m4s(0.0);
    },

    /**
     * Returns a 4x4 matrix with each element set to 1.0.
     * @method setMat4ToOnes
     * @static
     */
    setMat4ToOnes() {
        return math.m4s(1.0);
    },

    /**
     * Returns a 4x4 matrix with each element set to 1.0.
     * @method setMat4ToOnes
     * @static
     */
    diagonalMat4v(v) {
        return new FloatArrayType([
            v[0], 0.0, 0.0, 0.0,
            0.0, v[1], 0.0, 0.0,
            0.0, 0.0, v[2], 0.0,
            0.0, 0.0, 0.0, v[3]
        ]);
    },

    /**
     * Returns a 4x4 matrix with diagonal elements set to the given vector.
     * @method diagonalMat4c
     * @static
     */
    diagonalMat4c(x, y, z, w) {
        return math.diagonalMat4v([x, y, z, w]);
    },

    /**
     * Returns a 4x4 matrix with diagonal elements set to the given scalar.
     * @method diagonalMat4s
     * @static
     */
    diagonalMat4s(s) {
        return math.diagonalMat4c(s, s, s, s);
    },

    /**
     * Returns a 4x4 identity matrix.
     * @method identityMat4
     * @static
     */
    identityMat4(mat = new FloatArrayType(16)) {
        mat[0] = 1.0;
        mat[1] = 0.0;
        mat[2] = 0.0;
        mat[3] = 0.0;

        mat[4] = 0.0;
        mat[5] = 1.0;
        mat[6] = 0.0;
        mat[7] = 0.0;

        mat[8] = 0.0;
        mat[9] = 0.0;
        mat[10] = 1.0;
        mat[11] = 0.0;

        mat[12] = 0.0;
        mat[13] = 0.0;
        mat[14] = 0.0;
        mat[15] = 1.0;

        return mat;
    },

    /**
     * Returns a 3x3 identity matrix.
     * @method identityMat3
     * @static
     */
    identityMat3(mat = new FloatArrayType(9)) {
        mat[0] = 1.0;
        mat[1] = 0.0;
        mat[2] = 0.0;

        mat[3] = 0.0;
        mat[4] = 1.0;
        mat[5] = 0.0;

        mat[6] = 0.0;
        mat[7] = 0.0;
        mat[8] = 1.0;

        return mat;
    },

    /**
     * Tests if the given 4x4 matrix is the identity matrix.
     * @method isIdentityMat4
     * @static
     */
    isIdentityMat4(m) {
        if (m[0] !== 1.0 || m[1] !== 0.0 || m[2] !== 0.0 || m[3] !== 0.0 ||
            m[4] !== 0.0 || m[5] !== 1.0 || m[6] !== 0.0 || m[7] !== 0.0 ||
            m[8] !== 0.0 || m[9] !== 0.0 || m[10] !== 1.0 || m[11] !== 0.0 ||
            m[12] !== 0.0 || m[13] !== 0.0 || m[14] !== 0.0 || m[15] !== 1.0) {
            return false;
        }
        return true;
    },

    /**
     * Negates the given 4x4 matrix.
     * @method negateMat4
     * @static
     */
    negateMat4(m, dest) {
        if (!dest) {
            dest = m;
        }
        dest[0] = -m[0];
        dest[1] = -m[1];
        dest[2] = -m[2];
        dest[3] = -m[3];
        dest[4] = -m[4];
        dest[5] = -m[5];
        dest[6] = -m[6];
        dest[7] = -m[7];
        dest[8] = -m[8];
        dest[9] = -m[9];
        dest[10] = -m[10];
        dest[11] = -m[11];
        dest[12] = -m[12];
        dest[13] = -m[13];
        dest[14] = -m[14];
        dest[15] = -m[15];
        return dest;
    },

    /**
     * Adds the given 4x4 matrices together.
     * @method addMat4
     * @static
     */
    addMat4(a, b, dest) {
        if (!dest) {
            dest = a;
        }
        dest[0] = a[0] + b[0];
        dest[1] = a[1] + b[1];
        dest[2] = a[2] + b[2];
        dest[3] = a[3] + b[3];
        dest[4] = a[4] + b[4];
        dest[5] = a[5] + b[5];
        dest[6] = a[6] + b[6];
        dest[7] = a[7] + b[7];
        dest[8] = a[8] + b[8];
        dest[9] = a[9] + b[9];
        dest[10] = a[10] + b[10];
        dest[11] = a[11] + b[11];
        dest[12] = a[12] + b[12];
        dest[13] = a[13] + b[13];
        dest[14] = a[14] + b[14];
        dest[15] = a[15] + b[15];
        return dest;
    },

    /**
     * Adds the given scalar to each element of the given 4x4 matrix.
     * @method addMat4Scalar
     * @static
     */
    addMat4Scalar(m, s, dest) {
        if (!dest) {
            dest = m;
        }
        dest[0] = m[0] + s;
        dest[1] = m[1] + s;
        dest[2] = m[2] + s;
        dest[3] = m[3] + s;
        dest[4] = m[4] + s;
        dest[5] = m[5] + s;
        dest[6] = m[6] + s;
        dest[7] = m[7] + s;
        dest[8] = m[8] + s;
        dest[9] = m[9] + s;
        dest[10] = m[10] + s;
        dest[11] = m[11] + s;
        dest[12] = m[12] + s;
        dest[13] = m[13] + s;
        dest[14] = m[14] + s;
        dest[15] = m[15] + s;
        return dest;
    },

    /**
     * Adds the given scalar to each element of the given 4x4 matrix.
     * @method addScalarMat4
     * @static
     */
    addScalarMat4(s, m, dest) {
        return math.addMat4Scalar(m, s, dest);
    },

    /**
     * Subtracts the second 4x4 matrix from the first.
     * @method subMat4
     * @static
     */
    subMat4(a, b, dest) {
        if (!dest) {
            dest = a;
        }
        dest[0] = a[0] - b[0];
        dest[1] = a[1] - b[1];
        dest[2] = a[2] - b[2];
        dest[3] = a[3] - b[3];
        dest[4] = a[4] - b[4];
        dest[5] = a[5] - b[5];
        dest[6] = a[6] - b[6];
        dest[7] = a[7] - b[7];
        dest[8] = a[8] - b[8];
        dest[9] = a[9] - b[9];
        dest[10] = a[10] - b[10];
        dest[11] = a[11] - b[11];
        dest[12] = a[12] - b[12];
        dest[13] = a[13] - b[13];
        dest[14] = a[14] - b[14];
        dest[15] = a[15] - b[15];
        return dest;
    },

    /**
     * Subtracts the given scalar from each element of the given 4x4 matrix.
     * @method subMat4Scalar
     * @static
     */
    subMat4Scalar(m, s, dest) {
        if (!dest) {
            dest = m;
        }
        dest[0] = m[0] - s;
        dest[1] = m[1] - s;
        dest[2] = m[2] - s;
        dest[3] = m[3] - s;
        dest[4] = m[4] - s;
        dest[5] = m[5] - s;
        dest[6] = m[6] - s;
        dest[7] = m[7] - s;
        dest[8] = m[8] - s;
        dest[9] = m[9] - s;
        dest[10] = m[10] - s;
        dest[11] = m[11] - s;
        dest[12] = m[12] - s;
        dest[13] = m[13] - s;
        dest[14] = m[14] - s;
        dest[15] = m[15] - s;
        return dest;
    },

    /**
     * Subtracts the given scalar from each element of the given 4x4 matrix.
     * @method subScalarMat4
     * @static
     */
    subScalarMat4(s, m, dest) {
        if (!dest) {
            dest = m;
        }
        dest[0] = s - m[0];
        dest[1] = s - m[1];
        dest[2] = s - m[2];
        dest[3] = s - m[3];
        dest[4] = s - m[4];
        dest[5] = s - m[5];
        dest[6] = s - m[6];
        dest[7] = s - m[7];
        dest[8] = s - m[8];
        dest[9] = s - m[9];
        dest[10] = s - m[10];
        dest[11] = s - m[11];
        dest[12] = s - m[12];
        dest[13] = s - m[13];
        dest[14] = s - m[14];
        dest[15] = s - m[15];
        return dest;
    },

    /**
     * Multiplies the two given 4x4 matrix by each other.
     * @method mulMat4
     * @static
     */
    mulMat4(a, b, dest) {
        if (!dest) {
            dest = a;
        }

        // Cache the matrix values (makes for huge speed increases!)
        const a00 = a[0];

        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a13 = a[7];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a23 = a[11];
        const a30 = a[12];
        const a31 = a[13];
        const a32 = a[14];
        const a33 = a[15];
        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b03 = b[3];
        const b10 = b[4];
        const b11 = b[5];
        const b12 = b[6];
        const b13 = b[7];
        const b20 = b[8];
        const b21 = b[9];
        const b22 = b[10];
        const b23 = b[11];
        const b30 = b[12];
        const b31 = b[13];
        const b32 = b[14];
        const b33 = b[15];

        dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return dest;
    },

    /**
     * Multiplies the two given 3x3 matrices by each other.
     * @method mulMat4
     * @static
     */
    mulMat3(a, b, dest) {
        if (!dest) {
            dest = new FloatArrayType(9);
        }

        const a11 = a[0];
        const a12 = a[3];
        const a13 = a[6];
        const a21 = a[1];
        const a22 = a[4];
        const a23 = a[7];
        const a31 = a[2];
        const a32 = a[5];
        const a33 = a[8];
        const b11 = b[0];
        const b12 = b[3];
        const b13 = b[6];
        const b21 = b[1];
        const b22 = b[4];
        const b23 = b[7];
        const b31 = b[2];
        const b32 = b[5];
        const b33 = b[8];

        dest[0] = a11 * b11 + a12 * b21 + a13 * b31;
        dest[3] = a11 * b12 + a12 * b22 + a13 * b32;
        dest[6] = a11 * b13 + a12 * b23 + a13 * b33;

        dest[1] = a21 * b11 + a22 * b21 + a23 * b31;
        dest[4] = a21 * b12 + a22 * b22 + a23 * b32;
        dest[7] = a21 * b13 + a22 * b23 + a23 * b33;

        dest[2] = a31 * b11 + a32 * b21 + a33 * b31;
        dest[5] = a31 * b12 + a32 * b22 + a33 * b32;
        dest[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return dest;
    },

    /**
     * Multiplies each element of the given 4x4 matrix by the given scalar.
     * @method mulMat4Scalar
     * @static
     */
    mulMat4Scalar(m, s, dest) {
        if (!dest) {
            dest = m;
        }
        dest[0] = m[0] * s;
        dest[1] = m[1] * s;
        dest[2] = m[2] * s;
        dest[3] = m[3] * s;
        dest[4] = m[4] * s;
        dest[5] = m[5] * s;
        dest[6] = m[6] * s;
        dest[7] = m[7] * s;
        dest[8] = m[8] * s;
        dest[9] = m[9] * s;
        dest[10] = m[10] * s;
        dest[11] = m[11] * s;
        dest[12] = m[12] * s;
        dest[13] = m[13] * s;
        dest[14] = m[14] * s;
        dest[15] = m[15] * s;
        return dest;
    },

    /**
     * Multiplies the given 4x4 matrix by the given four-element vector.
     * @method mulMat4v4
     * @static
     */
    mulMat4v4(m, v, dest = math.vec4()) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        dest[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3;
        dest[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3;
        dest[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3;
        dest[3] = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3;
        return dest;
    },

    /**
     * Transposes the given 4x4 matrix.
     * @method transposeMat4
     * @static
     */
    transposeMat4(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        const m4 = mat[4];

        const m14 = mat[14];
        const m8 = mat[8];
        const m13 = mat[13];
        const m12 = mat[12];
        const m9 = mat[9];
        if (!dest || mat === dest) {
            const a01 = mat[1];
            const a02 = mat[2];
            const a03 = mat[3];
            const a12 = mat[6];
            const a13 = mat[7];
            const a23 = mat[11];
            mat[1] = m4;
            mat[2] = m8;
            mat[3] = m12;
            mat[4] = a01;
            mat[6] = m9;
            mat[7] = m13;
            mat[8] = a02;
            mat[9] = a12;
            mat[11] = m14;
            mat[12] = a03;
            mat[13] = a13;
            mat[14] = a23;
            return mat;
        }
        dest[0] = mat[0];
        dest[1] = m4;
        dest[2] = m8;
        dest[3] = m12;
        dest[4] = mat[1];
        dest[5] = mat[5];
        dest[6] = m9;
        dest[7] = m13;
        dest[8] = mat[2];
        dest[9] = mat[6];
        dest[10] = mat[10];
        dest[11] = m14;
        dest[12] = mat[3];
        dest[13] = mat[7];
        dest[14] = mat[11];
        dest[15] = mat[15];
        return dest;
    },

    /**
     * Transposes the given 3x3 matrix.
     *
     * @method transposeMat3
     * @static
     */
    transposeMat3(mat, dest) {
        if (dest === mat) {
            const a01 = mat[1];
            const a02 = mat[2];
            const a12 = mat[5];
            dest[1] = mat[3];
            dest[2] = mat[6];
            dest[3] = a01;
            dest[5] = mat[7];
            dest[6] = a02;
            dest[7] = a12;
        } else {
            dest[0] = mat[0];
            dest[1] = mat[3];
            dest[2] = mat[6];
            dest[3] = mat[1];
            dest[4] = mat[4];
            dest[5] = mat[7];
            dest[6] = mat[2];
            dest[7] = mat[5];
            dest[8] = mat[8];
        }
        return dest;
    },

    /**
     * Returns the determinant of the given 4x4 matrix.
     * @method determinantMat4
     * @static
     */
    determinantMat4(mat) {
        // Cache the matrix values (makes for huge speed increases!)
        const a00 = mat[0];

        const a01 = mat[1];
        const a02 = mat[2];
        const a03 = mat[3];
        const a10 = mat[4];
        const a11 = mat[5];
        const a12 = mat[6];
        const a13 = mat[7];
        const a20 = mat[8];
        const a21 = mat[9];
        const a22 = mat[10];
        const a23 = mat[11];
        const a30 = mat[12];
        const a31 = mat[13];
        const a32 = mat[14];
        const a33 = mat[15];
        return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
            a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
            a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
            a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
            a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
            a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
    },

    /**
     * Returns the inverse of the given 4x4 matrix.
     * @method inverseMat4
     * @static
     */
    inverseMat4(mat, dest) {
        if (!dest) {
            dest = mat;
        }

        // Cache the matrix values (makes for huge speed increases!)
        const a00 = mat[0];

        const a01 = mat[1];
        const a02 = mat[2];
        const a03 = mat[3];
        const a10 = mat[4];
        const a11 = mat[5];
        const a12 = mat[6];
        const a13 = mat[7];
        const a20 = mat[8];
        const a21 = mat[9];
        const a22 = mat[10];
        const a23 = mat[11];
        const a30 = mat[12];
        const a31 = mat[13];
        const a32 = mat[14];
        const a33 = mat[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant (inlined to avoid double-caching)
        const invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

        dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
        dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return dest;
    },

    /**
     * Returns the trace of the given 4x4 matrix.
     * @method traceMat4
     * @static
     */
    traceMat4(m) {
        return (m[0] + m[5] + m[10] + m[15]);
    },

    /**
     * Returns 4x4 translation matrix.
     * @method translationMat4
     * @static
     */
    translationMat4v(v, dest) {
        const m = dest || math.identityMat4();
        m[12] = v[0];
        m[13] = v[1];
        m[14] = v[2];
        return m;
    },

    /**
     * Returns 3x3 translation matrix.
     * @method translationMat3
     * @static
     */
    translationMat3v(v, dest) {
        const m = dest || math.identityMat3();
        m[6] = v[0];
        m[7] = v[1];
        return m;
    },

    /**
     * Returns 4x4 translation matrix.
     * @method translationMat4c
     * @static
     */
    translationMat4c: ((() => {
        const xyz = new FloatArrayType(3);
        return (x, y, z, dest) => {
            xyz[0] = x;
            xyz[1] = y;
            xyz[2] = z;
            return math.translationMat4v(xyz, dest);
        };
    }))(),

    /**
     * Returns 4x4 translation matrix.
     * @method translationMat4s
     * @static
     */
    translationMat4s(s, dest) {
        return math.translationMat4c(s, s, s, dest);
    },

    /**
     * Efficiently post-concatenates a translation to the given matrix.
     * @param v
     * @param m
     */
    translateMat4v(xyz, m) {
        return math.translateMat4c(xyz[0], xyz[1], xyz[2], m);
    },

    /**
     * Efficiently post-concatenates a translation to the given matrix.
     * @param x
     * @param y
     * @param z
     * @param m
     */
    OLDtranslateMat4c(x, y, z, m) {

        const m12 = m[12];
        m[0] += m12 * x;
        m[4] += m12 * y;
        m[8] += m12 * z;

        const m13 = m[13];
        m[1] += m13 * x;
        m[5] += m13 * y;
        m[9] += m13 * z;

        const m14 = m[14];
        m[2] += m14 * x;
        m[6] += m14 * y;
        m[10] += m14 * z;

        const m15 = m[15];
        m[3] += m15 * x;
        m[7] += m15 * y;
        m[11] += m15 * z;

        return m;
    },

    translateMat4c(x, y, z, m) {

        const m3 = m[3];
        m[0] += m3 * x;
        m[1] += m3 * y;
        m[2] += m3 * z;

        const m7 = m[7];
        m[4] += m7 * x;
        m[5] += m7 * y;
        m[6] += m7 * z;

        const m11 = m[11];
        m[8] += m11 * x;
        m[9] += m11 * y;
        m[10] += m11 * z;

        const m15 = m[15];
        m[12] += m15 * x;
        m[13] += m15 * y;
        m[14] += m15 * z;

        return m;
    },
    /**
     * Returns 4x4 rotation matrix.
     * @method rotationMat4v
     * @static
     */
    rotationMat4v(anglerad, axis, m) {
        const ax = math.normalizeVec4([axis[0], axis[1], axis[2], 0.0], []);
        const s = Math.sin(anglerad);
        const c = Math.cos(anglerad);
        const q = 1.0 - c;

        const x = ax[0];
        const y = ax[1];
        const z = ax[2];

        let xy;
        let yz;
        let zx;
        let xs;
        let ys;
        let zs;

        //xx = x * x; used once
        //yy = y * y; used once
        //zz = z * z; used once
        xy = x * y;
        yz = y * z;
        zx = z * x;
        xs = x * s;
        ys = y * s;
        zs = z * s;

        m = m || math.mat4();

        m[0] = (q * x * x) + c;
        m[1] = (q * xy) + zs;
        m[2] = (q * zx) - ys;
        m[3] = 0.0;

        m[4] = (q * xy) - zs;
        m[5] = (q * y * y) + c;
        m[6] = (q * yz) + xs;
        m[7] = 0.0;

        m[8] = (q * zx) + ys;
        m[9] = (q * yz) - xs;
        m[10] = (q * z * z) + c;
        m[11] = 0.0;

        m[12] = 0.0;
        m[13] = 0.0;
        m[14] = 0.0;
        m[15] = 1.0;

        return m;
    },

    /**
     * Returns 4x4 rotation matrix.
     * @method rotationMat4c
     * @static
     */
    rotationMat4c(anglerad, x, y, z, mat) {
        return math.rotationMat4v(anglerad, [x, y, z], mat);
    },

    /**
     * Returns 4x4 scale matrix.
     * @method scalingMat4v
     * @static
     */
    scalingMat4v(v, m = math.identityMat4()) {
        m[0] = v[0];
        m[5] = v[1];
        m[10] = v[2];
        return m;
    },

    /**
     * Returns 3x3 scale matrix.
     * @method scalingMat3v
     * @static
     */
    scalingMat3v(v, m = math.identityMat3()) {
        m[0] = v[0];
        m[4] = v[1];
        return m;
    },

    /**
     * Returns 4x4 scale matrix.
     * @method scalingMat4c
     * @static
     */
    scalingMat4c: ((() => {
        const xyz = new FloatArrayType(3);
        return (x, y, z, dest) => {
            xyz[0] = x;
            xyz[1] = y;
            xyz[2] = z;
            return math.scalingMat4v(xyz, dest);
        };
    }))(),

    /**
     * Efficiently post-concatenates a scaling to the given matrix.
     * @method scaleMat4c
     * @param x
     * @param y
     * @param z
     * @param m
     */
    scaleMat4c(x, y, z, m) {

        m[0] *= x;
        m[4] *= y;
        m[8] *= z;

        m[1] *= x;
        m[5] *= y;
        m[9] *= z;

        m[2] *= x;
        m[6] *= y;
        m[10] *= z;

        m[3] *= x;
        m[7] *= y;
        m[11] *= z;
        return m;
    },

    /**
     * Efficiently post-concatenates a scaling to the given matrix.
     * @method scaleMat4c
     * @param xyz
     * @param m
     */
    scaleMat4v(xyz, m) {

        const x = xyz[0];
        const y = xyz[1];
        const z = xyz[2];

        m[0] *= x;
        m[4] *= y;
        m[8] *= z;
        m[1] *= x;
        m[5] *= y;
        m[9] *= z;
        m[2] *= x;
        m[6] *= y;
        m[10] *= z;
        m[3] *= x;
        m[7] *= y;
        m[11] *= z;

        return m;
    },

    /**
     * Returns 4x4 scale matrix.
     * @method scalingMat4s
     * @static
     */
    scalingMat4s(s) {
        return math.scalingMat4c(s, s, s);
    },

    /**
     * Creates a matrix from a quaternion rotation and vector translation
     *
     * @param {Number[]} q Rotation quaternion
     * @param {Number[]} v Translation vector
     * @param {Number[]} dest Destination matrix
     * @returns {Number[]} dest
     */
    rotationTranslationMat4(q, v, dest = math.mat4()) {
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        dest[0] = 1 - (yy + zz);
        dest[1] = xy + wz;
        dest[2] = xz - wy;
        dest[3] = 0;
        dest[4] = xy - wz;
        dest[5] = 1 - (xx + zz);
        dest[6] = yz + wx;
        dest[7] = 0;
        dest[8] = xz + wy;
        dest[9] = yz - wx;
        dest[10] = 1 - (xx + yy);
        dest[11] = 0;
        dest[12] = v[0];
        dest[13] = v[1];
        dest[14] = v[2];
        dest[15] = 1;

        return dest;
    },

    /**
     * Gets Euler angles from a 4x4 matrix.
     *
     * @param {Number[]} mat The 4x4 matrix.
     * @param {String} order Desired Euler angle order: "XYZ", "YXZ", "ZXY" etc.
     * @param {Number[]} [dest] Destination Euler angles, created by default.
     * @returns {Number[]} The Euler angles.
     */
    mat4ToEuler(mat, order, dest = math.vec4()) {
        const clamp = math.clamp;

        // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        const m11 = mat[0];

        const m12 = mat[4];
        const m13 = mat[8];
        const m21 = mat[1];
        const m22 = mat[5];
        const m23 = mat[9];
        const m31 = mat[2];
        const m32 = mat[6];
        const m33 = mat[10];

        if (order === 'XYZ') {

            dest[1] = Math.asin(clamp(m13, -1, 1));

            if (Math.abs(m13) < 0.99999) {
                dest[0] = Math.atan2(-m23, m33);
                dest[2] = Math.atan2(-m12, m11);
            } else {
                dest[0] = Math.atan2(m32, m22);
                dest[2] = 0;

            }

        } else if (order === 'YXZ') {

            dest[0] = Math.asin(-clamp(m23, -1, 1));

            if (Math.abs(m23) < 0.99999) {
                dest[1] = Math.atan2(m13, m33);
                dest[2] = Math.atan2(m21, m22);
            } else {
                dest[1] = Math.atan2(-m31, m11);
                dest[2] = 0;
            }

        } else if (order === 'ZXY') {

            dest[0] = Math.asin(clamp(m32, -1, 1));

            if (Math.abs(m32) < 0.99999) {
                dest[1] = Math.atan2(-m31, m33);
                dest[2] = Math.atan2(-m12, m22);
            } else {
                dest[1] = 0;
                dest[2] = Math.atan2(m21, m11);
            }

        } else if (order === 'ZYX') {

            dest[1] = Math.asin(-clamp(m31, -1, 1));

            if (Math.abs(m31) < 0.99999) {
                dest[0] = Math.atan2(m32, m33);
                dest[2] = Math.atan2(m21, m11);
            } else {
                dest[0] = 0;
                dest[2] = Math.atan2(-m12, m22);
            }

        } else if (order === 'YZX') {

            dest[2] = Math.asin(clamp(m21, -1, 1));

            if (Math.abs(m21) < 0.99999) {
                dest[0] = Math.atan2(-m23, m22);
                dest[1] = Math.atan2(-m31, m11);
            } else {
                dest[0] = 0;
                dest[1] = Math.atan2(m13, m33);
            }

        } else if (order === 'XZY') {

            dest[2] = Math.asin(-clamp(m12, -1, 1));

            if (Math.abs(m12) < 0.99999) {
                dest[0] = Math.atan2(m32, m22);
                dest[1] = Math.atan2(m13, m11);
            } else {
                dest[0] = Math.atan2(-m23, m33);
                dest[1] = 0;
            }
        }

        return dest;
    },

    composeMat4(position, quaternion, scale, mat = math.mat4()) {
        math.quaternionToRotationMat4(quaternion, mat);
        math.scaleMat4v(scale, mat);
        math.translateMat4v(position, mat);

        return mat;
    },

    decomposeMat4: (() => {

        const vec = new FloatArrayType(3);
        const matrix = new FloatArrayType(16);

        return function decompose(mat, position, quaternion, scale) {

            vec[0] = mat[0];
            vec[1] = mat[1];
            vec[2] = mat[2];

            let sx = math.lenVec3(vec);

            vec[0] = mat[4];
            vec[1] = mat[5];
            vec[2] = mat[6];

            const sy = math.lenVec3(vec);

            vec[8] = mat[8];
            vec[9] = mat[9];
            vec[10] = mat[10];

            const sz = math.lenVec3(vec);

            // if determine is negative, we need to invert one scale
            const det = math.determinantMat4(mat);

            if (det < 0) {
                sx = -sx;
            }

            position[0] = mat[12];
            position[1] = mat[13];
            position[2] = mat[14];

            // scale the rotation part
            matrix.set(mat);

            const invSX = 1 / sx;
            const invSY = 1 / sy;
            const invSZ = 1 / sz;

            matrix[0] *= invSX;
            matrix[1] *= invSX;
            matrix[2] *= invSX;

            matrix[4] *= invSY;
            matrix[5] *= invSY;
            matrix[6] *= invSY;

            matrix[8] *= invSZ;
            matrix[9] *= invSZ;
            matrix[10] *= invSZ;

            math.mat4ToQuaternion(matrix, quaternion);

            scale[0] = sx;
            scale[1] = sy;
            scale[2] = sz;

            return this;

        };

    })(),

    /**
     * Returns a 4x4 'lookat' viewing transform matrix.
     * @method lookAtMat4v
     * @param pos vec3 position of the viewer
     * @param target vec3 point the viewer is looking at
     * @param up vec3 pointing "up"
     * @param dest mat4 Optional, mat4 matrix will be written into
     *
     * @return {mat4} dest if specified, a new mat4 otherwise
     */
    lookAtMat4v(pos, target, up, dest) {
        if (!dest) {
            dest = math.mat4();
        }

        const posx = pos[0];
        const posy = pos[1];
        const posz = pos[2];
        const upx = up[0];
        const upy = up[1];
        const upz = up[2];
        const targetx = target[0];
        const targety = target[1];
        const targetz = target[2];

        if (posx === targetx && posy === targety && posz === targetz) {
            return math.identityMat4();
        }

        let z0;
        let z1;
        let z2;
        let x0;
        let x1;
        let x2;
        let y0;
        let y1;
        let y2;
        let len;

        //vec3.direction(eye, center, z);
        z0 = posx - targetx;
        z1 = posy - targety;
        z2 = posz - targetz;

        // normalize (no check needed for 0 because of early return)
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        //vec3.normalize(vec3.cross(up, z, x));
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        //vec3.normalize(vec3.cross(z, x, y));
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        dest[0] = x0;
        dest[1] = y0;
        dest[2] = z0;
        dest[3] = 0;
        dest[4] = x1;
        dest[5] = y1;
        dest[6] = z1;
        dest[7] = 0;
        dest[8] = x2;
        dest[9] = y2;
        dest[10] = z2;
        dest[11] = 0;
        dest[12] = -(x0 * posx + x1 * posy + x2 * posz);
        dest[13] = -(y0 * posx + y1 * posy + y2 * posz);
        dest[14] = -(z0 * posx + z1 * posy + z2 * posz);
        dest[15] = 1;

        return dest;
    },

    /**
     * Returns a 4x4 'lookat' viewing transform matrix.
     * @method lookAtMat4c
     * @static
     */
    lookAtMat4c(posx, posy, posz, targetx, targety, targetz, upx, upy, upz) {
        return math.lookAtMat4v([posx, posy, posz], [targetx, targety, targetz], [upx, upy, upz], []);
    },

    /**
     * Returns a 4x4 orthographic projection matrix.
     * @method orthoMat4c
     * @static
     */
    orthoMat4c(left, right, bottom, top, near, far, dest) {
        if (!dest) {
            dest = math.mat4();
        }
        const rl = (right - left);
        const tb = (top - bottom);
        const fn = (far - near);

        dest[0] = 2.0 / rl;
        dest[1] = 0.0;
        dest[2] = 0.0;
        dest[3] = 0.0;

        dest[4] = 0.0;
        dest[5] = 2.0 / tb;
        dest[6] = 0.0;
        dest[7] = 0.0;

        dest[8] = 0.0;
        dest[9] = 0.0;
        dest[10] = -2.0 / fn;
        dest[11] = 0.0;

        dest[12] = -(left + right) / rl;
        dest[13] = -(top + bottom) / tb;
        dest[14] = -(far + near) / fn;
        dest[15] = 1.0;

        return dest;
    },

    /**
     * Returns a 4x4 perspective projection matrix.
     * @method frustumMat4v
     * @static
     */
    frustumMat4v(fmin, fmax, m) {
        if (!m) {
            m = math.mat4();
        }

        const fmin4 = [fmin[0], fmin[1], fmin[2], 0.0];
        const fmax4 = [fmax[0], fmax[1], fmax[2], 0.0];

        math.addVec4(fmax4, fmin4, tempMat1);
        math.subVec4(fmax4, fmin4, tempMat2);

        const t = 2.0 * fmin4[2];

        const tempMat20 = tempMat2[0];
        const tempMat21 = tempMat2[1];
        const tempMat22 = tempMat2[2];

        m[0] = t / tempMat20;
        m[1] = 0.0;
        m[2] = 0.0;
        m[3] = 0.0;

        m[4] = 0.0;
        m[5] = t / tempMat21;
        m[6] = 0.0;
        m[7] = 0.0;

        m[8] = tempMat1[0] / tempMat20;
        m[9] = tempMat1[1] / tempMat21;
        m[10] = -tempMat1[2] / tempMat22;
        m[11] = -1.0;

        m[12] = 0.0;
        m[13] = 0.0;
        m[14] = -t * fmax4[2] / tempMat22;
        m[15] = 0.0;

        return m;
    },

    /**
     * Returns a 4x4 perspective projection matrix.
     * @method frustumMat4v
     * @static
     */
    frustumMat4(left, right, bottom, top, near, far, dest) {
        if (!dest) {
            dest = math.mat4();
        }
        const rl = (right - left);
        const tb = (top - bottom);
        const fn = (far - near);
        dest[0] = (near * 2) / rl;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = (near * 2) / tb;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = (right + left) / rl;
        dest[9] = (top + bottom) / tb;
        dest[10] = -(far + near) / fn;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far * near * 2) / fn;
        dest[15] = 0;
        return dest;
    },

    /**
     * Returns a 4x4 perspective projection matrix.
     * @method perspectiveMat4v
     * @static
     */
    perspectiveMat4(fovyrad, aspectratio, znear, zfar, m) {
        const pmin = [];
        const pmax = [];

        pmin[2] = znear;
        pmax[2] = zfar;

        pmax[1] = pmin[2] * Math.tan(fovyrad / 2.0);
        pmin[1] = -pmax[1];

        pmax[0] = pmax[1] * aspectratio;
        pmin[0] = -pmax[0];

        return math.frustumMat4v(pmin, pmax, m);
    },

    /**
     * Transforms a three-element position by a 4x4 matrix.
     * @method transformPoint3
     * @static
     */
    transformPoint3(m, p, dest = math.vec3()) {

        const x = p[0];
        const y = p[1];
        const z = p[2];

        dest[0] = (m[0] * x) + (m[4] * y) + (m[8] * z) + m[12];
        dest[1] = (m[1] * x) + (m[5] * y) + (m[9] * z) + m[13];
        dest[2] = (m[2] * x) + (m[6] * y) + (m[10] * z) + m[14];

        return dest;
    },

    /**
     * Transforms a homogeneous coordinate by a 4x4 matrix.
     * @method transformPoint3
     * @static
     */
    transformPoint4(m, v, dest = math.vec4()) {
        dest[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
        dest[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
        dest[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
        dest[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];

        return dest;
    },


    /**
     * Transforms an array of three-element positions by a 4x4 matrix.
     * @method transformPoints3
     * @static
     */
    transformPoints3(m, points, points2) {
        const result = points2 || [];
        const len = points.length;
        let p0;
        let p1;
        let p2;
        let pi;

        // cache values
        const m0 = m[0];

        const m1 = m[1];
        const m2 = m[2];
        const m3 = m[3];
        const m4 = m[4];
        const m5 = m[5];
        const m6 = m[6];
        const m7 = m[7];
        const m8 = m[8];
        const m9 = m[9];
        const m10 = m[10];
        const m11 = m[11];
        const m12 = m[12];
        const m13 = m[13];
        const m14 = m[14];
        const m15 = m[15];

        let r;

        for (let i = 0; i < len; ++i) {

            // cache values
            pi = points[i];

            p0 = pi[0];
            p1 = pi[1];
            p2 = pi[2];

            r = result[i] || (result[i] = [0, 0, 0]);

            r[0] = (m0 * p0) + (m4 * p1) + (m8 * p2) + m12;
            r[1] = (m1 * p0) + (m5 * p1) + (m9 * p2) + m13;
            r[2] = (m2 * p0) + (m6 * p1) + (m10 * p2) + m14;
            r[3] = (m3 * p0) + (m7 * p1) + (m11 * p2) + m15;
        }

        result.length = len;

        return result;
    },

    /**
     * Transforms an array of positions by a 4x4 matrix.
     * @method transformPositions3
     * @static
     */
    transformPositions3(m, p, p2 = p) {
        let i;
        const len = p.length;

        let x;
        let y;
        let z;

        const m0 = m[0];
        const m1 = m[1];
        const m2 = m[2];
        const m3 = m[3];
        const m4 = m[4];
        const m5 = m[5];
        const m6 = m[6];
        const m7 = m[7];
        const m8 = m[8];
        const m9 = m[9];
        const m10 = m[10];
        const m11 = m[11];
        const m12 = m[12];
        const m13 = m[13];
        const m14 = m[14];
        const m15 = m[15];

        for (i = 0; i < len; i += 3) {

            x = p[i + 0];
            y = p[i + 1];
            z = p[i + 2];

            p2[i + 0] = (m0 * x) + (m4 * y) + (m8 * z) + m12;
            p2[i + 1] = (m1 * x) + (m5 * y) + (m9 * z) + m13;
            p2[i + 2] = (m2 * x) + (m6 * y) + (m10 * z) + m14;
            p2[i + 3] = (m3 * x) + (m7 * y) + (m11 * z) + m15;
        }

        return p2;
    },

    /**
     * Transforms an array of positions by a 4x4 matrix.
     * @method transformPositions4
     * @static
     */
    transformPositions4(m, p, p2 = p) {
        let i;
        const len = p.length;

        let x;
        let y;
        let z;

        const m0 = m[0];
        const m1 = m[1];
        const m2 = m[2];
        const m3 = m[3];
        const m4 = m[4];
        const m5 = m[5];
        const m6 = m[6];
        const m7 = m[7];
        const m8 = m[8];
        const m9 = m[9];
        const m10 = m[10];
        const m11 = m[11];
        const m12 = m[12];
        const m13 = m[13];
        const m14 = m[14];
        const m15 = m[15];

        for (i = 0; i < len; i += 4) {

            x = p[i + 0];
            y = p[i + 1];
            z = p[i + 2];

            p2[i + 0] = (m0 * x) + (m4 * y) + (m8 * z) + m12;
            p2[i + 1] = (m1 * x) + (m5 * y) + (m9 * z) + m13;
            p2[i + 2] = (m2 * x) + (m6 * y) + (m10 * z) + m14;
            p2[i + 3] = (m3 * x) + (m7 * y) + (m11 * z) + m15;
        }

        return p2;
    },

    /**
     * Transforms a three-element vector by a 4x4 matrix.
     * @method transformVec3
     * @static
     */
    transformVec3(m, v, dest) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        dest = dest || this.vec3();
        dest[0] = (m[0] * v0) + (m[4] * v1) + (m[8] * v2);
        dest[1] = (m[1] * v0) + (m[5] * v1) + (m[9] * v2);
        dest[2] = (m[2] * v0) + (m[6] * v1) + (m[10] * v2);
        return dest;
    },

    /**
     * Transforms a four-element vector by a 4x4 matrix.
     * @method transformVec4
     * @static
     */
    transformVec4(m, v, dest) {
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const v3 = v[3];
        dest = dest || math.vec4();
        dest[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12] * v3;
        dest[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13] * v3;
        dest[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14] * v3;
        dest[3] = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15] * v3;
        return dest;
    },

    /**
     * Rotate a 3D vector around the x-axis
     *
     * @method rotateVec3X
     * @param {Number[]} a The vec3 point to rotate
     * @param {Number[]} b The origin of the rotation
     * @param {Number} c The angle of rotation
     * @param {Number[]} dest The receiving vec3
     * @returns {Number[]} dest
     * @static
     */
    rotateVec3X(a, b, c, dest) {
        const p = [];
        const r = [];

        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];

        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
        r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

        //translate to correct position
        dest[0] = r[0] + b[0];
        dest[1] = r[1] + b[1];
        dest[2] = r[2] + b[2];

        return dest;
    },

    /**
     * Rotate a 3D vector around the y-axis
     *
     * @method rotateVec3Y
     * @param {Number[]} a The vec3 point to rotate
     * @param {Number[]} b The origin of the rotation
     * @param {Number} c The angle of rotation
     * @param {Number[]} dest The receiving vec3
     * @returns {Number[]} dest
     * @static
     */
    rotateVec3Y(a, b, c, dest) {
        const p = [];
        const r = [];

        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];

        //perform rotation
        r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
        r[1] = p[1];
        r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

        //translate to correct position
        dest[0] = r[0] + b[0];
        dest[1] = r[1] + b[1];
        dest[2] = r[2] + b[2];

        return dest;
    },

    /**
     * Rotate a 3D vector around the z-axis
     *
     * @method rotateVec3Z
     * @param {Number[]} a The vec3 point to rotate
     * @param {Number[]} b The origin of the rotation
     * @param {Number} c The angle of rotation
     * @param {Number[]} dest The receiving vec3
     * @returns {Number[]} dest
     * @static
     */
    rotateVec3Z(a, b, c, dest) {
        const p = [];
        const r = [];

        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];

        //perform rotation
        r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
        r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
        r[2] = p[2];

        //translate to correct position
        dest[0] = r[0] + b[0];
        dest[1] = r[1] + b[1];
        dest[2] = r[2] + b[2];

        return dest;
    },

    /**
     * Transforms a four-element vector by a 4x4 projection matrix.
     *
     * @method projectVec4
     * @param {Number[]} p 3D View-space coordinate
     * @param {Number[]} q 2D Projected coordinate
     * @returns {Number[]} 2D Projected coordinate
     * @static
     */
    projectVec4(p, q) {
        const f = 1.0 / p[3];
        q = q || math.vec2();
        q[0] = v[0] * f;
        q[1] = v[1] * f;
        return q;
    },

    /**
     * Unprojects a three-element vector.
     *
     * @method unprojectVec3
     * @param {Number[]} p 3D Projected coordinate
     * @param {Number[]} viewMat View matrix
     * @returns {Number[]} projMat Projection matrix
     * @static
     */
    unprojectVec3: ((() => {
        const mat = new FloatArrayType(16);
        const mat2 = new FloatArrayType(16);
        const mat3 = new FloatArrayType(16);
        return function (p, viewMat, projMat, q) {
            return this.transformVec3(this.mulMat4(this.inverseMat4(viewMat, mat), this.inverseMat4(projMat, mat2), mat3), p, q)
        };
    }))(),

    /**
     * Linearly interpolates between two 3D vectors.
     * @method lerpVec3
     * @static
     */
    lerpVec3(t, t1, t2, p1, p2, dest) {
        const result = dest || math.vec3();
        const f = (t - t1) / (t2 - t1);
        result[0] = p1[0] + (f * (p2[0] - p1[0]));
        result[1] = p1[1] + (f * (p2[1] - p1[1]));
        result[2] = p1[2] + (f * (p2[2] - p1[2]));
        return result;
    },


    /**
     * Flattens a two-dimensional array into a one-dimensional array.
     *
     * @method flatten
     * @static
     * @param {Array of Arrays} a A 2D array
     * @returns Flattened 1D array
     */
    flatten(a) {

        const result = [];

        let i;
        let leni;
        let j;
        let lenj;
        let item;

        for (i = 0, leni = a.length; i < leni; i++) {
            item = a[i];
            for (j = 0, lenj = item.length; j < lenj; j++) {
                result.push(item[j]);
            }
        }

        return result;
    },


    identityQuaternion(dest = math.vec4()) {
        dest[0] = 0.0;
        dest[1] = 0.0;
        dest[2] = 0.0;
        dest[3] = 1.0;
        return dest;
    },

    /**
     * Initializes a quaternion from Euler angles.
     *
     * @param {Number[]} euler The Euler angles.
     * @param {String} order Euler angle order: "XYZ", "YXZ", "ZXY" etc.
     * @param {Number[]} [dest] Destination quaternion, created by default.
     * @returns {Number[]} The quaternion.
     */
    eulerToQuaternion(euler, order, dest = math.vec4()) {
        // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m

        const a = (euler[0] * math.DEGTORAD) / 2;
        const b = (euler[1] * math.DEGTORAD) / 2;
        const c = (euler[2] * math.DEGTORAD) / 2;

        const c1 = Math.cos(a);
        const c2 = Math.cos(b);
        const c3 = Math.cos(c);
        const s1 = Math.sin(a);
        const s2 = Math.sin(b);
        const s3 = Math.sin(c);

        if (order === 'XYZ') {

            dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'YXZ') {

            dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 + s1 * s2 * s3;

        } else if (order === 'ZXY') {

            dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'ZYX') {

            dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 + s1 * s2 * s3;

        } else if (order === 'YZX') {

            dest[0] = s1 * c2 * c3 + c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 + s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 - s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 - s1 * s2 * s3;

        } else if (order === 'XZY') {

            dest[0] = s1 * c2 * c3 - c1 * s2 * s3;
            dest[1] = c1 * s2 * c3 - s1 * c2 * s3;
            dest[2] = c1 * c2 * s3 + s1 * s2 * c3;
            dest[3] = c1 * c2 * c3 + s1 * s2 * s3;
        }

        return dest;
    },

    mat4ToQuaternion(m, dest = math.vec4()) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        const m11 = m[0];
        const m12 = m[4];
        const m13 = m[8];
        const m21 = m[1];
        const m22 = m[5];
        const m23 = m[9];
        const m31 = m[2];
        const m32 = m[6];
        const m33 = m[10];
        let s;

        const trace = m11 + m22 + m33;

        if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);

            dest[3] = 0.25 / s;
            dest[0] = (m32 - m23) * s;
            dest[1] = (m13 - m31) * s;
            dest[2] = (m21 - m12) * s;

        } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            dest[3] = (m32 - m23) / s;
            dest[0] = 0.25 * s;
            dest[1] = (m12 + m21) / s;
            dest[2] = (m13 + m31) / s;

        } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            dest[3] = (m13 - m31) / s;
            dest[0] = (m12 + m21) / s;
            dest[1] = 0.25 * s;
            dest[2] = (m23 + m32) / s;

        } else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            dest[3] = (m21 - m12) / s;
            dest[0] = (m13 + m31) / s;
            dest[1] = (m23 + m32) / s;
            dest[2] = 0.25 * s;
        }

        return dest;
    },

    vec3PairToQuaternion(u, v, dest = math.vec4()) {
        const norm_u_norm_v = Math.sqrt(math.dotVec3(u, u) * math.dotVec3(v, v));
        let real_part = norm_u_norm_v + math.dotVec3(u, v);

        if (real_part < 0.00000001 * norm_u_norm_v) {

            // If u and v are exactly opposite, rotate 180 degrees
            // around an arbitrary orthogonal axis. Axis normalisation
            // can happen later, when we normalise the quaternion.

            real_part = 0.0;

            if (Math.abs(u[0]) > Math.abs(u[2])) {

                dest[0] = -u[1];
                dest[1] = u[0];
                dest[2] = 0;

            } else {
                dest[0] = 0;
                dest[1] = -u[2];
                dest[2] = u[1];
            }

        } else {

            // Otherwise, build quaternion the standard way.
            math.cross3Vec3(u, v, dest);
        }

        dest[3] = real_part;

        return math.normalizeQuaternion(dest);
    },

    angleAxisToQuaternion(angleAxis, dest = math.vec4()) {
        const halfAngle = angleAxis[3] / 2.0;
        const fsin = Math.sin(halfAngle);
        dest[0] = fsin * angleAxis[0];
        dest[1] = fsin * angleAxis[1];
        dest[2] = fsin * angleAxis[2];
        dest[3] = Math.cos(halfAngle);
        return dest;
    },

    quaternionToEuler: ((() => {
        const mat = new FloatArrayType(16);
        return (q, order, dest) => {
            dest = dest || math.vec3();
            math.quaternionToRotationMat4(q, mat);
            math.mat4ToEuler(mat, order, dest);
            return dest;
        };
    }))(),

    mulQuaternions(p, q, dest = math.vec4()) {
        const p0 = p[0];
        const p1 = p[1];
        const p2 = p[2];
        const p3 = p[3];
        const q0 = q[0];
        const q1 = q[1];
        const q2 = q[2];
        const q3 = q[3];
        dest[0] = p3 * q0 + p0 * q3 + p1 * q2 - p2 * q1;
        dest[1] = p3 * q1 + p1 * q3 + p2 * q0 - p0 * q2;
        dest[2] = p3 * q2 + p2 * q3 + p0 * q1 - p1 * q0;
        dest[3] = p3 * q3 - p0 * q0 - p1 * q1 - p2 * q2;
        return dest;
    },

    vec3ApplyQuaternion(q, vec, dest = math.vec3()) {
        const x = vec[0];
        const y = vec[1];
        const z = vec[2];

        const qx = q[0];
        const qy = q[1];
        const qz = q[2];
        const qw = q[3];

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return dest;
    },

    quaternionToMat4(q, dest) {

        dest = math.identityMat4(dest);

        const q0 = q[0];  //x
        const q1 = q[1];  //y
        const q2 = q[2];  //z
        const q3 = q[3];  //w

        const tx = 2.0 * q0;
        const ty = 2.0 * q1;
        const tz = 2.0 * q2;

        const twx = tx * q3;
        const twy = ty * q3;
        const twz = tz * q3;

        const txx = tx * q0;
        const txy = ty * q0;
        const txz = tz * q0;

        const tyy = ty * q1;
        const tyz = tz * q1;
        const tzz = tz * q2;

        dest[0] = 1.0 - (tyy + tzz);
        dest[1] = txy + twz;
        dest[2] = txz - twy;

        dest[4] = txy - twz;
        dest[5] = 1.0 - (txx + tzz);
        dest[6] = tyz + twx;

        dest[8] = txz + twy;
        dest[9] = tyz - twx;

        dest[10] = 1.0 - (txx + tyy);

        return dest;
    },

    quaternionToRotationMat4(q, m) {
        const x = q[0];
        const y = q[1];
        const z = q[2];
        const w = q[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        m[0] = 1 - (yy + zz);
        m[4] = xy - wz;
        m[8] = xz + wy;

        m[1] = xy + wz;
        m[5] = 1 - (xx + zz);
        m[9] = yz - wx;

        m[2] = xz - wy;
        m[6] = yz + wx;
        m[10] = 1 - (xx + yy);

        // last column
        m[3] = 0;
        m[7] = 0;
        m[11] = 0;

        // bottom row
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;

        return m;
    },

    normalizeQuaternion(q, dest = q) {
        const len = math.lenVec4([q[0], q[1], q[2], q[3]]);
        dest[0] = q[0] / len;
        dest[1] = q[1] / len;
        dest[2] = q[2] / len;
        dest[3] = q[3] / len;
        return dest;
    },

    conjugateQuaternion(q, dest = q) {
        dest[0] = -q[0];
        dest[1] = -q[1];
        dest[2] = -q[2];
        dest[3] = q[3];
        return dest;
    },

    inverseQuaternion(q, dest) {
        return math.normalizeQuaternion(math.conjugateQuaternion(q, dest));
    },

    quaternionToAngleAxis(q, angleAxis = math.vec4()) {
        q = math.normalizeQuaternion(q, tempVec4);
        const q3 = q[3];
        const angle = 2 * Math.acos(q3);
        const s = Math.sqrt(1 - q3 * q3);
        if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
            angleAxis[0] = q[0];
            angleAxis[1] = q[1];
            angleAxis[2] = q[2];
        } else {
            angleAxis[0] = q[0] / s;
            angleAxis[1] = q[1] / s;
            angleAxis[2] = q[2] / s;
        }
        angleAxis[3] = angle; // * 57.295779579;
        return angleAxis;
    },

    //------------------------------------------------------------------------------------------------------------------
    // Boundaries
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Returns a new, uninitialized 3D axis-aligned bounding box.
     *
     * @private
     */
    AABB3(values) {
        return new FloatArrayType(values || 6);
    },

    /**
     * Returns a new, uninitialized 2D axis-aligned bounding box.
     *
     * @private
     */
    AABB2(values) {
        return new FloatArrayType(values || 4);
    },

    /**
     * Returns a new, uninitialized 3D oriented bounding box (OBB).
     *
     * @private
     */
    OBB3(values) {
        return new FloatArrayType(values || 32);
    },

    /**
     * Returns a new, uninitialized 2D oriented bounding box (OBB).
     *
     * @private
     */
    OBB2(values) {
        return new FloatArrayType(values || 16);
    },

    /** Returns a new 3D bounding sphere */
    Sphere3(x, y, z, r) {
        return new FloatArrayType([x, y, z, r]);
    },

    /**
     * Transforms an OBB3 by a 4x4 matrix.
     *
     * @private
     */
    transformOBB3(m, p, p2 = p) {
        let i;
        const len = p.length;

        let x;
        let y;
        let z;

        const m0 = m[0];
        const m1 = m[1];
        const m2 = m[2];
        const m3 = m[3];
        const m4 = m[4];
        const m5 = m[5];
        const m6 = m[6];
        const m7 = m[7];
        const m8 = m[8];
        const m9 = m[9];
        const m10 = m[10];
        const m11 = m[11];
        const m12 = m[12];
        const m13 = m[13];
        const m14 = m[14];
        const m15 = m[15];

        for (i = 0; i < len; i += 4) {

            x = p[i + 0];
            y = p[i + 1];
            z = p[i + 2];

            p2[i + 0] = (m0 * x) + (m4 * y) + (m8 * z) + m12;
            p2[i + 1] = (m1 * x) + (m5 * y) + (m9 * z) + m13;
            p2[i + 2] = (m2 * x) + (m6 * y) + (m10 * z) + m14;
            p2[i + 3] = (m3 * x) + (m7 * y) + (m11 * z) + m15;
        }

        return p2;
    },

    /** Returns true if the first AABB contains the second AABB.
     * @param aabb1
     * @param aabb2
     * @returns {boolean}
     */
    containsAABB3: function (aabb1, aabb2) {
        const result = (
            aabb1[0] <= aabb2[0] && aabb2[3] <= aabb1[3] &&
            aabb1[1] <= aabb2[1] && aabb2[4] <= aabb1[4] &&
            aabb1[2] <= aabb2[2] && aabb2[5] <= aabb1[5]);
        return result;
    },

    /**
     * Gets the diagonal size of an AABB3 given as minima and maxima.
     *
     * @private
     */
    getAABB3Diag: ((() => {

        const min = new FloatArrayType(3);
        const max = new FloatArrayType(3);
        const tempVec3 = new FloatArrayType(3);

        return aabb => {

            min[0] = aabb[0];
            min[1] = aabb[1];
            min[2] = aabb[2];

            max[0] = aabb[3];
            max[1] = aabb[4];
            max[2] = aabb[5];

            math.subVec3(max, min, tempVec3);

            return Math.abs(math.lenVec3(tempVec3));
        };
    }))(),

    /**
     * Get a diagonal boundary size that is symmetrical about the given point.
     *
     * @private
     */
    getAABB3DiagPoint: ((() => {

        const min = new FloatArrayType(3);
        const max = new FloatArrayType(3);
        const tempVec3 = new FloatArrayType(3);

        return (aabb, p) => {

            min[0] = aabb[0];
            min[1] = aabb[1];
            min[2] = aabb[2];

            max[0] = aabb[3];
            max[1] = aabb[4];
            max[2] = aabb[5];

            const diagVec = math.subVec3(max, min, tempVec3);

            const xneg = p[0] - aabb[0];
            const xpos = aabb[3] - p[0];
            const yneg = p[1] - aabb[1];
            const ypos = aabb[4] - p[1];
            const zneg = p[2] - aabb[2];
            const zpos = aabb[5] - p[2];

            diagVec[0] += (xneg > xpos) ? xneg : xpos;
            diagVec[1] += (yneg > ypos) ? yneg : ypos;
            diagVec[2] += (zneg > zpos) ? zneg : zpos;

            return Math.abs(math.lenVec3(diagVec));
        };
    }))(),

    /**
     * Gets the center of an AABB.
     *
     * @private
     */
    getAABB3Center(aabb, dest) {
        const r = dest || math.vec3();

        r[0] = (aabb[0] + aabb[3]) / 2;
        r[1] = (aabb[1] + aabb[4]) / 2;
        r[2] = (aabb[2] + aabb[5]) / 2;

        return r;
    },

    /**
     * Gets the center of a 2D AABB.
     *
     * @private
     */
    getAABB2Center(aabb, dest) {
        const r = dest || math.vec2();

        r[0] = (aabb[2] + aabb[0]) / 2;
        r[1] = (aabb[3] + aabb[1]) / 2;

        return r;
    },

    /**
     * Collapses a 3D axis-aligned boundary, ready to expand to fit 3D points.
     * Creates new AABB if none supplied.
     *
     * @private
     */
    collapseAABB3(aabb = math.AABB3()) {
        aabb[0] = math.MAX_DOUBLE;
        aabb[1] = math.MAX_DOUBLE;
        aabb[2] = math.MAX_DOUBLE;
        aabb[3] = -math.MAX_DOUBLE;
        aabb[4] = -math.MAX_DOUBLE;
        aabb[5] = -math.MAX_DOUBLE;

        return aabb;
    },

    /**
     * Converts an axis-aligned 3D boundary into an oriented boundary consisting of
     * an array of eight 3D positions, one for each corner of the boundary.
     *
     * @private
     */
    AABB3ToOBB3(aabb, obb = math.OBB3()) {
        obb[0] = aabb[0];
        obb[1] = aabb[1];
        obb[2] = aabb[2];
        obb[3] = 1;

        obb[4] = aabb[3];
        obb[5] = aabb[1];
        obb[6] = aabb[2];
        obb[7] = 1;

        obb[8] = aabb[3];
        obb[9] = aabb[4];
        obb[10] = aabb[2];
        obb[11] = 1;

        obb[12] = aabb[0];
        obb[13] = aabb[4];
        obb[14] = aabb[2];
        obb[15] = 1;

        obb[16] = aabb[0];
        obb[17] = aabb[1];
        obb[18] = aabb[5];
        obb[19] = 1;

        obb[20] = aabb[3];
        obb[21] = aabb[1];
        obb[22] = aabb[5];
        obb[23] = 1;

        obb[24] = aabb[3];
        obb[25] = aabb[4];
        obb[26] = aabb[5];
        obb[27] = 1;

        obb[28] = aabb[0];
        obb[29] = aabb[4];
        obb[30] = aabb[5];
        obb[31] = 1;

        return obb;
    },

    /**
     * Finds the minimum axis-aligned 3D boundary enclosing the homogeneous 3D points (x,y,z,w) given in a flattened array.
     *
     * @private
     */
    positions3ToAABB3: ((() => {

        const p = new FloatArrayType(3);

        return (positions, aabb, positionsDecodeMatrix) => {
            aabb = aabb || math.AABB3();

            let xmin = math.MAX_DOUBLE;
            let ymin = math.MAX_DOUBLE;
            let zmin = math.MAX_DOUBLE;
            let xmax = -math.MAX_DOUBLE;
            let ymax = -math.MAX_DOUBLE;
            let zmax = -math.MAX_DOUBLE;

            let x;
            let y;
            let z;

            for (let i = 0, len = positions.length; i < len; i += 3) {

                if (positionsDecodeMatrix) {

                    p[0] = positions[i + 0];
                    p[1] = positions[i + 1];
                    p[2] = positions[i + 2];

                    math.decompressPosition(p, positionsDecodeMatrix, p);

                    x = p[0];
                    y = p[1];
                    z = p[2];

                } else {
                    x = positions[i + 0];
                    y = positions[i + 1];
                    z = positions[i + 2];
                }

                if (x < xmin) {
                    xmin = x;
                }

                if (y < ymin) {
                    ymin = y;
                }

                if (z < zmin) {
                    zmin = z;
                }

                if (x > xmax) {
                    xmax = x;
                }

                if (y > ymax) {
                    ymax = y;
                }

                if (z > zmax) {
                    zmax = z;
                }
            }

            aabb[0] = xmin;
            aabb[1] = ymin;
            aabb[2] = zmin;
            aabb[3] = xmax;
            aabb[4] = ymax;
            aabb[5] = zmax;

            return aabb;
        };
    }))(),

    /**
     * Finds the minimum axis-aligned 3D boundary enclosing the homogeneous 3D points (x,y,z,w) given in a flattened array.
     *
     * @private
     */
    OBB3ToAABB3(obb, aabb = math.AABB3()) {
        let xmin = math.MAX_DOUBLE;
        let ymin = math.MAX_DOUBLE;
        let zmin = math.MAX_DOUBLE;
        let xmax = -math.MAX_DOUBLE;
        let ymax = -math.MAX_DOUBLE;
        let zmax = -math.MAX_DOUBLE;

        let x;
        let y;
        let z;

        for (let i = 0, len = obb.length; i < len; i += 4) {

            x = obb[i + 0];
            y = obb[i + 1];
            z = obb[i + 2];

            if (x < xmin) {
                xmin = x;
            }

            if (y < ymin) {
                ymin = y;
            }

            if (z < zmin) {
                zmin = z;
            }

            if (x > xmax) {
                xmax = x;
            }

            if (y > ymax) {
                ymax = y;
            }

            if (z > zmax) {
                zmax = z;
            }
        }

        aabb[0] = xmin;
        aabb[1] = ymin;
        aabb[2] = zmin;
        aabb[3] = xmax;
        aabb[4] = ymax;
        aabb[5] = zmax;

        return aabb;
    },

    /**
     * Finds the minimum axis-aligned 3D boundary enclosing the given 3D points.
     *
     * @private
     */
    points3ToAABB3(points, aabb = math.AABB3()) {
        let xmin = math.MAX_DOUBLE;
        let ymin = math.MAX_DOUBLE;
        let zmin = math.MAX_DOUBLE;
        let xmax = -math.MAX_DOUBLE;
        let ymax = -math.MAX_DOUBLE;
        let zmax = -math.MAX_DOUBLE;

        let x;
        let y;
        let z;

        for (let i = 0, len = points.length; i < len; i++) {

            x = points[i][0];
            y = points[i][1];
            z = points[i][2];

            if (x < xmin) {
                xmin = x;
            }

            if (y < ymin) {
                ymin = y;
            }

            if (z < zmin) {
                zmin = z;
            }

            if (x > xmax) {
                xmax = x;
            }

            if (y > ymax) {
                ymax = y;
            }

            if (z > zmax) {
                zmax = z;
            }
        }

        aabb[0] = xmin;
        aabb[1] = ymin;
        aabb[2] = zmin;
        aabb[3] = xmax;
        aabb[4] = ymax;
        aabb[5] = zmax;

        return aabb;
    },

    /**
     * Finds the minimum boundary sphere enclosing the given 3D points.
     *
     * @private
     */
    points3ToSphere3: ((() => {

        const tempVec3 = new FloatArrayType(3);

        return (points, sphere) => {

            sphere = sphere || math.vec4();

            let x = 0;
            let y = 0;
            let z = 0;

            let i;
            const numPoints = points.length;

            for (i = 0; i < numPoints; i++) {
                x += points[i][0];
                y += points[i][1];
                z += points[i][2];
            }

            sphere[0] = x / numPoints;
            sphere[1] = y / numPoints;
            sphere[2] = z / numPoints;

            let radius = 0;
            let dist;

            for (i = 0; i < numPoints; i++) {

                dist = Math.abs(math.lenVec3(math.subVec3(points[i], sphere, tempVec3)));

                if (dist > radius) {
                    radius = dist;
                }
            }

            sphere[3] = radius;

            return sphere;
        };
    }))(),

    /**
     * Finds the minimum boundary sphere enclosing the given 3D positions.
     *
     * @private
     */
    positions3ToSphere3: ((() => {

        const tempVec3a = new FloatArrayType(3);
        const tempVec3b = new FloatArrayType(3);

        return (positions, sphere) => {

            sphere = sphere || math.vec4();

            let x = 0;
            let y = 0;
            let z = 0;

            let i;
            const lenPositions = positions.length;
            let radius = 0;

            for (i = 0; i < lenPositions; i += 3) {
                x += positions[i];
                y += positions[i + 1];
                z += positions[i + 2];
            }

            const numPositions = lenPositions / 3;

            sphere[0] = x / numPositions;
            sphere[1] = y / numPositions;
            sphere[2] = z / numPositions;

            let dist;

            for (i = 0; i < lenPositions; i += 3) {

                tempVec3a[0] = positions[i];
                tempVec3a[1] = positions[i + 1];
                tempVec3a[2] = positions[i + 2];

                dist = Math.abs(math.lenVec3(math.subVec3(tempVec3a, sphere, tempVec3b)));

                if (dist > radius) {
                    radius = dist;
                }
            }

            sphere[3] = radius;

            return sphere;
        };
    }))(),

    /**
     * Finds the minimum boundary sphere enclosing the given 3D points.
     *
     * @private
     */
    OBB3ToSphere3: ((() => {

        const point = new FloatArrayType(3);
        const tempVec3 = new FloatArrayType(3);

        return (points, sphere) => {

            sphere = sphere || math.vec4();

            let x = 0;
            let y = 0;
            let z = 0;

            let i;
            const lenPoints = points.length;
            const numPoints = lenPoints / 4;

            for (i = 0; i < lenPoints; i += 4) {
                x += points[i + 0];
                y += points[i + 1];
                z += points[i + 2];
            }

            sphere[0] = x / numPoints;
            sphere[1] = y / numPoints;
            sphere[2] = z / numPoints;

            let radius = 0;
            let dist;

            for (i = 0; i < lenPoints; i += 4) {

                point[0] = points[i + 0];
                point[1] = points[i + 1];
                point[2] = points[i + 2];

                dist = Math.abs(math.lenVec3(math.subVec3(point, sphere, tempVec3)));

                if (dist > radius) {
                    radius = dist;
                }
            }

            sphere[3] = radius;

            return sphere;
        };
    }))(),

    /**
     * Gets the center of a bounding sphere.
     *
     * @private
     */
    getSphere3Center(sphere, dest = math.vec3()) {
        dest[0] = sphere[0];
        dest[1] = sphere[1];
        dest[2] = sphere[2];

        return dest;
    },

    /**
     * Expands the first axis-aligned 3D boundary to enclose the second, if required.
     *
     * @private
     */
    expandAABB3(aabb1, aabb2) {

        if (aabb1[0] > aabb2[0]) {
            aabb1[0] = aabb2[0];
        }

        if (aabb1[1] > aabb2[1]) {
            aabb1[1] = aabb2[1];
        }

        if (aabb1[2] > aabb2[2]) {
            aabb1[2] = aabb2[2];
        }

        if (aabb1[3] < aabb2[3]) {
            aabb1[3] = aabb2[3];
        }

        if (aabb1[4] < aabb2[4]) {
            aabb1[4] = aabb2[4];
        }

        if (aabb1[5] < aabb2[5]) {
            aabb1[5] = aabb2[5];
        }

        return aabb1;
    },

    /**
     * Expands an axis-aligned 3D boundary to enclose the given point, if needed.
     *
     * @private
     */
    expandAABB3Point3(aabb, p) {

        if (aabb[0] > p[0]) {
            aabb[0] = p[0];
        }

        if (aabb[1] > p[1]) {
            aabb[1] = p[1];
        }

        if (aabb[2] > p[2]) {
            aabb[2] = p[2];
        }

        if (aabb[3] < p[0]) {
            aabb[3] = p[0];
        }

        if (aabb[4] < p[1]) {
            aabb[4] = p[1];
        }

        if (aabb[5] < p[2]) {
            aabb[5] = p[2];
        }

        return aabb;
    },

    /**
     * Calculates the normal vector of a triangle.
     *
     * @private
     */
    triangleNormal(a, b, c, normal = math.vec3()) {
        const p1x = b[0] - a[0];
        const p1y = b[1] - a[1];
        const p1z = b[2] - a[2];

        const p2x = c[0] - a[0];
        const p2y = c[1] - a[1];
        const p2z = c[2] - a[2];

        const p3x = p1y * p2z - p1z * p2y;
        const p3y = p1z * p2x - p1x * p2z;
        const p3z = p1x * p2y - p1y * p2x;

        const mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
        if (mag === 0) {
            normal[0] = 0;
            normal[1] = 0;
            normal[2] = 0;
        } else {
            normal[0] = p3x / mag;
            normal[1] = p3y / mag;
            normal[2] = p3z / mag;
        }

        return normal
    }
};

function quantizePositions (positions, lenPositions, aabb, quantizedPositions) {
    const xmin = aabb[0];
    const ymin = aabb[1];
    const zmin = aabb[2];
    const xwid = aabb[3] - xmin;
    const ywid = aabb[4] - ymin;
    const zwid = aabb[5] - zmin;
    const maxInt = 65535;
    const xMultiplier = maxInt / xwid;
    const yMultiplier = maxInt / ywid;
    const zMultiplier = maxInt / zwid;
    const verify = (num) => num >= 0 ? num : 0;
    for (let i = 0; i < lenPositions; i += 3) {
        quantizedPositions[i + 0] = Math.max(0, Math.min(65535,Math.floor(verify(positions[i + 0] - xmin) * xMultiplier)));
        quantizedPositions[i + 1] = Math.max(0, Math.min(65535,Math.floor(verify(positions[i + 1] - ymin) * yMultiplier)));
        quantizedPositions[i + 2] = Math.max(0, Math.min(65535,Math.floor(verify(positions[i + 2] - zmin) * zMultiplier)));
    }
}

function compressPosition(p, aabb, q) {
    const multiplier = new Float32Array([
        aabb[3] !== aabb[0] ? 65535 / (aabb[3] - aabb[0]) : 0,
        aabb[4] !== aabb[1] ? 65535 / (aabb[4] - aabb[1]) : 0,
        aabb[5] !== aabb[2] ? 65535 / (aabb[5] - aabb[2]) : 0
    ]);
    q[0] = Math.max(0, Math.min(65535, Math.floor((p[0] - aabb[0]) * multiplier[0])));
    q[1] = Math.max(0, Math.min(65535, Math.floor((p[1] - aabb[1]) * multiplier[1])));
    q[2] = Math.max(0, Math.min(65535, Math.floor((p[2] - aabb[2]) * multiplier[2])));
}

var createPositionsDecodeMatrix = (function () {
    const translate = math.mat4();
    const scale = math.mat4();
    return function (aabb, positionsDecodeMatrix) {
        positionsDecodeMatrix = positionsDecodeMatrix || math.mat4();
        const xmin = aabb[0];
        const ymin = aabb[1];
        const zmin = aabb[2];
        const xwid = aabb[3] - xmin;
        const ywid = aabb[4] - ymin;
        const zwid = aabb[5] - zmin;
        const maxInt = 65535;
        math.identityMat4(translate);
        math.translationMat4v(aabb, translate);
        math.identityMat4(scale);
        math.scalingMat4v([xwid / maxInt, ywid / maxInt, zwid / maxInt], scale);
        math.mulMat4(translate, scale, positionsDecodeMatrix);
        return positionsDecodeMatrix;
    };
})();

function transformAndOctEncodeNormals(modelNormalMatrix, normals, lenNormals, compressedNormals, lenCompressedNormals) {
    // http://jcgt.org/published/0003/02/01/
    let oct, dec, best, currentCos, bestCos;
    let i;
    let localNormal = math.vec3();
    let worldNormal =  math.vec3();
    for (i = 0; i < lenNormals; i += 3) {
        localNormal[0] = normals[i];
        localNormal[1] = normals[i + 1];
        localNormal[2] = normals[i + 2];

        math.transformVec3(modelNormalMatrix, localNormal, worldNormal);
        math.normalizeVec3(worldNormal, worldNormal);

        // Test various combinations of ceil and floor to minimize rounding errors
        best = oct = octEncodeVec3(worldNormal, 0, "floor", "floor");
        dec = octDecodeVec2(oct);
        currentCos = bestCos = dot$1(worldNormal, 0, dec);
        oct = octEncodeVec3(worldNormal, 0, "ceil", "floor");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(worldNormal, 0, "floor", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(worldNormal, 0, "ceil", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(worldNormal, 0, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        compressedNormals[lenCompressedNormals + i + 0] = best[0];
        compressedNormals[lenCompressedNormals + i + 1] = best[1];
        compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
    }
    lenCompressedNormals += lenNormals;
    return lenCompressedNormals;
}

function octEncodeNormals(normals, lenNormals, compressedNormals, lenCompressedNormals) { // http://jcgt.org/published/0003/02/01/
    let oct, dec, best, currentCos, bestCos;
    for (let i = 0; i < lenNormals; i += 3) {
        // Test various combinations of ceil and floor to minimize rounding errors
        best = oct = octEncodeVec3(normals, i, "floor", "floor");
        dec = octDecodeVec2(oct);
        currentCos = bestCos = dot$1(normals, i, dec);
        oct = octEncodeVec3(normals, i, "ceil", "floor");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(normals, i, "floor", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        oct = octEncodeVec3(normals, i, "ceil", "ceil");
        dec = octDecodeVec2(oct);
        currentCos = dot$1(normals, i, dec);
        if (currentCos > bestCos) {
            best = oct;
            bestCos = currentCos;
        }
        compressedNormals[lenCompressedNormals + i + 0] = best[0];
        compressedNormals[lenCompressedNormals + i + 1] = best[1];
        compressedNormals[lenCompressedNormals + i + 2] = 0.0; // Unused
    }
    lenCompressedNormals += lenNormals;
    return lenCompressedNormals;
}

/**
 * @private
 */
function octEncodeVec3(array, i, xfunc, yfunc) { // Oct-encode single normal vector in 2 bytes
    let x = array[i] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
    let y = array[i + 1] / (Math.abs(array[i]) + Math.abs(array[i + 1]) + Math.abs(array[i + 2]));
    if (array[i + 2] < 0) {
        let tempx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
        let tempy = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
        x = tempx;
        y = tempy;
    }
    return new Int8Array([
        Math[xfunc](x * 127.5 + (x < 0 ? -1 : 0)),
        Math[yfunc](y * 127.5 + (y < 0 ? -1 : 0))
    ]);
}

/**
 * Decode an oct-encoded normal
 */
function octDecodeVec2(oct) {
    let x = oct[0];
    let y = oct[1];
    x /= x < 0 ? 127 : 128;
    y /= y < 0 ? 127 : 128;
    const z = 1 - Math.abs(x) - Math.abs(y);
    if (z < 0) {
        x = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1);
        y = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1);
    }
    const length = Math.sqrt(x * x + y * y + z * z);
    return [
        x / length,
        y / length,
        z / length
    ];
}

/**
 * Dot product of a normal in an array against a candidate decoding
 * @private
 */
function dot$1(array, i, vec3) {
    return array[i] * vec3[0] + array[i + 1] * vec3[1] + array[i + 2] * vec3[2];
}

/**
 * @private
 */
const geometryCompression = {
    quantizePositions,
    compressPosition,
    createPositionsDecodeMatrix,
    transformAndOctEncodeNormals,
    octEncodeNormals,
};

/**
 * @private
 */
const buildEdgeIndices = (function () {

    const uniquePositions = [];
    const indicesLookup = [];
    const indicesReverseLookup = [];
    const weldedIndices = [];

// TODO: Optimize with caching, but need to cater to both compressed and uncompressed positions

    const faces = [];
    let numFaces = 0;
    const compa = new Uint16Array(3);
    const compb = new Uint16Array(3);
    const compc = new Uint16Array(3);
    const a = math.vec3();
    const b = math.vec3();
    const c = math.vec3();
    const cb = math.vec3();
    const ab = math.vec3();
    const cross = math.vec3();
    const normal = math.vec3();
    const inverseNormal = math.vec3();

    function weldVertices(positions, indices) {
        const positionsMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
        let vx;
        let vy;
        let vz;
        let key;
        const precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
        const precision = Math.pow(10, precisionPoints);
        let i;
        let len;
        let lenUniquePositions = 0;
        for (i = 0, len = positions.length; i < len; i += 3) {
            vx = positions[i];
            vy = positions[i + 1];
            vz = positions[i + 2];
            key = Math.round(vx * precision) + '_' + Math.round(vy * precision) + '_' + Math.round(vz * precision);
            if (positionsMap[key] === undefined) {
                positionsMap[key] = lenUniquePositions / 3;
                uniquePositions[lenUniquePositions++] = vx;
                uniquePositions[lenUniquePositions++] = vy;
                uniquePositions[lenUniquePositions++] = vz;
            }
            indicesLookup[i / 3] = positionsMap[key];
        }
        for (i = 0, len = indices.length; i < len; i++) {
            weldedIndices[i] = indicesLookup[indices[i]];
            indicesReverseLookup[weldedIndices[i]] = indices[i];
        }
    }

    function buildFaces(numIndices, positionsDecodeMatrix) {
        numFaces = 0;
        for (let i = 0, len = numIndices; i < len; i += 3) {
            const ia = ((weldedIndices[i]) * 3);
            const ib = ((weldedIndices[i + 1]) * 3);
            const ic = ((weldedIndices[i + 2]) * 3);
            if (positionsDecodeMatrix) {
                compa[0] = uniquePositions[ia];
                compa[1] = uniquePositions[ia + 1];
                compa[2] = uniquePositions[ia + 2];
                compb[0] = uniquePositions[ib];
                compb[1] = uniquePositions[ib + 1];
                compb[2] = uniquePositions[ib + 2];
                compc[0] = uniquePositions[ic];
                compc[1] = uniquePositions[ic + 1];
                compc[2] = uniquePositions[ic + 2];
                // Decode
                math.decompressPosition(compa, positionsDecodeMatrix, a);
                math.decompressPosition(compb, positionsDecodeMatrix, b);
                math.decompressPosition(compc, positionsDecodeMatrix, c);
            } else {
                a[0] = uniquePositions[ia];
                a[1] = uniquePositions[ia + 1];
                a[2] = uniquePositions[ia + 2];
                b[0] = uniquePositions[ib];
                b[1] = uniquePositions[ib + 1];
                b[2] = uniquePositions[ib + 2];
                c[0] = uniquePositions[ic];
                c[1] = uniquePositions[ic + 1];
                c[2] = uniquePositions[ic + 2];
            }
            math.subVec3(c, b, cb);
            math.subVec3(a, b, ab);
            math.cross3Vec3(cb, ab, cross);
            math.normalizeVec3(cross, normal);
            const face = faces[numFaces] || (faces[numFaces] = {normal: math.vec3()});
            face.normal[0] = normal[0];
            face.normal[1] = normal[1];
            face.normal[2] = normal[2];
            numFaces++;
        }
    }

    return function (positions, indices, positionsDecodeMatrix, edgeThreshold) {
        weldVertices(positions, indices);
        buildFaces(indices.length, positionsDecodeMatrix);
        const edgeIndices = [];
        const thresholdDot = Math.cos(math.DEGTORAD * edgeThreshold);
        const edges = {};
        let edge1;
        let edge2;
        let index1;
        let index2;
        let key;
        let largeIndex = false;
        let edge;
        let normal1;
        let normal2;
        let dot;
        let ia;
        let ib;
        for (let i = 0, len = indices.length; i < len; i += 3) {
            const faceIndex = i / 3;
            for (let j = 0; j < 3; j++) {
                edge1 = weldedIndices[i + j];
                edge2 = weldedIndices[i + ((j + 1) % 3)];
                index1 = Math.min(edge1, edge2);
                index2 = Math.max(edge1, edge2);
                key = index1 + ',' + index2;
                if (edges[key] === undefined) {
                    edges[key] = {
                        index1: index1,
                        index2: index2,
                        face1: faceIndex,
                        face2: undefined,
                    };
                } else {
                    edges[key].face2 = faceIndex;
                }
            }
        }
        for (key in edges) {
            edge = edges[key];
            // an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
            if (edge.face2 !== undefined) {
                normal1 = faces[edge.face1].normal;
                normal2 = faces[edge.face2].normal;
                inverseNormal[0] = -normal2[0];
                inverseNormal[1] = -normal2[1];
                inverseNormal[2] = -normal2[2];
                dot = Math.abs(math.dotVec3(normal1, normal2));
                const dot2 = Math.abs(math.dotVec3(normal1, inverseNormal));
                if (dot > thresholdDot && dot2 > thresholdDot) {
                    continue;
                }
            }
            ia = indicesReverseLookup[edge.index1];
            ib = indicesReverseLookup[edge.index2];
            if (!largeIndex && ia > 65535 || ib > 65535) {
                largeIndex = true;
            }
            edgeIndices.push(ia);
            edgeIndices.push(ib);
        }
        return (largeIndex) ? new Uint32Array(edgeIndices) : new Uint16Array(edgeIndices);
    };
})();

/**
 * Uses edge adjacency counts to identify if the given triangle mesh can be rendered with backface culling enabled.
 *
 * If all edges are connected to exactly two triangles, then the mesh will likely be a closed solid, and we can safely
 * render it with backface culling enabled.
 *
 * Otherwise, the mesh is a surface, and we must render it with backface culling disabled.
 *
 * @private
 */
const isTriangleMeshSolid = (indices, positions, vertexIndexMapping, edges) => {

    function compareIndexPositions(a, b)
    {
        let posA, posB;

        for (let i = 0; i < 3; i++) {
            posA = positions [a*3+i];
            posB = positions [b*3+i];

            if (posA !== posB) {
                return posB - posA;
            }
        }

        return 0;
    }
    // Group together indices corresponding to same position coordinates
    let newIndices = indices.slice ().sort (compareIndexPositions);

    // Calculate the mapping:
    // - from original index in indices array
    // - to indices-for-unique-positions
    let uniqueVertexIndex = null;

    for (let i = 0, len = newIndices.length; i < len; i++) {
        if (i == 0 || 0 != compareIndexPositions (
            newIndices[i],
            newIndices[i-1],
        )) {
            // different position
            uniqueVertexIndex = newIndices [i];
        }

        vertexIndexMapping [
            newIndices[i]
            ] = uniqueVertexIndex;
    }

    // Generate the list of edges
    for (let i = 0, len = indices.length; i < len; i += 3) {

        const a = vertexIndexMapping[indices[i]];
        const b = vertexIndexMapping[indices[i+1]];
        const c = vertexIndexMapping[indices[i+2]];

        let a2 = a;
        let b2 = b;
        let c2 = c;

        if (a > b && a > c) {
            if (b > c) {
                a2 = a;
                b2 = b;
                c2 = c;
            } else {
                a2 = a;
                b2 = c;
                c2 = b;
            }
        } else if (b > a && b > c) {
            if (a > c) {
                a2 = b;
                b2 = a;
                c2 = c;
            } else {
                a2 = b;
                b2 = c;
                c2 = a;
            }
        } else if (c > a && c > b) {
            if (a > b) {
                a2 = c;
                b2 = a;
                c2 = b;
            } else {
                a2 = c;
                b2 = b;
                c2 = a;
            }
        }

        edges[i+0] = [
            a2, b2
        ];
        edges[i+1] = [
            b2, c2
        ];

        if (a2 > c2) {
            const temp = c2;
            c2 = a2;
            a2 = temp;
        }

        edges[i+2] = [
            c2, a2
        ];
    }

    // Group semantically equivalent edgdes together
    function compareEdges (e1, e2) {
        let a, b;

        for (let i = 0; i < 2; i++) {
            a = e1[i];
            b = e2[i];

            if (b !== a) {
                return b - a;
            }
        }

        return 0;
    }

    edges = edges.slice(0, indices.length);

    edges.sort (compareEdges);

    // Make sure each edge is used exactly twice
    let sameEdgeCount = 0;

    for (let i = 0; i < edges.length; i++)
    {
        if (i === 0 || 0 !== compareEdges (
            edges[i], edges[i-1]
        )) {
            // different edge
            if (0 !== i && sameEdgeCount !== 2)
            {
                return false;
            }

            sameEdgeCount = 1;
        }
        else
        {
            // same edge
            sameEdgeCount++;
        }
    }

    if (edges.length > 0 && sameEdgeCount !== 2)
    {
        return false;
    }

    // Each edge is used exactly twice, this is a
    // watertight surface and hence a solid geometry.
    return true;
};

/**
 * Represents the usage of a {@link XKTGeometry} by an {@link XKTEntity}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTEntity#meshes} and {@link XKTModel#meshesList}
 * * Has an {@link XKTGeometry}, and an optional {@link XKTTextureSet}, both of which it can share with other {@link XKTMesh}es
 * * Has {@link XKTMesh#color}, {@link XKTMesh#opacity}, {@link XKTMesh#metallic} and {@link XKTMesh#roughness} PBR attributes
 * @class XKTMesh
 */
class XKTMesh {

    /**
     * @private
     */
    constructor(cfg) {

        /**
         * Unique ID of this XKTMesh in {@link XKTModel#meshes}.
         *
         * @type {Number}
         */
        this.meshId = cfg.meshId;

        /**
         * Index of this XKTMesh in {@link XKTModel#meshesList};
         *
         * @type {Number}
         */
        this.meshIndex = cfg.meshIndex;

        /**
         * The 4x4 modeling transform matrix.
         *
         * Transform is relative to the center of the {@link XKTTile} that contains this XKTMesh's {@link XKTEntity},
         * which is given in {@link XKTMesh#entity}.
         *
         * When the ````XKTEntity```` shares its {@link XKTGeometry}s with other ````XKTEntity````s, this matrix is used
         * to transform this XKTMesh's XKTGeometry into World-space. When this XKTMesh does not share its ````XKTGeometry````,
         * then this matrix is ignored.
         *
         * @type {Number[]}
         */
        this.matrix = cfg.matrix;

        /**
         * The instanced {@link XKTGeometry}.
         *
         * @type {XKTGeometry}
         */
        this.geometry = cfg.geometry;

        /**
         * RGB color of this XKTMesh.
         *
         * @type {Float32Array}
         */
        this.color = cfg.color || new Float32Array([1, 1, 1]);

        /**
         * PBR metallness of this XKTMesh.
         *
         * @type {Number}
         */
        this.metallic = (cfg.metallic !== null && cfg.metallic !== undefined) ? cfg.metallic : 0;

        /**
         * PBR roughness of this XKTMesh.
         * The {@link XKTTextureSet} that defines the appearance of this XKTMesh.
         *
         * @type {Number}
         * @type {XKTTextureSet}
         */
        this.roughness = (cfg.roughness !== null && cfg.roughness !== undefined) ? cfg.roughness : 1;

        /**
         * Opacity of this XKTMesh.
         *
         * @type {Number}
         */
        this.opacity = (cfg.opacity !== undefined && cfg.opacity !== null) ? cfg.opacity : 1.0;

        /**
         * The {@link XKTTextureSet} that defines the appearance of this XKTMesh.
         *
         * @type {XKTTextureSet}
         */
        this.textureSet = cfg.textureSet;

        /**
         * The owner {@link XKTEntity}.
         *
         * Set by {@link XKTModel#createEntity}.
         *
         * @type {XKTEntity}
         */
        this.entity = null; // Set after instantiation, when the Entity is known
    }
}

/**
 * An element of reusable geometry within an {@link XKTModel}.
 *
 * * Created by {@link XKTModel#createGeometry}
 * * Stored in {@link XKTModel#geometries} and {@link XKTModel#geometriesList}
 * * Referenced by {@link XKTMesh}s, which belong to {@link XKTEntity}s
 *
 * @class XKTGeometry
 */
class XKTGeometry {

    /**
     * @private
     * @param {*} cfg Configuration for the XKTGeometry.
     * @param {Number} cfg.geometryId Unique ID of the geometry in {@link XKTModel#geometries}.
     * @param {String} cfg.primitiveType Type of this geometry - "triangles", "points" or "lines" so far.
     * @param {Number} cfg.geometryIndex Index of this XKTGeometry in {@link XKTModel#geometriesList}.
     * @param {Float64Array} cfg.positions Non-quantized 3D vertex positions.
     * @param {Float32Array} cfg.normals Non-compressed vertex normals.
     * @param {Uint8Array} cfg.colorsCompressed Unsigned 8-bit integer RGBA vertex colors.
     * @param {Float32Array} cfg.uvs Non-compressed vertex UV coordinates.
     * @param {Uint32Array} cfg.indices Indices to organize the vertex positions and normals into triangles.
     * @param {Uint32Array} cfg.edgeIndices Indices to organize the vertex positions into edges.
     */
    constructor(cfg) {

        /**
         * Unique ID of this XKTGeometry in {@link XKTModel#geometries}.
         *
         * @type {Number}
         */
        this.geometryId = cfg.geometryId;

        /**
         * The type of primitive - "triangles" | "points" | "lines".
         *
         * @type {String}
         */
        this.primitiveType = cfg.primitiveType;

        /**
         * Index of this XKTGeometry in {@link XKTModel#geometriesList}.
         *
         * @type {Number}
         */
        this.geometryIndex = cfg.geometryIndex;

        /**
         * The number of {@link XKTMesh}s that reference this XKTGeometry.
         *
         * @type {Number}
         */
        this.numInstances = 0;

        /**
         * Non-quantized 3D vertex positions.
         *
         * Defined for all primitive types.
         *
         * @type {Float64Array}
         */
        this.positions = cfg.positions;

        /**
         * Quantized vertex positions.
         *
         * Defined for all primitive types.
         *
         * This array is later created from {@link XKTGeometry#positions} by {@link XKTModel#finalize}.
         *
         * @type {Uint16Array}
         */
        this.positionsQuantized = new Uint16Array(cfg.positions.length);

        /**
         * Non-compressed 3D vertex normals.
         *
         * Defined only for triangle primitives. Can be null if we want xeokit to auto-generate them. Ignored for points and lines.
         *
         * @type {Float32Array}
         */
        this.normals = cfg.normals;

        /**
         * Compressed vertex normals.
         *
         * Defined only for triangle primitives. Ignored for points and lines.
         *
         * This array is later created from {@link XKTGeometry#normals} by {@link XKTModel#finalize}.
         *
         * Will be null if {@link XKTGeometry#normals} is also null.
         *
         * @type {Int8Array}
         */
        this.normalsOctEncoded = null;

        /**
         * Compressed RGBA vertex colors.
         *
         * Defined only for point primitives. Ignored for triangles and lines.
         *
         * @type {Uint8Array}
         */
        this.colorsCompressed = cfg.colorsCompressed;

        /**
         * Non-compressed vertex UVs.
         *
         * @type {Float32Array}
         */
        this.uvs = cfg.uvs;

        /**
         * Compressed vertex UVs.
         *
         * @type {Uint16Array}
         */
        this.uvsCompressed = cfg.uvsCompressed;

        /**
         * Indices that organize the vertex positions and normals as triangles.
         *
         * Defined only for triangle and lines primitives. Ignored for points.
         *
         * @type {Uint32Array}
         */
        this.indices = cfg.indices;

        /**
         * Indices that organize the vertex positions as edges.
         *
         * Defined only for triangle primitives. Ignored for points and lines.
         *
         * @type {Uint32Array}
         */
        this.edgeIndices = cfg.edgeIndices;

        /**
         * When {@link XKTGeometry#primitiveType} is "triangles", this is ````true```` when this geometry is a watertight mesh.
         *
         * Defined only for triangle primitives. Ignored for points and lines.
         *
         * Set by {@link XKTModel#finalize}.
         *
         * @type {boolean}
         */
        this.solid = false;
    }

    /**
     * Convenience property that is ````true```` when {@link XKTGeometry#numInstances} is greater that one.
     * @returns {boolean}
     */
    get reused() {
        return (this.numInstances > 1);
    }
}

/**
 * An object within an {@link XKTModel}.
 *
 * * Created by {@link XKTModel#createEntity}
 * * Stored in {@link XKTModel#entities} and {@link XKTModel#entitiesList}
 * * Has one or more {@link XKTMesh}s, each having an {@link XKTGeometry}
 *
 * @class XKTEntity
 */
class XKTEntity {

    /**
     * @private
     * @param entityId
     * @param meshes
     */
    constructor(entityId,  meshes) {

        /**
         * Unique ID of this ````XKTEntity```` in {@link XKTModel#entities}.
         *
         * For a BIM model, this will be an IFC product ID.
         *
         * We can also use {@link XKTModel#createMetaObject} to create an {@link XKTMetaObject} to specify metadata for
         * this ````XKTEntity````. To associate the {@link XKTMetaObject} with our {@link XKTEntity}, we give
         * {@link XKTMetaObject#metaObjectId} the same value as {@link XKTEntity#entityId}.
         *
         * @type {String}
         */
        this.entityId = entityId;

        /**
         * Index of this ````XKTEntity```` in {@link XKTModel#entitiesList}.
         *
         * Set by {@link XKTModel#finalize}.
         *
         * @type {Number}
         */
        this.entityIndex = null;

        /**
         * A list of {@link XKTMesh}s that indicate which {@link XKTGeometry}s are used by this Entity.
         *
         * @type {XKTMesh[]}
         */
        this.meshes = meshes;

        /**
         * World-space axis-aligned bounding box (AABB) that encloses the {@link XKTGeometry#positions} of
         * the {@link XKTGeometry}s that are used by this ````XKTEntity````.
         *
         * Set by {@link XKTModel#finalize}.
         *
         * @type {Float32Array}
         */
        this.aabb = math.AABB3();

        /**
         * Indicates if this ````XKTEntity```` shares {@link XKTGeometry}s with other {@link XKTEntity}'s.
         *
         * Set by {@link XKTModel#finalize}.
         *
         * Note that when an ````XKTEntity```` shares ````XKTGeometrys````, it shares **all** of its ````XKTGeometrys````. An ````XKTEntity````
         * never shares only some of its ````XKTGeometrys```` - it always shares either the whole set or none at all.
         *
         * @type {Boolean}
         */
        this.hasReusedGeometries = false;
    }
}

/**
 * @desc A box-shaped 3D region within an {@link XKTModel} that contains {@link XKTEntity}s.
 *
 * * Created by {@link XKTModel#finalize}
 * * Stored in {@link XKTModel#tilesList}
 *
 * @class XKTTile
 */
class XKTTile {

    /**
     * Creates a new XKTTile.
     *
     * @private
     * @param aabb
     * @param entities
     */
    constructor(aabb, entities) {

        /**
         * Axis-aligned World-space bounding box that encloses the {@link XKTEntity}'s within this Tile.
         *
         * @type {Float64Array}
         */
        this.aabb = aabb;

        /**
         * The {@link XKTEntity}'s within this XKTTile.
         *
         * @type {XKTEntity[]}
         */
        this.entities = entities;
    }
}

/**
 * A kd-Tree node, used internally by {@link XKTModel}.
 *
 * @private
 */
class KDNode {

    /**
     * Create a KDNode with an axis-aligned 3D World-space boundary.
     */
    constructor(aabb) {

        /**
         * The axis-aligned 3D World-space boundary of this KDNode.
         *
         * @type {Float64Array}
         */
        this.aabb = aabb;

        /**
         * The {@link XKTEntity}s within this KDNode.
         */
        this.entities = null;

        /**
         * The left child KDNode.
         */
        this.left = null;

        /**
         * The right child KDNode.
         */
        this.right = null;
    }
}

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

/**
 * Given geometry defined as an array of positions, optional normals, option uv and an array of indices, returns
 * modified arrays that have duplicate vertices removed.
 *
 * @private
 */
function mergeVertices(positions, indices, mergedPositions, mergedIndices) {
    const positionsMap = {};
    const indicesLookup = [];
    const precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    const precision = 10 ** precisionPoints;
    for (let i = 0, len = positions.length; i < len; i += 3) {
        const vx = positions[i];
        const vy = positions[i + 1];
        const vz = positions[i + 2];
        const key = `${Math.round(vx * precision)}_${Math.round(vy * precision)}_${Math.round(vz * precision)}`;
        if (positionsMap[key] === undefined) {
            positionsMap[key] = mergedPositions.length / 3;
            mergedPositions.push(vx);
            mergedPositions.push(vy);
            mergedPositions.push(vz);
        }
        indicesLookup[i / 3] = positionsMap[key];
    }
    for (let i = 0, len = indices.length; i < len; i++) {
        mergedIndices[i] = indicesLookup[indices[i]];
    }
}

/**
 * @desc Provides info on the XKT generated by xeokit-convert.
 */
const XKT_INFO = {

    /**
     * The XKT version generated by xeokit-convert.
     *
     * This is the XKT version that's modeled by {@link XKTModel}, serialized
     * by {@link writeXKTModelToArrayBuffer}, and written by {@link convert2xkt}.
     *
     * * Current XKT version: **10**
     * * [XKT format specs](https://github.com/xeokit/xeokit-convert/blob/main/specs/index.md)
     *
     * @property xktVersion
     * @type {number}
     */
    xktVersion: 10
};

/*----------------------------------------------------------------------------------------------------------------------
 * NOTE: The values of these constants must match those within xeokit-sdk
 *--------------------------------------------------------------------------------------------------------------------*/

/**
 * Texture wrapping mode in which the texture repeats to infinity.
 */
const RepeatWrapping = 1000;

/**
 * Texture wrapping mode in which the last pixel of the texture stretches to the edge of the mesh.
 */
const ClampToEdgeWrapping = 1001;

/**
 * Texture wrapping mode in which the texture repeats to infinity, mirroring on each repeat.
 */
const MirroredRepeatWrapping = 1002;

/**
 * Texture magnification and minification filter that returns the nearest texel to the given sample coordinates.
 */
const NearestFilter = 1003;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and returns the nearest texel to the given sample coordinates.
 */
const NearestMipMapNearestFilter = 1004;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured
 * and returns the nearest texel to the center of the pixel at the given sample coordinates.
 */
const NearestMipMapLinearFilter = 1005;

/**
 * Texture magnification and minification filter that returns the weighted average of the four nearest texels to the given sample coordinates.
 */
const LinearFilter = 1006;

/**
 * Texture minification filter that chooses the mipmap that most closely matches the size of the pixel being textured and
 * returns the weighted average of the four nearest texels to the given sample coordinates.
 */
const LinearMipMapNearestFilter = 1007;

/**
 * Texture minification filter that chooses two mipmaps that most closely match the size of the pixel being textured,
 * finds within each mipmap the weighted average of the nearest texel to the center of the pixel, then returns the
 * weighted average of those two values.
 */
const LinearMipMapLinearFilter = 1008;

/**
 * A texture shared by {@link XKTTextureSet}s.
 *
 * * Created by {@link XKTModel#createTexture}
 * * Stored in {@link XKTTextureSet#textures}, {@link XKTModel#textures} and {@link XKTModel#texturesList}
 *
 * @class XKTTexture
 */

class XKTTexture {

    /**
     * @private
     */
    constructor(cfg) {

        /**
         * Unique ID of this XKTTexture in {@link XKTModel#textures}.
         *
         * @type {Number}
         */
        this.textureId = cfg.textureId;

        /**
         * Index of this XKTTexture in {@link XKTModel#texturesList};
         *
         * @type {Number}
         */
        this.textureIndex = cfg.textureIndex;

        /**
         * Texture image data.
         *
         * @type {Buffer}
         */
        this.imageData = cfg.imageData;

        /**
         * Which material channel this texture is applied to, as determined by its {@link XKTTextureSet}s.
         *
         * @type {Number}
         */
        this.channel = null;

        /**
         * Width of this XKTTexture.
         *
         * @type {Number}
         */
        this.width = cfg.width;

        /**
         * Height of this XKTTexture.
         *
         * @type {Number}
         */
        this.height = cfg.height;

        /**
         * Texture file source.
         *
         * @type {String}
         */
        this.src = cfg.src;

        /**
         * Whether this XKTTexture is to be compressed.
         *
         * @type {Boolean}
         */
        this.compressed = (!!cfg.compressed);

        /**
         * Media type of this XKTTexture.
         *
         * Supported values are {@link GIFMediaType}, {@link PNGMediaType} and {@link JPEGMediaType}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.mediaType = cfg.mediaType;

        /**
         * How the texture is sampled when a texel covers less than one pixel. Supported values
         * are {@link LinearMipmapLinearFilter}, {@link LinearMipMapNearestFilter},
         * {@link NearestMipMapNearestFilter}, {@link NearestMipMapLinearFilter}
         * and {@link LinearMipMapLinearFilter}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.minFilter = cfg.minFilter || LinearMipMapNearestFilter;

        /**
         * How the texture is sampled when a texel covers more than one pixel. Supported values
         * are {@link LinearFilter} and {@link NearestFilter}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.magFilter = cfg.magFilter || LinearMipMapNearestFilter;

        /**
         * S wrapping mode.
         *
         * Supported values are {@link ClampToEdgeWrapping},
         * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.wrapS = cfg.wrapS || RepeatWrapping;

        /**
         * T wrapping mode.
         *
         * Supported values are {@link ClampToEdgeWrapping},
         * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
         *
         * Ignored for compressed textures.
         *
         * @type {Number}
         */
        this.wrapT = cfg.wrapT || RepeatWrapping;

        /**
         * R wrapping mode.
         *
         * Ignored for compressed textures.
         *
         * Supported values are {@link ClampToEdgeWrapping},
         * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}.
         *
         * @type {*|number}
         */
        this.wrapR = cfg.wrapR || RepeatWrapping;
    }
}

/**
 * A set of textures shared by {@link XKTMesh}es.
 *
 * * Created by {@link XKTModel#createTextureSet}
 * * Registered in {@link XKTMesh#material}, {@link XKTModel#materials} and {@link XKTModel#.textureSetsList}
 *
 * @class XKTMetalRoughMaterial
 */
class XKTTextureSet {

    /**
     * @private
     */
    constructor(cfg) {

        /**
         * Unique ID of this XKTTextureSet in {@link XKTModel#materials}.
         *
         * @type {Number}
         */
        this.textureSetId = cfg.textureSetId;

        /**
         * Index of this XKTTexture in {@link XKTModel#texturesList};
         *
         * @type {Number}
         */
        this.textureSetIndex = cfg.textureSetIndex;

        /**
         * Identifies the material type.
         *
         * @type {Number}
         */
        this.materialType = cfg.materialType;

        /**
         * Index of this XKTTextureSet in {@link XKTModel#meshesList};
         *
         * @type {Number}
         */
        this.materialIndex = cfg.materialIndex;

        /**
         * The number of {@link XKTMesh}s that reference this XKTTextureSet.
         *
         * @type {Number}
         */
        this.numInstances = 0;

        /**
         * RGBA {@link XKTTexture} containing base color in RGB and opacity in A.
         *
         * @type {XKTTexture}
         */
        this.colorTexture = cfg.colorTexture;

        /**
         * RGBA {@link XKTTexture} containing metallic and roughness factors in R and G.
         *
         * @type {XKTTexture}
         */
        this.metallicRoughnessTexture = cfg.metallicRoughnessTexture;

        /**
         * RGBA {@link XKTTexture} with surface normals in RGB.
         *
         * @type {XKTTexture}
         */
        this.normalsTexture = cfg.normalsTexture;

        /**
         * RGBA {@link XKTTexture} with emissive color in RGB.
         *
         * @type {XKTTexture}
         */
        this.emissiveTexture = cfg.emissiveTexture;

        /**
         * RGBA {@link XKTTexture} with ambient occlusion factors in RGB.
         *
         * @type {XKTTexture}
         */
        this.occlusionTexture = cfg.occlusionTexture;
    }
}

function assert$5(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

const isBrowser$2 = Boolean(typeof process !== 'object' || String(process) !== '[object process]' || process.browser);
const matches$1 = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches$1 && parseFloat(matches$1[1]) || 0;

const VERSION$8 = "3.4.14" ;

function assert$4(condition, message) {
  if (!condition) {
    throw new Error(message || 'loaders.gl assertion failed.');
  }
}

const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const global_ = globals.global || globals.self || globals.window || {};
const isBrowser$1 = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const isWorker = typeof importScripts === 'function';
const isMobile = typeof window !== 'undefined' && typeof window.orientation !== 'undefined';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
matches && parseFloat(matches[1]) || 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class WorkerJob {
  constructor(jobName, workerThread) {
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "workerThread", void 0);
    _defineProperty(this, "isRunning", true);
    _defineProperty(this, "result", void 0);
    _defineProperty(this, "_resolve", () => {});
    _defineProperty(this, "_reject", () => {});
    this.name = jobName;
    this.workerThread = workerThread;
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  postMessage(type, payload) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type,
      payload
    });
  }
  done(value) {
    assert$4(this.isRunning);
    this.isRunning = false;
    this._resolve(value);
  }
  error(error) {
    assert$4(this.isRunning);
    this.isRunning = false;
    this._reject(error);
  }
}

class Worker$1 {
  terminate() {}
}

const workerURLCache = new Map();
function getLoadableWorkerURL(props) {
  assert$4(props.source && !props.url || !props.source && props.url);
  let workerURL = workerURLCache.get(props.source || props.url);
  if (!workerURL) {
    if (props.url) {
      workerURL = getLoadableWorkerURLFromURL(props.url);
      workerURLCache.set(props.url, workerURL);
    }
    if (props.source) {
      workerURL = getLoadableWorkerURLFromSource(props.source);
      workerURLCache.set(props.source, workerURL);
    }
  }
  assert$4(workerURL);
  return workerURL;
}
function getLoadableWorkerURLFromURL(url) {
  if (!url.startsWith('http')) {
    return url;
  }
  const workerSource = buildScriptSource(url);
  return getLoadableWorkerURLFromSource(workerSource);
}
function getLoadableWorkerURLFromSource(workerSource) {
  const blob = new Blob([workerSource], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(blob);
}
function buildScriptSource(workerUrl) {
  return "try {\n  importScripts('".concat(workerUrl, "');\n} catch (error) {\n  console.error(error);\n  throw error;\n}");
}

function getTransferList(object) {
  let recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let transfers = arguments.length > 2 ? arguments[2] : undefined;
  const transfersSet = transfers || new Set();
  if (!object) ; else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) ; else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }
  return transfers === undefined ? Array.from(transfersSet) : [];
}
function isTransferable(object) {
  if (!object) {
    return false;
  }
  if (object instanceof ArrayBuffer) {
    return true;
  }
  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }
  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }
  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }
  return false;
}
function getTransferListForWriter(object) {
  if (object === null) {
    return {};
  }
  const clone = Object.assign({}, object);
  Object.keys(clone).forEach(key => {
    if (typeof object[key] === 'object' && !ArrayBuffer.isView(object[key]) && !(object[key] instanceof Array)) {
      clone[key] = getTransferListForWriter(object[key]);
    } else if (typeof clone[key] === 'function' || clone[key] instanceof RegExp) {
      clone[key] = {};
    } else {
      clone[key] = object[key];
    }
  });
  return clone;
}

const NOOP = () => {};
class WorkerThread {
  static isSupported() {
    return typeof Worker !== 'undefined' && isBrowser$1 || typeof Worker$1 !== 'undefined' && !isBrowser$1;
  }
  constructor(props) {
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "source", void 0);
    _defineProperty(this, "url", void 0);
    _defineProperty(this, "terminated", false);
    _defineProperty(this, "worker", void 0);
    _defineProperty(this, "onMessage", void 0);
    _defineProperty(this, "onError", void 0);
    _defineProperty(this, "_loadableURL", '');
    const {
      name,
      source,
      url
    } = props;
    assert$4(source || url);
    this.name = name;
    this.source = source;
    this.url = url;
    this.onMessage = NOOP;
    this.onError = error => console.log(error);
    this.worker = isBrowser$1 ? this._createBrowserWorker() : this._createNodeWorker();
  }
  destroy() {
    this.onMessage = NOOP;
    this.onError = NOOP;
    this.worker.terminate();
    this.terminated = true;
  }
  get isRunning() {
    return Boolean(this.onMessage);
  }
  postMessage(data, transferList) {
    transferList = transferList || getTransferList(data);
    this.worker.postMessage(data, transferList);
  }
  _getErrorFromErrorEvent(event) {
    let message = 'Failed to load ';
    message += "worker ".concat(this.name, " from ").concat(this.url, ". ");
    if (event.message) {
      message += "".concat(event.message, " in ");
    }
    if (event.lineno) {
      message += ":".concat(event.lineno, ":").concat(event.colno);
    }
    return new Error(message);
  }
  _createBrowserWorker() {
    this._loadableURL = getLoadableWorkerURL({
      source: this.source,
      url: this.url
    });
    const worker = new Worker(this._loadableURL, {
      name: this.name
    });
    worker.onmessage = event => {
      if (!event.data) {
        this.onError(new Error('No data received'));
      } else {
        this.onMessage(event.data);
      }
    };
    worker.onerror = error => {
      this.onError(this._getErrorFromErrorEvent(error));
      this.terminated = true;
    };
    worker.onmessageerror = event => console.error(event);
    return worker;
  }
  _createNodeWorker() {
    let worker;
    if (this.url) {
      const absolute = this.url.includes(':/') || this.url.startsWith('/');
      const url = absolute ? this.url : "./".concat(this.url);
      worker = new Worker$1(url, {
        eval: false
      });
    } else if (this.source) {
      worker = new Worker$1(this.source, {
        eval: true
      });
    } else {
      throw new Error('no worker');
    }
    worker.on('message', data => {
      this.onMessage(data);
    });
    worker.on('error', error => {
      this.onError(error);
    });
    worker.on('exit', code => {});
    return worker;
  }
}

class WorkerPool {
  static isSupported() {
    return WorkerThread.isSupported();
  }
  constructor(props) {
    _defineProperty(this, "name", 'unnamed');
    _defineProperty(this, "source", void 0);
    _defineProperty(this, "url", void 0);
    _defineProperty(this, "maxConcurrency", 1);
    _defineProperty(this, "maxMobileConcurrency", 1);
    _defineProperty(this, "onDebug", () => {});
    _defineProperty(this, "reuseWorkers", true);
    _defineProperty(this, "props", {});
    _defineProperty(this, "jobQueue", []);
    _defineProperty(this, "idleQueue", []);
    _defineProperty(this, "count", 0);
    _defineProperty(this, "isDestroyed", false);
    this.source = props.source;
    this.url = props.url;
    this.setProps(props);
  }
  destroy() {
    this.idleQueue.forEach(worker => worker.destroy());
    this.isDestroyed = true;
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    if (props.name !== undefined) {
      this.name = props.name;
    }
    if (props.maxConcurrency !== undefined) {
      this.maxConcurrency = props.maxConcurrency;
    }
    if (props.maxMobileConcurrency !== undefined) {
      this.maxMobileConcurrency = props.maxMobileConcurrency;
    }
    if (props.reuseWorkers !== undefined) {
      this.reuseWorkers = props.reuseWorkers;
    }
    if (props.onDebug !== undefined) {
      this.onDebug = props.onDebug;
    }
  }
  async startJob(name) {
    let onMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (job, type, data) => job.done(data);
    let onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (job, error) => job.error(error);
    const startPromise = new Promise(onStart => {
      this.jobQueue.push({
        name,
        onMessage,
        onError,
        onStart
      });
      return this;
    });
    this._startQueuedJob();
    return await startPromise;
  }
  async _startQueuedJob() {
    if (!this.jobQueue.length) {
      return;
    }
    const workerThread = this._getAvailableWorker();
    if (!workerThread) {
      return;
    }
    const queuedJob = this.jobQueue.shift();
    if (queuedJob) {
      this.onDebug({
        message: 'Starting job',
        name: queuedJob.name,
        workerThread,
        backlog: this.jobQueue.length
      });
      const job = new WorkerJob(queuedJob.name, workerThread);
      workerThread.onMessage = data => queuedJob.onMessage(job, data.type, data.payload);
      workerThread.onError = error => queuedJob.onError(job, error);
      queuedJob.onStart(job);
      try {
        await job.result;
      } finally {
        this.returnWorkerToQueue(workerThread);
      }
    }
  }
  returnWorkerToQueue(worker) {
    const shouldDestroyWorker = this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();
    if (shouldDestroyWorker) {
      worker.destroy();
      this.count--;
    } else {
      this.idleQueue.push(worker);
    }
    if (!this.isDestroyed) {
      this._startQueuedJob();
    }
  }
  _getAvailableWorker() {
    if (this.idleQueue.length > 0) {
      return this.idleQueue.shift() || null;
    }
    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const name = "".concat(this.name.toLowerCase(), " (#").concat(this.count, " of ").concat(this.maxConcurrency, ")");
      return new WorkerThread({
        name,
        source: this.source,
        url: this.url
      });
    }
    return null;
  }
  _getMaxConcurrency() {
    return isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
  }
}

const DEFAULT_PROPS = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: true,
  onDebug: () => {}
};
class WorkerFarm {
  static isSupported() {
    return WorkerThread.isSupported();
  }
  static getWorkerFarm() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});
    WorkerFarm._workerFarm.setProps(props);
    return WorkerFarm._workerFarm;
  }
  constructor(props) {
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "workerPools", new Map());
    this.props = {
      ...DEFAULT_PROPS
    };
    this.setProps(props);
    this.workerPools = new Map();
  }
  destroy() {
    for (const workerPool of this.workerPools.values()) {
      workerPool.destroy();
    }
    this.workerPools = new Map();
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    for (const workerPool of this.workerPools.values()) {
      workerPool.setProps(this._getWorkerPoolProps());
    }
  }
  getWorkerPool(options) {
    const {
      name,
      source,
      url
    } = options;
    let workerPool = this.workerPools.get(name);
    if (!workerPool) {
      workerPool = new WorkerPool({
        name,
        source,
        url
      });
      workerPool.setProps(this._getWorkerPoolProps());
      this.workerPools.set(name, workerPool);
    }
    return workerPool;
  }
  _getWorkerPoolProps() {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }
}
_defineProperty(WorkerFarm, "_workerFarm", void 0);

const NPM_TAG = 'latest';
const VERSION$7 = "3.4.14" ;
function getWorkerName(worker) {
  const warning = worker.version !== VERSION$7 ? " (worker-utils@".concat(VERSION$7, ")") : '';
  return "".concat(worker.name, "@").concat(worker.version).concat(warning);
}
function getWorkerURL(worker) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const workerOptions = options[worker.id] || {};
  const workerFile = "".concat(worker.id, "-worker.js");
  let url = workerOptions.workerUrl;
  if (!url && worker.id === 'compression') {
    url = options.workerUrl;
  }
  if (options._workerType === 'test') {
    url = "modules/".concat(worker.module, "/dist/").concat(workerFile);
  }
  if (!url) {
    let version = worker.version;
    if (version === 'latest') {
      version = NPM_TAG;
    }
    const versionTag = version ? "@".concat(version) : '';
    url = "https://unpkg.com/@loaders.gl/".concat(worker.module).concat(versionTag, "/dist/").concat(workerFile);
  }
  assert$4(url);
  return url;
}

async function processOnWorker(worker, data) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const name = getWorkerName(worker);
  const workerFarm = WorkerFarm.getWorkerFarm(options);
  const {
    source
  } = options;
  const workerPoolProps = {
    name,
    source
  };
  if (!source) {
    workerPoolProps.url = getWorkerURL(worker, options);
  }
  const workerPool = workerFarm.getWorkerPool(workerPoolProps);
  const jobName = options.jobName || worker.name;
  const job = await workerPool.startJob(jobName, onMessage$1.bind(null, context));
  const transferableOptions = getTransferListForWriter(options);
  job.postMessage('process', {
    input: data,
    options: transferableOptions
  });
  const result = await job.result;
  return result.result;
}
async function onMessage$1(context, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;
    case 'error':
      job.error(new Error(payload.error));
      break;
    case 'process':
      const {
        id,
        input,
        options
      } = payload;
      try {
        if (!context.process) {
          job.postMessage('error', {
            id,
            error: 'Worker not set up to process on main thread'
          });
          return;
        }
        const result = await context.process(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }
      break;
    default:
      console.warn("process-on-worker: unknown message ".concat(type));
  }
}

function validateWorkerVersion(worker) {
  let coreVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : VERSION$8;
  assert$4(worker, 'no worker provided');
  const workerVersion = worker.version;
  if (!coreVersion || !workerVersion) {
    return false;
  }
  return true;
}

const readFileAsArrayBuffer = null;
const readFileAsText = null;
const requireFromFile = null;
const requireFromString = null;

var node = /*#__PURE__*/Object.freeze({
    __proto__: null,
    readFileAsArrayBuffer: readFileAsArrayBuffer,
    readFileAsText: readFileAsText,
    requireFromFile: requireFromFile,
    requireFromString: requireFromString
});

const VERSION$6 = "3.4.14" ;
const loadLibraryPromises = {};
async function loadLibrary(libraryUrl) {
  let moduleName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (moduleName) {
    libraryUrl = getLibraryUrl(libraryUrl, moduleName, options);
  }
  loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);
  return await loadLibraryPromises[libraryUrl];
}
function getLibraryUrl(library, moduleName, options) {
  if (library.startsWith('http')) {
    return library;
  }
  const modules = options.modules || {};
  if (modules[library]) {
    return modules[library];
  }
  if (!isBrowser$1) {
    return "modules/".concat(moduleName, "/dist/libs/").concat(library);
  }
  if (options.CDN) {
    assert$4(options.CDN.startsWith('http'));
    return "".concat(options.CDN, "/").concat(moduleName, "@").concat(VERSION$6, "/dist/libs/").concat(library);
  }
  if (isWorker) {
    return "../src/libs/".concat(library);
  }
  return "modules/".concat(moduleName, "/src/libs/").concat(library);
}
async function loadLibraryFromFile(libraryUrl) {
  if (libraryUrl.endsWith('wasm')) {
    const response = await fetch(libraryUrl);
    return await response.arrayBuffer();
  }
  if (!isBrowser$1) {
    try {
      return node && requireFromFile && (await requireFromFile(libraryUrl));
    } catch {
      return null;
    }
  }
  if (isWorker) {
    return importScripts(libraryUrl);
  }
  const response = await fetch(libraryUrl);
  const scriptSource = await response.text();
  return loadLibraryFromString(scriptSource, libraryUrl);
}
function loadLibraryFromString(scriptSource, id) {
  if (!isBrowser$1) {
    return requireFromString ;
  }
  if (isWorker) {
    eval.call(global_, scriptSource);
    return null;
  }
  const script = document.createElement('script');
  script.id = id;
  try {
    script.appendChild(document.createTextNode(scriptSource));
  } catch (e) {
    script.text = scriptSource;
  }
  document.body.appendChild(script);
  return null;
}

function canParseWithWorker(loader, options) {
  if (!WorkerFarm.isSupported()) {
    return false;
  }
  if (!isBrowser$1 && !(options !== null && options !== void 0 && options._nodeWorkers)) {
    return false;
  }
  return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
}
async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
  const name = loader.id;
  const url = getWorkerURL(loader, options);
  const workerFarm = WorkerFarm.getWorkerFarm(options);
  const workerPool = workerFarm.getWorkerPool({
    name,
    url
  });
  options = JSON.parse(JSON.stringify(options));
  context = JSON.parse(JSON.stringify(context || {}));
  const job = await workerPool.startJob('process-on-worker', onMessage.bind(null, parseOnMainThread));
  job.postMessage('process', {
    input: data,
    options,
    context
  });
  const result = await job.result;
  return await result.result;
}
async function onMessage(parseOnMainThread, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;
    case 'error':
      job.error(new Error(payload.error));
      break;
    case 'process':
      const {
        id,
        input,
        options
      } = payload;
      try {
        const result = await parseOnMainThread(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }
      break;
    default:
      console.warn("parse-with-worker unknown message ".concat(type));
  }
}

function canEncodeWithWorker(writer, options) {
  if (!WorkerFarm.isSupported()) {
    return false;
  }
  if (!isBrowser$2 && !(options !== null && options !== void 0 && options._nodeWorkers)) {
    return false;
  }
  return writer.worker && (options === null || options === void 0 ? void 0 : options.worker);
}

function getFirstCharacters$1(data) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString$2(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString$2(data, byteOffset, length);
  }
  return '';
}
function getMagicString$2(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength <= byteOffset + length) {
    return '';
  }
  const dataView = new DataView(arrayBuffer);
  let magic = '';
  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }
  return magic;
}

function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (_) {
    throw new Error("Failed to parse JSON from data starting with \"".concat(getFirstCharacters$1(string), "\""));
  }
}

function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
  byteLength = byteLength || arrayBuffer1.byteLength;
  if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
    return false;
  }
  const array1 = new Uint8Array(arrayBuffer1);
  const array2 = new Uint8Array(arrayBuffer2);
  for (let i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
function concatenateArrayBuffers() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;
  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }
  return result.buffer;
}
function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
  const subArray = byteLength !== undefined ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
  const arrayCopy = new Uint8Array(subArray);
  return arrayCopy.buffer;
}

function padToNBytes(byteLength, padding) {
  assert$5(byteLength >= 0);
  assert$5(padding > 0);
  return byteLength + (padding - 1) & ~(padding - 1);
}
function copyToArray(source, target, targetOffset) {
  let sourceArray;
  if (source instanceof ArrayBuffer) {
    sourceArray = new Uint8Array(source);
  } else {
    const srcByteOffset = source.byteOffset;
    const srcByteLength = source.byteLength;
    sourceArray = new Uint8Array(source.buffer || source.arrayBuffer, srcByteOffset, srcByteLength);
  }
  target.set(sourceArray, targetOffset);
  return targetOffset + padToNBytes(sourceArray.byteLength, 4);
}

async function concatenateArrayBuffersAsync(asyncIterator) {
  const arrayBuffers = [];
  for await (const chunk of asyncIterator) {
    arrayBuffers.push(chunk);
  }
  return concatenateArrayBuffers(...arrayBuffers);
}

let pathPrefix = '';
const fileAliases = {};
function resolvePath(filename) {
  for (const alias in fileAliases) {
    if (filename.startsWith(alias)) {
      const replacement = fileAliases[alias];
      filename = filename.replace(alias, replacement);
    }
  }
  if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
    filename = "".concat(pathPrefix).concat(filename);
  }
  return filename;
}

function toArrayBuffer$3(buffer) {
  return buffer;
}
function toBuffer$1(binaryData) {
  throw new Error('Buffer not supported in browser');
}

function isBuffer$1(value) {
  return value && typeof value === 'object' && value.isBuffer;
}
function toBuffer(data) {
  return toBuffer$1 ? toBuffer$1() : data;
}
function toArrayBuffer$2(data) {
  if (isBuffer$1(data)) {
    return toArrayBuffer$3(data);
  }
  if (data instanceof ArrayBuffer) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }
  if (data && typeof data === 'object' && data._toArrayBuffer) {
    return data._toArrayBuffer();
  }
  throw new Error('toArrayBuffer');
}

function filename(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(slashIndex + 1) : '';
}
function dirname(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(0, slashIndex) : '';
}

const writeFile$1 = null;

const isBoolean = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isObject = x => x !== null && typeof x === 'object';
const isPureObject = x => isObject(x) && x.constructor === {}.constructor;
const isIterable = x => x && typeof x[Symbol.iterator] === 'function';
const isAsyncIterable = x => x && typeof x[Symbol.asyncIterator] === 'function';
const isResponse = x => typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
const isBlob = x => typeof Blob !== 'undefined' && x instanceof Blob;
const isBuffer = x => x && typeof x === 'object' && x.isBuffer;
const isReadableDOMStream = x => typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
const isReadableStream = x => isReadableDOMStream(x) || isReadableNodeStream(x);

const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
function parseMIMEType(mimeString) {
  const matches = MIME_TYPE_PATTERN.exec(mimeString);
  if (matches) {
    return matches[1];
  }
  return mimeString;
}
function parseMIMETypeFromURL(url) {
  const matches = DATA_URL_PATTERN.exec(url);
  if (matches) {
    return matches[1];
  }
  return '';
}

const QUERY_STRING_PATTERN = /\?.*/;
function extractQueryString(url) {
  const matches = url.match(QUERY_STRING_PATTERN);
  return matches && matches[0];
}
function stripQueryString(url) {
  return url.replace(QUERY_STRING_PATTERN, '');
}

function getResourceUrl(resource) {
  if (isResponse(resource)) {
    const response = resource;
    return response.url;
  }
  if (isBlob(resource)) {
    const blob = resource;
    return blob.name || '';
  }
  if (typeof resource === 'string') {
    return resource;
  }
  return '';
}
function getResourceMIMEType(resource) {
  if (isResponse(resource)) {
    const response = resource;
    const contentTypeHeader = response.headers.get('content-type') || '';
    const noQueryUrl = stripQueryString(response.url);
    return parseMIMEType(contentTypeHeader) || parseMIMETypeFromURL(noQueryUrl);
  }
  if (isBlob(resource)) {
    const blob = resource;
    return blob.type || '';
  }
  if (typeof resource === 'string') {
    return parseMIMETypeFromURL(resource);
  }
  return '';
}
function getResourceContentLength(resource) {
  if (isResponse(resource)) {
    const response = resource;
    return response.headers['content-length'] || -1;
  }
  if (isBlob(resource)) {
    const blob = resource;
    return blob.size;
  }
  if (typeof resource === 'string') {
    return resource.length;
  }
  if (resource instanceof ArrayBuffer) {
    return resource.byteLength;
  }
  if (ArrayBuffer.isView(resource)) {
    return resource.byteLength;
  }
  return -1;
}

async function makeResponse(resource) {
  if (isResponse(resource)) {
    return resource;
  }
  const headers = {};
  const contentLength = getResourceContentLength(resource);
  if (contentLength >= 0) {
    headers['content-length'] = String(contentLength);
  }
  const url = getResourceUrl(resource);
  const type = getResourceMIMEType(resource);
  if (type) {
    headers['content-type'] = type;
  }
  const initialDataUrl = await getInitialDataUrl(resource);
  if (initialDataUrl) {
    headers['x-first-bytes'] = initialDataUrl;
  }
  if (typeof resource === 'string') {
    resource = new TextEncoder().encode(resource);
  }
  const response = new Response(resource, {
    headers
  });
  Object.defineProperty(response, 'url', {
    value: url
  });
  return response;
}
async function checkResponse(response) {
  if (!response.ok) {
    const message = await getResponseError(response);
    throw new Error(message);
  }
}
async function getResponseError(response) {
  let message = "Failed to fetch resource ".concat(response.url, " (").concat(response.status, "): ");
  try {
    const contentType = response.headers.get('Content-Type');
    let text = response.statusText;
    if (contentType.includes('application/json')) {
      text += " ".concat(await response.text());
    }
    message += text;
    message = message.length > 60 ? "".concat(message.slice(0, 60), "...") : message;
  } catch (error) {}
  return message;
}
async function getInitialDataUrl(resource) {
  const INITIAL_DATA_LENGTH = 5;
  if (typeof resource === 'string') {
    return "data:,".concat(resource.slice(0, INITIAL_DATA_LENGTH));
  }
  if (resource instanceof Blob) {
    const blobSlice = resource.slice(0, 5);
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => {
        var _event$target;
        return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
      };
      reader.readAsDataURL(blobSlice);
    });
  }
  if (resource instanceof ArrayBuffer) {
    const slice = resource.slice(0, INITIAL_DATA_LENGTH);
    const base64 = arrayBufferToBase64(slice);
    return "data:base64,".concat(base64);
  }
  return null;
}
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function fetchFile(url, options) {
  if (typeof url === 'string') {
    url = resolvePath(url);
    let fetchOptions = options;
    if (options !== null && options !== void 0 && options.fetch && typeof (options === null || options === void 0 ? void 0 : options.fetch) !== 'function') {
      fetchOptions = options.fetch;
    }
    return await fetch(url, fetchOptions);
  }
  return await makeResponse(url);
}

async function writeFile(filePath, arrayBufferOrString, options) {
  filePath = resolvePath(filePath);
  if (!isBrowser$2) {
    await writeFile$1(filePath, toBuffer(arrayBufferOrString), {
      flag: 'w'
    });
  }
  assert$5(false);
}

function isElectron(mockUserAgent) {
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  if (typeof process !== 'undefined' && typeof process.versions === 'object' && Boolean(process.versions['electron'])) {
    return true;
  }

  const realUserAgent = typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent;
  const userAgent = mockUserAgent || realUserAgent;

  if (userAgent && userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;
}

function isBrowser() {
  const isNode = typeof process === 'object' && String(process) === '[object process]' && !process.browser;
  return !isNode || isElectron();
}

const window_ = globalThis.window || globalThis.self || globalThis.global;
const process_ = globalThis.process || {};

const VERSION$5 = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'untranspiled source';
isBrowser();

function getStorage(type) {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (e) {
    return null;
  }
}

class LocalStorage {
  constructor(id, defaultConfig) {
    let type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sessionStorage';
    this.storage = void 0;
    this.id = void 0;
    this.config = void 0;
    this.storage = getStorage(type);
    this.id = id;
    this.config = defaultConfig;

    this._loadConfiguration();
  }

  getConfiguration() {
    return this.config;
  }

  setConfiguration(configuration) {
    Object.assign(this.config, configuration);

    if (this.storage) {
      const serialized = JSON.stringify(this.config);
      this.storage.setItem(this.id, serialized);
    }
  }

  _loadConfiguration() {
    let configuration = {};

    if (this.storage) {
      const serializedConfiguration = this.storage.getItem(this.id);
      configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
    }

    Object.assign(this.config, configuration);
    return this;
  }

}

function formatTime(ms) {
  let formatted;

  if (ms < 10) {
    formatted = "".concat(ms.toFixed(2), "ms");
  } else if (ms < 100) {
    formatted = "".concat(ms.toFixed(1), "ms");
  } else if (ms < 1000) {
    formatted = "".concat(ms.toFixed(0), "ms");
  } else {
    formatted = "".concat((ms / 1000).toFixed(2), "s");
  }

  return formatted;
}
function leftPad(string) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  const padLength = Math.max(length - string.length, 0);
  return "".concat(' '.repeat(padLength)).concat(string);
}

function formatImage(image, message, scale) {
  let maxWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 600;
  const imageUrl = image.src.replace(/\(/g, '%28').replace(/\)/g, '%29');

  if (image.width > maxWidth) {
    scale = Math.min(scale, maxWidth / image.width);
  }

  const width = image.width * scale;
  const height = image.height * scale;
  const style = ['font-size:1px;', "padding:".concat(Math.floor(height / 2), "px ").concat(Math.floor(width / 2), "px;"), "line-height:".concat(height, "px;"), "background:url(".concat(imageUrl, ");"), "background-size:".concat(width, "px ").concat(height, "px;"), 'color:transparent;'].join('');
  return ["".concat(message, " %c+"), style];
}

let COLOR;

(function (COLOR) {
  COLOR[COLOR["BLACK"] = 30] = "BLACK";
  COLOR[COLOR["RED"] = 31] = "RED";
  COLOR[COLOR["GREEN"] = 32] = "GREEN";
  COLOR[COLOR["YELLOW"] = 33] = "YELLOW";
  COLOR[COLOR["BLUE"] = 34] = "BLUE";
  COLOR[COLOR["MAGENTA"] = 35] = "MAGENTA";
  COLOR[COLOR["CYAN"] = 36] = "CYAN";
  COLOR[COLOR["WHITE"] = 37] = "WHITE";
  COLOR[COLOR["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
  COLOR[COLOR["BRIGHT_RED"] = 91] = "BRIGHT_RED";
  COLOR[COLOR["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
  COLOR[COLOR["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
  COLOR[COLOR["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
  COLOR[COLOR["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
  COLOR[COLOR["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
  COLOR[COLOR["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
})(COLOR || (COLOR = {}));

const BACKGROUND_INCREMENT = 10;

function getColor(color) {
  if (typeof color !== 'string') {
    return color;
  }

  color = color.toUpperCase();
  return COLOR[color] || COLOR.WHITE;
}

function addColor(string, color, background) {
  if (!isBrowser && typeof string === 'string') {
    if (color) {
      const colorCode = getColor(color);
      string = "\x1B[".concat(colorCode, "m").concat(string, "\x1B[39m");
    }

    if (background) {
      const colorCode = getColor(background);
      string = "\x1B[".concat(colorCode + BACKGROUND_INCREMENT, "m").concat(string, "\x1B[49m");
    }
  }

  return string;
}

function autobind(obj) {
  let predefined = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['constructor'];
  const proto = Object.getPrototypeOf(obj);
  const propNames = Object.getOwnPropertyNames(proto);
  const object = obj;

  for (const key of propNames) {
    const value = object[key];

    if (typeof value === 'function') {
      if (!predefined.find(name => key === name)) {
        object[key] = value.bind(obj);
      }
    }
  }
}

function assert$3(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function getHiResTimestamp() {
  let timestamp;

  if (isBrowser() && window_.performance) {
    var _window$performance, _window$performance$n;

    timestamp = window_ === null || window_ === void 0 ? void 0 : (_window$performance = window_.performance) === null || _window$performance === void 0 ? void 0 : (_window$performance$n = _window$performance.now) === null || _window$performance$n === void 0 ? void 0 : _window$performance$n.call(_window$performance);
  } else if ('hrtime' in process_) {
    var _process$hrtime;

    const timeParts = process_ === null || process_ === void 0 ? void 0 : (_process$hrtime = process_.hrtime) === null || _process$hrtime === void 0 ? void 0 : _process$hrtime.call(process_);
    timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
  } else {
    timestamp = Date.now();
  }

  return timestamp;
}

const originalConsole = {
  debug: isBrowser() ? console.debug || console.log : console.log,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};
const DEFAULT_LOG_CONFIGURATION = {
  enabled: true,
  level: 0
};

function noop() {}

const cache = {};
const ONCE = {
  once: true
};
class Log {
  constructor() {
    let {
      id
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      id: ''
    };
    this.id = void 0;
    this.VERSION = VERSION$5;
    this._startTs = getHiResTimestamp();
    this._deltaTs = getHiResTimestamp();
    this._storage = void 0;
    this.userData = {};
    this.LOG_THROTTLE_TIMEOUT = 0;
    this.id = id;
    this.userData = {};
    this._storage = new LocalStorage("__probe-".concat(this.id, "__"), DEFAULT_LOG_CONFIGURATION);
    this.timeStamp("".concat(this.id, " started"));
    autobind(this);
    Object.seal(this);
  }

  set level(newLevel) {
    this.setLevel(newLevel);
  }

  get level() {
    return this.getLevel();
  }

  isEnabled() {
    return this._storage.config.enabled;
  }

  getLevel() {
    return this._storage.config.level;
  }

  getTotal() {
    return Number((getHiResTimestamp() - this._startTs).toPrecision(10));
  }

  getDelta() {
    return Number((getHiResTimestamp() - this._deltaTs).toPrecision(10));
  }

  set priority(newPriority) {
    this.level = newPriority;
  }

  get priority() {
    return this.level;
  }

  getPriority() {
    return this.level;
  }

  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    this._storage.setConfiguration({
      enabled
    });

    return this;
  }

  setLevel(level) {
    this._storage.setConfiguration({
      level
    });

    return this;
  }

  get(setting) {
    return this._storage.config[setting];
  }

  set(setting, value) {
    this._storage.setConfiguration({
      [setting]: value
    });
  }

  settings() {
    if (console.table) {
      console.table(this._storage.config);
    } else {
      console.log(this._storage.config);
    }
  }

  assert(condition, message) {
    assert$3(condition, message);
  }

  warn(message) {
    return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
  }

  error(message) {
    return this._getLogFunction(0, message, originalConsole.error, arguments);
  }

  deprecated(oldUsage, newUsage) {
    return this.warn("`".concat(oldUsage, "` is deprecated and will be removed in a later version. Use `").concat(newUsage, "` instead"));
  }

  removed(oldUsage, newUsage) {
    return this.error("`".concat(oldUsage, "` has been removed. Use `").concat(newUsage, "` instead"));
  }

  probe(logLevel, message) {
    return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
      time: true,
      once: true
    });
  }

  log(logLevel, message) {
    return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
  }

  info(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.info, arguments);
  }

  once(logLevel, message) {
    return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
  }

  table(logLevel, table, columns) {
    if (table) {
      return this._getLogFunction(logLevel, table, console.table || noop, columns && [columns], {
        tag: getTableHeader(table)
      });
    }

    return noop;
  }

  image(_ref) {
    let {
      logLevel,
      priority,
      image,
      message = '',
      scale = 1
    } = _ref;

    if (!this._shouldLog(logLevel || priority)) {
      return noop;
    }

    return isBrowser() ? logImageInBrowser({
      image,
      message,
      scale
    }) : logImageInNode();
  }

  time(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
  }

  timeEnd(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
  }

  timeStamp(logLevel, message) {
    return this._getLogFunction(logLevel, message, console.timeStamp || noop);
  }

  group(logLevel, message) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      collapsed: false
    };
    const options = normalizeArguments({
      logLevel,
      message,
      opts
    });
    const {
      collapsed
    } = opts;
    options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
    return this._getLogFunction(options);
  }

  groupCollapsed(logLevel, message) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.group(logLevel, message, Object.assign({}, opts, {
      collapsed: true
    }));
  }

  groupEnd(logLevel) {
    return this._getLogFunction(logLevel, '', console.groupEnd || noop);
  }

  withGroup(logLevel, message, func) {
    this.group(logLevel, message)();

    try {
      func();
    } finally {
      this.groupEnd(logLevel)();
    }
  }

  trace() {
    if (console.trace) {
      console.trace();
    }
  }

  _shouldLog(logLevel) {
    return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
  }

  _getLogFunction(logLevel, message, method, args, opts) {
    if (this._shouldLog(logLevel)) {
      opts = normalizeArguments({
        logLevel,
        message,
        args,
        opts
      });
      method = method || opts.method;
      assert$3(method);
      opts.total = this.getTotal();
      opts.delta = this.getDelta();
      this._deltaTs = getHiResTimestamp();
      const tag = opts.tag || opts.message;

      if (opts.once && tag) {
        if (!cache[tag]) {
          cache[tag] = getHiResTimestamp();
        } else {
          return noop;
        }
      }

      message = decorateMessage(this.id, opts.message, opts);
      return method.bind(console, message, ...opts.args);
    }

    return noop;
  }

}
Log.VERSION = VERSION$5;

function normalizeLogLevel(logLevel) {
  if (!logLevel) {
    return 0;
  }

  let resolvedLevel;

  switch (typeof logLevel) {
    case 'number':
      resolvedLevel = logLevel;
      break;

    case 'object':
      resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
      break;

    default:
      return 0;
  }

  assert$3(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
  return resolvedLevel;
}

function normalizeArguments(opts) {
  const {
    logLevel,
    message
  } = opts;
  opts.logLevel = normalizeLogLevel(logLevel);
  const args = opts.args ? Array.from(opts.args) : [];

  while (args.length && args.shift() !== message) {}

  switch (typeof logLevel) {
    case 'string':
    case 'function':
      if (message !== undefined) {
        args.unshift(message);
      }

      opts.message = logLevel;
      break;

    case 'object':
      Object.assign(opts, logLevel);
      break;
  }

  if (typeof opts.message === 'function') {
    opts.message = opts.message();
  }

  const messageType = typeof opts.message;
  assert$3(messageType === 'string' || messageType === 'object');
  return Object.assign(opts, {
    args
  }, opts.opts);
}

function decorateMessage(id, message, opts) {
  if (typeof message === 'string') {
    const time = opts.time ? leftPad(formatTime(opts.total)) : '';
    message = opts.time ? "".concat(id, ": ").concat(time, "  ").concat(message) : "".concat(id, ": ").concat(message);
    message = addColor(message, opts.color, opts.background);
  }

  return message;
}

function logImageInNode(_ref2) {
  console.warn('removed');
  return noop;
}

function logImageInBrowser(_ref3) {
  let {
    image,
    message = '',
    scale = 1
  } = _ref3;

  if (typeof image === 'string') {
    const img = new Image();

    img.onload = () => {
      const args = formatImage(img, message, scale);
      console.log(...args);
    };

    img.src = image;
    return noop;
  }

  const element = image.nodeName || '';

  if (element.toLowerCase() === 'img') {
    console.log(...formatImage(image, message, scale));
    return noop;
  }

  if (element.toLowerCase() === 'canvas') {
    const img = new Image();

    img.onload = () => console.log(...formatImage(img, message, scale));

    img.src = image.toDataURL();
    return noop;
  }

  return noop;
}

function getTableHeader(table) {
  for (const key in table) {
    for (const title in table[key]) {
      return title || 'untitled';
    }
  }

  return 'empty';
}

const probeLog = new Log({
  id: 'loaders.gl'
});
class NullLog {
  log() {
    return () => {};
  }
  info() {
    return () => {};
  }
  warn() {
    return () => {};
  }
  error() {
    return () => {};
  }
}
class ConsoleLog {
  constructor() {
    _defineProperty(this, "console", void 0);
    this.console = console;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.console.log.bind(this.console, ...args);
  }
  info() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.console.info.bind(this.console, ...args);
  }
  warn() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.console.warn.bind(this.console, ...args);
  }
  error() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.console.error.bind(this.console, ...args);
  }
}

const DEFAULT_LOADER_OPTIONS = {
  fetch: null,
  mimeType: undefined,
  nothrow: false,
  log: new ConsoleLog(),
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: true,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: isBrowser$2,
  _nodeWorkers: false,
  _workerType: '',
  limit: 0,
  _limitMB: 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  metadata: false,
  transforms: []
};
const REMOVED_LOADER_OPTIONS = {
  throws: 'nothrow',
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};

function getGlobalLoaderState() {
  globalThis.loaders = globalThis.loaders || {};
  const {
    loaders
  } = globalThis;
  loaders._state = loaders._state || {};
  return loaders._state;
}
const getGlobalLoaderOptions = () => {
  const state = getGlobalLoaderState();
  state.globalOptions = state.globalOptions || {
    ...DEFAULT_LOADER_OPTIONS
  };
  return state.globalOptions;
};
function normalizeOptions(options, loader, loaders, url) {
  loaders = loaders || [];
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  validateOptions(options, loaders);
  return normalizeOptionsInternal(loader, options, url);
}
function validateOptions(options, loaders) {
  validateOptionsObject(options, null, DEFAULT_LOADER_OPTIONS, REMOVED_LOADER_OPTIONS, loaders);
  for (const loader of loaders) {
    const idOptions = options && options[loader.id] || {};
    const loaderOptions = loader.options && loader.options[loader.id] || {};
    const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
    validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
  }
}
function validateOptionsObject(options, id, defaultOptions, deprecatedOptions, loaders) {
  const loaderName = id || 'Top level';
  const prefix = id ? "".concat(id, ".") : '';
  for (const key in options) {
    const isSubOptions = !id && isObject(options[key]);
    const isBaseUriOption = key === 'baseUri' && !id;
    const isWorkerUrlOption = key === 'workerUrl' && id;
    if (!(key in defaultOptions) && !isBaseUriOption && !isWorkerUrlOption) {
      if (key in deprecatedOptions) {
        probeLog.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' no longer supported, use '").concat(deprecatedOptions[key], "'"))();
      } else if (!isSubOptions) {
        const suggestion = findSimilarOption(key, loaders);
        probeLog.warn("".concat(loaderName, " loader option '").concat(prefix).concat(key, "' not recognized. ").concat(suggestion))();
      }
    }
  }
}
function findSimilarOption(optionKey, loaders) {
  const lowerCaseOptionKey = optionKey.toLowerCase();
  let bestSuggestion = '';
  for (const loader of loaders) {
    for (const key in loader.options) {
      if (optionKey === key) {
        return "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }
      const lowerCaseKey = key.toLowerCase();
      const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);
      if (isPartialMatch) {
        bestSuggestion = bestSuggestion || "Did you mean '".concat(loader.id, ".").concat(key, "'?");
      }
    }
  }
  return bestSuggestion;
}
function normalizeOptionsInternal(loader, options, url) {
  const loaderDefaultOptions = loader.options || {};
  const mergedOptions = {
    ...loaderDefaultOptions
  };
  addUrlOptions(mergedOptions, url);
  if (mergedOptions.log === null) {
    mergedOptions.log = new NullLog();
  }
  mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
  mergeNestedFields(mergedOptions, options);
  return mergedOptions;
}
function mergeNestedFields(mergedOptions, options) {
  for (const key in options) {
    if (key in options) {
      const value = options[key];
      if (isPureObject(value) && isPureObject(mergedOptions[key])) {
        mergedOptions[key] = {
          ...mergedOptions[key],
          ...options[key]
        };
      } else {
        mergedOptions[key] = options[key];
      }
    }
  }
}
function addUrlOptions(options, url) {
  if (url && !('baseUri' in options)) {
    options.baseUri = url;
  }
}

function isLoaderObject(loader) {
  var _loader;
  if (!loader) {
    return false;
  }
  if (Array.isArray(loader)) {
    loader = loader[0];
  }
  const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
  return hasExtensions;
}
function normalizeLoader(loader) {
  var _loader2, _loader3;
  assert$5(loader, 'null loader');
  assert$5(isLoaderObject(loader), 'invalid loader');
  let options;
  if (Array.isArray(loader)) {
    options = loader[1];
    loader = loader[0];
    loader = {
      ...loader,
      options: {
        ...loader.options,
        ...options
      }
    };
  }
  if ((_loader2 = loader) !== null && _loader2 !== void 0 && _loader2.parseTextSync || (_loader3 = loader) !== null && _loader3 !== void 0 && _loader3.parseText) {
    loader.text = true;
  }
  if (!loader.text) {
    loader.binary = true;
  }
  return loader;
}

const getGlobalLoaderRegistry = () => {
  const state = getGlobalLoaderState();
  state.loaderRegistry = state.loaderRegistry || [];
  return state.loaderRegistry;
};
function getRegisteredLoaders() {
  return getGlobalLoaderRegistry();
}

const log = new Log({
  id: 'loaders.gl'
});

const EXT_PATTERN = /\.([^.]+)$/;
async function selectLoader(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  let loader = selectLoaderSync(data, loaders, {
    ...options,
    nothrow: true
  }, context);
  if (loader) {
    return loader;
  }
  if (isBlob(data)) {
    data = await data.slice(0, 10).arrayBuffer();
    loader = selectLoaderSync(data, loaders, options, context);
  }
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderSync(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  if (loaders && !Array.isArray(loaders)) {
    return normalizeLoader(loaders);
  }
  let candidateLoaders = [];
  if (loaders) {
    candidateLoaders = candidateLoaders.concat(loaders);
  }
  if (!(options !== null && options !== void 0 && options.ignoreRegisteredLoaders)) {
    candidateLoaders.push(...getRegisteredLoaders());
  }
  normalizeLoaders(candidateLoaders);
  const loader = selectLoaderInternal(data, candidateLoaders, options, context);
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderInternal(data, loaders, options, context) {
  const url = getResourceUrl(data);
  const type = getResourceMIMEType(data);
  const testUrl = stripQueryString(url) || (context === null || context === void 0 ? void 0 : context.url);
  let loader = null;
  let reason = '';
  if (options !== null && options !== void 0 && options.mimeType) {
    loader = findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.mimeType);
    reason = "match forced by supplied MIME type ".concat(options === null || options === void 0 ? void 0 : options.mimeType);
  }
  loader = loader || findLoaderByUrl(loaders, testUrl);
  reason = reason || (loader ? "matched url ".concat(testUrl) : '');
  loader = loader || findLoaderByMIMEType(loaders, type);
  reason = reason || (loader ? "matched MIME type ".concat(type) : '');
  loader = loader || findLoaderByInitialBytes(loaders, data);
  reason = reason || (loader ? "matched initial data ".concat(getFirstCharacters(data)) : '');
  loader = loader || findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.fallbackMimeType);
  reason = reason || (loader ? "matched fallback MIME type ".concat(type) : '');
  if (reason) {
    var _loader;
    log.log(1, "selectLoader selected ".concat((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.name, ": ").concat(reason, "."));
  }
  return loader;
}
function validHTTPResponse(data) {
  if (data instanceof Response) {
    if (data.status === 204) {
      return false;
    }
  }
  return true;
}
function getNoValidLoaderMessage(data) {
  const url = getResourceUrl(data);
  const type = getResourceMIMEType(data);
  let message = 'No valid loader found (';
  message += url ? "".concat(filename(url), ", ") : 'no url provided, ';
  message += "MIME type: ".concat(type ? "\"".concat(type, "\"") : 'not provided', ", ");
  const firstCharacters = data ? getFirstCharacters(data) : '';
  message += firstCharacters ? " first bytes: \"".concat(firstCharacters, "\"") : 'first bytes: not available';
  message += ')';
  return message;
}
function normalizeLoaders(loaders) {
  for (const loader of loaders) {
    normalizeLoader(loader);
  }
}
function findLoaderByUrl(loaders, url) {
  const match = url && EXT_PATTERN.exec(url);
  const extension = match && match[1];
  return extension ? findLoaderByExtension(loaders, extension) : null;
}
function findLoaderByExtension(loaders, extension) {
  extension = extension.toLowerCase();
  for (const loader of loaders) {
    for (const loaderExtension of loader.extensions) {
      if (loaderExtension.toLowerCase() === extension) {
        return loader;
      }
    }
  }
  return null;
}
function findLoaderByMIMEType(loaders, mimeType) {
  for (const loader of loaders) {
    if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
      return loader;
    }
    if (mimeType === "application/x.".concat(loader.id)) {
      return loader;
    }
  }
  return null;
}
function findLoaderByInitialBytes(loaders, data) {
  if (!data) {
    return null;
  }
  for (const loader of loaders) {
    if (typeof data === 'string') {
      if (testDataAgainstText(data, loader)) {
        return loader;
      }
    } else if (ArrayBuffer.isView(data)) {
      if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
        return loader;
      }
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      if (testDataAgainstBinary(data, byteOffset, loader)) {
        return loader;
      }
    }
  }
  return null;
}
function testDataAgainstText(data, loader) {
  if (loader.testText) {
    return loader.testText(data);
  }
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => data.startsWith(test));
}
function testDataAgainstBinary(data, byteOffset, loader) {
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => testBinary(data, byteOffset, loader, test));
}
function testBinary(data, byteOffset, loader, test) {
  if (test instanceof ArrayBuffer) {
    return compareArrayBuffers(test, data, test.byteLength);
  }
  switch (typeof test) {
    case 'function':
      return test(data, loader);
    case 'string':
      const magic = getMagicString$1(data, byteOffset, test.length);
      return test === magic;
    default:
      return false;
  }
}
function getFirstCharacters(data) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString$1(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString$1(data, byteOffset, length);
  }
  return '';
}
function getMagicString$1(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength < byteOffset + length) {
    return '';
  }
  const dataView = new DataView(arrayBuffer);
  let magic = '';
  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }
  return magic;
}

const DEFAULT_CHUNK_SIZE$2 = 256 * 1024;
function* makeStringIterator(string, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE$2;
  let offset = 0;
  const textEncoder = new TextEncoder();
  while (offset < string.length) {
    const chunkLength = Math.min(string.length - offset, chunkSize);
    const chunk = string.slice(offset, offset + chunkLength);
    offset += chunkLength;
    yield textEncoder.encode(chunk);
  }
}

const DEFAULT_CHUNK_SIZE$1 = 256 * 1024;
function makeArrayBufferIterator(arrayBuffer) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE$1
    } = options;
    let byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
      const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
      const chunk = new ArrayBuffer(chunkByteLength);
      const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
      const chunkArray = new Uint8Array(chunk);
      chunkArray.set(sourceArray);
      byteOffset += chunkByteLength;
      yield chunk;
    }
  }();
}

const DEFAULT_CHUNK_SIZE = 1024 * 1024;
async function* makeBlobIterator(blob, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;
  while (offset < blob.size) {
    const end = offset + chunkSize;
    const chunk = await blob.slice(offset, end).arrayBuffer();
    offset = end;
    yield chunk;
  }
}

function makeStreamIterator(stream, options) {
  return isBrowser$2 ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream);
}
async function* makeBrowserStreamIterator(stream, options) {
  const reader = stream.getReader();
  let nextBatchPromise;
  try {
    while (true) {
      const currentBatchPromise = nextBatchPromise || reader.read();
      if (options !== null && options !== void 0 && options._streamReadAhead) {
        nextBatchPromise = reader.read();
      }
      const {
        done,
        value
      } = await currentBatchPromise;
      if (done) {
        return;
      }
      yield toArrayBuffer$2(value);
    }
  } catch (error) {
    reader.releaseLock();
  }
}
async function* makeNodeStreamIterator(stream, options) {
  for await (const chunk of stream) {
    yield toArrayBuffer$2(chunk);
  }
}

function makeIterator(data, options) {
  if (typeof data === 'string') {
    return makeStringIterator(data, options);
  }
  if (data instanceof ArrayBuffer) {
    return makeArrayBufferIterator(data, options);
  }
  if (isBlob(data)) {
    return makeBlobIterator(data, options);
  }
  if (isReadableStream(data)) {
    return makeStreamIterator(data, options);
  }
  if (isResponse(data)) {
    const response = data;
    return makeStreamIterator(response.body, options);
  }
  throw new Error('makeIterator');
}

const ERR_DATA = 'Cannot convert supplied data type';
function getArrayBufferOrStringFromDataSync(data, loader, options) {
  if (loader.text && typeof data === 'string') {
    return data;
  }
  if (isBuffer(data)) {
    data = data.buffer;
  }
  if (data instanceof ArrayBuffer) {
    const arrayBuffer = data;
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(arrayBuffer);
    }
    return arrayBuffer;
  }
  if (ArrayBuffer.isView(data)) {
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(data);
    }
    let arrayBuffer = data.buffer;
    const byteLength = data.byteLength || data.length;
    if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
      arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
    }
    return arrayBuffer;
  }
  throw new Error(ERR_DATA);
}
async function getArrayBufferOrStringFromData(data, loader, options) {
  const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);
  if (typeof data === 'string' || isArrayBuffer) {
    return getArrayBufferOrStringFromDataSync(data, loader);
  }
  if (isBlob(data)) {
    data = await makeResponse(data);
  }
  if (isResponse(data)) {
    const response = data;
    await checkResponse(response);
    return loader.binary ? await response.arrayBuffer() : await response.text();
  }
  if (isReadableStream(data)) {
    data = makeIterator(data, options);
  }
  if (isIterable(data) || isAsyncIterable(data)) {
    return concatenateArrayBuffersAsync(data);
  }
  throw new Error(ERR_DATA);
}

function getFetchFunction(options, context) {
  const globalOptions = getGlobalLoaderOptions();
  const fetchOptions = options || globalOptions;
  if (typeof fetchOptions.fetch === 'function') {
    return fetchOptions.fetch;
  }
  if (isObject(fetchOptions.fetch)) {
    return url => fetchFile(url, fetchOptions);
  }
  if (context !== null && context !== void 0 && context.fetch) {
    return context === null || context === void 0 ? void 0 : context.fetch;
  }
  return fetchFile;
}

function getLoaderContext(context, options, parentContext) {
  if (parentContext) {
    return parentContext;
  }
  const newContext = {
    fetch: getFetchFunction(options, context),
    ...context
  };
  if (newContext.url) {
    const baseUrl = stripQueryString(newContext.url);
    newContext.baseUrl = baseUrl;
    newContext.queryString = extractQueryString(newContext.url);
    newContext.filename = filename(baseUrl);
    newContext.baseUrl = dirname(baseUrl);
  }
  if (!Array.isArray(newContext.loaders)) {
    newContext.loaders = null;
  }
  return newContext;
}
function getLoadersFromContext(loaders, context) {
  if (!context && loaders && !Array.isArray(loaders)) {
    return loaders;
  }
  let candidateLoaders;
  if (loaders) {
    candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
  }
  if (context && context.loaders) {
    const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
    candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
  }
  return candidateLoaders && candidateLoaders.length ? candidateLoaders : null;
}

async function parse$2(data, loaders, options, context) {
  assert$4(!context || typeof context === 'object');
  if (loaders && !Array.isArray(loaders) && !isLoaderObject(loaders)) {
    context = undefined;
    options = loaders;
    loaders = undefined;
  }
  data = await data;
  options = options || {};
  const url = getResourceUrl(data);
  const typedLoaders = loaders;
  const candidateLoaders = getLoadersFromContext(typedLoaders, context);
  const loader = await selectLoader(data, candidateLoaders, options);
  if (!loader) {
    return null;
  }
  options = normalizeOptions(options, loader, candidateLoaders, url);
  context = getLoaderContext({
    url,
    parse: parse$2,
    loaders: candidateLoaders
  }, options, context || null);
  return await parseWithLoader(loader, data, options, context);
}
async function parseWithLoader(loader, data, options, context) {
  validateWorkerVersion(loader);
  if (isResponse(data)) {
    const response = data;
    const {
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    } = response;
    const headers = Object.fromEntries(response.headers.entries());
    context.response = {
      headers,
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    };
  }
  data = await getArrayBufferOrStringFromData(data, loader, options);
  if (loader.parseTextSync && typeof data === 'string') {
    options.dataType = 'text';
    return loader.parseTextSync(data, options, context, loader);
  }
  if (canParseWithWorker(loader, options)) {
    return await parseWithWorker(loader, data, options, context, parse$2);
  }
  if (loader.parseText && typeof data === 'string') {
    return await loader.parseText(data, options, context, loader);
  }
  if (loader.parse) {
    return await loader.parse(data, options, context, loader);
  }
  assert$4(!loader.parseSync);
  throw new Error("".concat(loader.id, " loader - no parser found and worker is disabled"));
}

async function load(url, loaders, options, context) {
  if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
    options = loaders;
    loaders = undefined;
  }
  const fetch = getFetchFunction(options);
  let data = url;
  if (typeof url === 'string') {
    data = await fetch(url);
  }
  if (isBlob(url)) {
    data = await fetch(url);
  }
  return await parse$2(data, loaders, options);
}

async function encode$4(data, writer, options) {
  const globalOptions = getGlobalLoaderOptions();
  options = {
    ...globalOptions,
    ...options
  };
  if (canEncodeWithWorker(writer, options)) {
    return await processOnWorker(writer, data, options);
  }
  if (writer.encode) {
    return await writer.encode(data, options);
  }
  if (writer.encodeSync) {
    return writer.encodeSync(data, options);
  }
  if (writer.encodeText) {
    return new TextEncoder().encode(await writer.encodeText(data, options));
  }
  if (writer.encodeInBatches) {
    const batches = encodeInBatches(data, writer, options);
    const chunks = [];
    for await (const batch of batches) {
      chunks.push(batch);
    }
    return concatenateArrayBuffers(...chunks);
  }
  if (!isBrowser$2 && writer.encodeURLtoURL) {
    const tmpInputFilename = getTemporaryFilename('input');
    await writeFile(tmpInputFilename, data);
    const tmpOutputFilename = getTemporaryFilename('output');
    const outputFilename = await encodeURLtoURL(tmpInputFilename, tmpOutputFilename, writer, options);
    const response = await fetchFile(outputFilename);
    return response.arrayBuffer();
  }
  throw new Error('Writer could not encode data');
}
function encodeInBatches(data, writer, options) {
  if (writer.encodeInBatches) {
    const dataIterator = getIterator(data);
    return writer.encodeInBatches(dataIterator, options);
  }
  throw new Error('Writer could not encode data in batches');
}
async function encodeURLtoURL(inputUrl, outputUrl, writer, options) {
  inputUrl = resolvePath(inputUrl);
  outputUrl = resolvePath(outputUrl);
  if (isBrowser$2 || !writer.encodeURLtoURL) {
    throw new Error();
  }
  const outputFilename = await writer.encodeURLtoURL(inputUrl, outputUrl, options);
  return outputFilename;
}
function getIterator(data) {
  const dataIterator = [{
    table: data,
    start: 0,
    end: data.length
  }];
  return dataIterator;
}
function getTemporaryFilename(filename) {
  return "/tmp/".concat(filename);
}

const VERSION$4 = "3.4.14" ;

const VERSION$3 = "3.4.14" ;
const BASIS_CDN_ENCODER_WASM = "https://unpkg.com/@loaders.gl/textures@".concat(VERSION$3, "/dist/libs/basis_encoder.wasm");
const BASIS_CDN_ENCODER_JS = "https://unpkg.com/@loaders.gl/textures@".concat(VERSION$3, "/dist/libs/basis_encoder.js");
let loadBasisTranscoderPromise;
async function loadBasisTrascoderModule(options) {
  const modules = options.modules || {};
  if (modules.basis) {
    return modules.basis;
  }
  loadBasisTranscoderPromise = loadBasisTranscoderPromise || loadBasisTrascoder(options);
  return await loadBasisTranscoderPromise;
}
async function loadBasisTrascoder(options) {
  let BASIS = null;
  let wasmBinary = null;
  [BASIS, wasmBinary] = await Promise.all([await loadLibrary('basis_transcoder.js', 'textures', options), await loadLibrary('basis_transcoder.wasm', 'textures', options)]);
  BASIS = BASIS || globalThis.BASIS;
  return await initializeBasisTrascoderModule(BASIS, wasmBinary);
}
function initializeBasisTrascoderModule(BasisModule, wasmBinary) {
  const options = {};
  if (wasmBinary) {
    options.wasmBinary = wasmBinary;
  }
  return new Promise(resolve => {
    BasisModule(options).then(module => {
      const {
        BasisFile,
        initializeBasis
      } = module;
      initializeBasis();
      resolve({
        BasisFile
      });
    });
  });
}
let loadBasisEncoderPromise;
async function loadBasisEncoderModule(options) {
  const modules = options.modules || {};
  if (modules.basisEncoder) {
    return modules.basisEncoder;
  }
  loadBasisEncoderPromise = loadBasisEncoderPromise || loadBasisEncoder(options);
  return await loadBasisEncoderPromise;
}
async function loadBasisEncoder(options) {
  let BASIS_ENCODER = null;
  let wasmBinary = null;
  [BASIS_ENCODER, wasmBinary] = await Promise.all([await loadLibrary(BASIS_CDN_ENCODER_JS, 'textures', options), await loadLibrary(BASIS_CDN_ENCODER_WASM, 'textures', options)]);
  BASIS_ENCODER = BASIS_ENCODER || globalThis.BASIS;
  return await initializeBasisEncoderModule(BASIS_ENCODER, wasmBinary);
}
function initializeBasisEncoderModule(BasisEncoderModule, wasmBinary) {
  const options = {};
  if (wasmBinary) {
    options.wasmBinary = wasmBinary;
  }
  return new Promise(resolve => {
    BasisEncoderModule(options).then(module => {
      const {
        BasisFile,
        KTX2File,
        initializeBasis,
        BasisEncoder
      } = module;
      initializeBasis();
      resolve({
        BasisFile,
        KTX2File,
        BasisEncoder
      });
    });
  });
}

const GL_EXTENSIONS_CONSTANTS = {
  COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83f0,
  COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83f1,
  COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83f2,
  COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83f3,
  COMPRESSED_R11_EAC: 0x9270,
  COMPRESSED_SIGNED_R11_EAC: 0x9271,
  COMPRESSED_RG11_EAC: 0x9272,
  COMPRESSED_SIGNED_RG11_EAC: 0x9273,
  COMPRESSED_RGB8_ETC2: 0x9274,
  COMPRESSED_RGBA8_ETC2_EAC: 0x9275,
  COMPRESSED_SRGB8_ETC2: 0x9276,
  COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9277,
  COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9278,
  COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9279,
  COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8c00,
  COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8c02,
  COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8c01,
  COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8c03,
  COMPRESSED_RGB_ETC1_WEBGL: 0x8d64,
  COMPRESSED_RGB_ATC_WEBGL: 0x8c92,
  COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8c93,
  COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87ee,
  COMPRESSED_RGBA_ASTC_4X4_KHR: 0x93b0,
  COMPRESSED_RGBA_ASTC_5X4_KHR: 0x93b1,
  COMPRESSED_RGBA_ASTC_5X5_KHR: 0x93b2,
  COMPRESSED_RGBA_ASTC_6X5_KHR: 0x93b3,
  COMPRESSED_RGBA_ASTC_6X6_KHR: 0x93b4,
  COMPRESSED_RGBA_ASTC_8X5_KHR: 0x93b5,
  COMPRESSED_RGBA_ASTC_8X6_KHR: 0x93b6,
  COMPRESSED_RGBA_ASTC_8X8_KHR: 0x93b7,
  COMPRESSED_RGBA_ASTC_10X5_KHR: 0x93b8,
  COMPRESSED_RGBA_ASTC_10X6_KHR: 0x93b9,
  COMPRESSED_RGBA_ASTC_10X8_KHR: 0x93ba,
  COMPRESSED_RGBA_ASTC_10X10_KHR: 0x93bb,
  COMPRESSED_RGBA_ASTC_12X10_KHR: 0x93bc,
  COMPRESSED_RGBA_ASTC_12X12_KHR: 0x93bd,
  COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: 0x93d0,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: 0x93d1,
  COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: 0x93d2,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: 0x93d3,
  COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: 0x93d4,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: 0x93d5,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: 0x93d6,
  COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: 0x93d7,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: 0x93d8,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: 0x93d9,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: 0x93da,
  COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: 0x93db,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: 0x93dc,
  COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: 0x93dd,
  COMPRESSED_RED_RGTC1_EXT: 0x8dbb,
  COMPRESSED_SIGNED_RED_RGTC1_EXT: 0x8dbc,
  COMPRESSED_RED_GREEN_RGTC2_EXT: 0x8dbd,
  COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 0x8dbe,
  COMPRESSED_SRGB_S3TC_DXT1_EXT: 0x8c4c,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 0x8c4d,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 0x8c4e,
  COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 0x8c4f
};

const BROWSER_PREFIXES = ['', 'WEBKIT_', 'MOZ_'];
const WEBGL_EXTENSIONS = {
  WEBGL_compressed_texture_s3tc: 'dxt',
  WEBGL_compressed_texture_s3tc_srgb: 'dxt-srgb',
  WEBGL_compressed_texture_etc1: 'etc1',
  WEBGL_compressed_texture_etc: 'etc2',
  WEBGL_compressed_texture_pvrtc: 'pvrtc',
  WEBGL_compressed_texture_atc: 'atc',
  WEBGL_compressed_texture_astc: 'astc',
  EXT_texture_compression_rgtc: 'rgtc'
};
let formats = null;
function getSupportedGPUTextureFormats(gl) {
  if (!formats) {
    gl = gl || getWebGLContext() || undefined;
    formats = new Set();
    for (const prefix of BROWSER_PREFIXES) {
      for (const extension in WEBGL_EXTENSIONS) {
        if (gl && gl.getExtension("".concat(prefix).concat(extension))) {
          const gpuTextureFormat = WEBGL_EXTENSIONS[extension];
          formats.add(gpuTextureFormat);
        }
      }
    }
  }
  return formats;
}
function getWebGLContext() {
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl');
  } catch (error) {
    return null;
  }
}

var n,i,s,a,r,o,l,f;!function(t){t[t.NONE=0]="NONE",t[t.BASISLZ=1]="BASISLZ",t[t.ZSTD=2]="ZSTD",t[t.ZLIB=3]="ZLIB";}(n||(n={})),function(t){t[t.BASICFORMAT=0]="BASICFORMAT";}(i||(i={})),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.ETC1S=163]="ETC1S",t[t.UASTC=166]="UASTC";}(s||(s={})),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.SRGB=1]="SRGB";}(a||(a={})),function(t){t[t.UNSPECIFIED=0]="UNSPECIFIED",t[t.LINEAR=1]="LINEAR",t[t.SRGB=2]="SRGB",t[t.ITU=3]="ITU",t[t.NTSC=4]="NTSC",t[t.SLOG=5]="SLOG",t[t.SLOG2=6]="SLOG2";}(r||(r={})),function(t){t[t.ALPHA_STRAIGHT=0]="ALPHA_STRAIGHT",t[t.ALPHA_PREMULTIPLIED=1]="ALPHA_PREMULTIPLIED";}(o||(o={})),function(t){t[t.RGB=0]="RGB",t[t.RRR=3]="RRR",t[t.GGG=4]="GGG",t[t.AAA=15]="AAA";}(l||(l={})),function(t){t[t.RGB=0]="RGB",t[t.RGBA=3]="RGBA",t[t.RRR=4]="RRR",t[t.RRRG=5]="RRRG";}(f||(f={}));

const KTX2_ID = [0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a];
function isKTX(data) {
  const id = new Uint8Array(data);
  const notKTX = id.byteLength < KTX2_ID.length || id[0] !== KTX2_ID[0] || id[1] !== KTX2_ID[1] || id[2] !== KTX2_ID[2] || id[3] !== KTX2_ID[3] || id[4] !== KTX2_ID[4] || id[5] !== KTX2_ID[5] || id[6] !== KTX2_ID[6] || id[7] !== KTX2_ID[7] || id[8] !== KTX2_ID[8] || id[9] !== KTX2_ID[9] || id[10] !== KTX2_ID[10] || id[11] !== KTX2_ID[11];
  return !notKTX;
}

const OutputFormat = {
  etc1: {
    basisFormat: 0,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_ETC1_WEBGL
  },
  etc2: {
    basisFormat: 1,
    compressed: true
  },
  bc1: {
    basisFormat: 2,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT
  },
  bc3: {
    basisFormat: 3,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT
  },
  bc4: {
    basisFormat: 4,
    compressed: true
  },
  bc5: {
    basisFormat: 5,
    compressed: true
  },
  'bc7-m6-opaque-only': {
    basisFormat: 6,
    compressed: true
  },
  'bc7-m5': {
    basisFormat: 7,
    compressed: true
  },
  'pvrtc1-4-rgb': {
    basisFormat: 8,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
  },
  'pvrtc1-4-rgba': {
    basisFormat: 9,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
  },
  'astc-4x4': {
    basisFormat: 10,
    compressed: true,
    format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4X4_KHR
  },
  'atc-rgb': {
    basisFormat: 11,
    compressed: true
  },
  'atc-rgba-interpolated-alpha': {
    basisFormat: 12,
    compressed: true
  },
  rgba32: {
    basisFormat: 13,
    compressed: false
  },
  rgb565: {
    basisFormat: 14,
    compressed: false
  },
  bgr565: {
    basisFormat: 15,
    compressed: false
  },
  rgba4444: {
    basisFormat: 16,
    compressed: false
  }
};
async function parseBasis(data, options) {
  if (options.basis.containerFormat === 'auto') {
    if (isKTX(data)) {
      const fileConstructors = await loadBasisEncoderModule(options);
      return parseKTX2File(fileConstructors.KTX2File, data, options);
    }
    const {
      BasisFile
    } = await loadBasisTrascoderModule(options);
    return parseBasisFile(BasisFile, data, options);
  }
  switch (options.basis.module) {
    case 'encoder':
      const fileConstructors = await loadBasisEncoderModule(options);
      switch (options.basis.containerFormat) {
        case 'ktx2':
          return parseKTX2File(fileConstructors.KTX2File, data, options);
        case 'basis':
        default:
          return parseBasisFile(fileConstructors.BasisFile, data, options);
      }
    case 'transcoder':
    default:
      const {
        BasisFile
      } = await loadBasisTrascoderModule(options);
      return parseBasisFile(BasisFile, data, options);
  }
}
function parseBasisFile(BasisFile, data, options) {
  const basisFile = new BasisFile(new Uint8Array(data));
  try {
    if (!basisFile.startTranscoding()) {
      throw new Error('Failed to start basis transcoding');
    }
    const imageCount = basisFile.getNumImages();
    const images = [];
    for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
      const levelsCount = basisFile.getNumLevels(imageIndex);
      const levels = [];
      for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
        levels.push(transcodeImage(basisFile, imageIndex, levelIndex, options));
      }
      images.push(levels);
    }
    return images;
  } finally {
    basisFile.close();
    basisFile.delete();
  }
}
function transcodeImage(basisFile, imageIndex, levelIndex, options) {
  const width = basisFile.getImageWidth(imageIndex, levelIndex);
  const height = basisFile.getImageHeight(imageIndex, levelIndex);
  const hasAlpha = basisFile.getHasAlpha();
  const {
    compressed,
    format,
    basisFormat
  } = getBasisOptions(options, hasAlpha);
  const decodedSize = basisFile.getImageTranscodedSizeInBytes(imageIndex, levelIndex, basisFormat);
  const decodedData = new Uint8Array(decodedSize);
  if (!basisFile.transcodeImage(decodedData, imageIndex, levelIndex, basisFormat, 0, 0)) {
    throw new Error('failed to start Basis transcoding');
  }
  return {
    width,
    height,
    data: decodedData,
    compressed,
    format,
    hasAlpha
  };
}
function parseKTX2File(KTX2File, data, options) {
  const ktx2File = new KTX2File(new Uint8Array(data));
  try {
    if (!ktx2File.startTranscoding()) {
      throw new Error('failed to start KTX2 transcoding');
    }
    const levelsCount = ktx2File.getLevels();
    const levels = [];
    for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
      levels.push(transcodeKTX2Image(ktx2File, levelIndex, options));
      break;
    }
    return [levels];
  } finally {
    ktx2File.close();
    ktx2File.delete();
  }
}
function transcodeKTX2Image(ktx2File, levelIndex, options) {
  const {
    alphaFlag,
    height,
    width
  } = ktx2File.getImageLevelInfo(levelIndex, 0, 0);
  const {
    compressed,
    format,
    basisFormat
  } = getBasisOptions(options, alphaFlag);
  const decodedSize = ktx2File.getImageTranscodedSizeInBytes(levelIndex, 0, 0, basisFormat);
  const decodedData = new Uint8Array(decodedSize);
  if (!ktx2File.transcodeImage(decodedData, levelIndex, 0, 0, basisFormat, 0, -1, -1)) {
    throw new Error('Failed to transcode KTX2 image');
  }
  return {
    width,
    height,
    data: decodedData,
    compressed,
    levelSize: decodedSize,
    hasAlpha: alphaFlag,
    format
  };
}
function getBasisOptions(options, hasAlpha) {
  let format = options && options.basis && options.basis.format;
  if (format === 'auto') {
    format = selectSupportedBasisFormat();
  }
  if (typeof format === 'object') {
    format = hasAlpha ? format.alpha : format.noAlpha;
  }
  format = format.toLowerCase();
  return OutputFormat[format];
}
function selectSupportedBasisFormat() {
  const supportedFormats = getSupportedGPUTextureFormats();
  if (supportedFormats.has('astc')) {
    return 'astc-4x4';
  } else if (supportedFormats.has('dxt')) {
    return {
      alpha: 'bc3',
      noAlpha: 'bc1'
    };
  } else if (supportedFormats.has('pvrtc')) {
    return {
      alpha: 'pvrtc1-4-rgba',
      noAlpha: 'pvrtc1-4-rgb'
    };
  } else if (supportedFormats.has('etc1')) {
    return 'etc1';
  } else if (supportedFormats.has('etc2')) {
    return 'etc2';
  }
  return 'rgb565';
}

const BasisWorkerLoader = {
  name: 'Basis',
  id: isBrowser$1 ? 'basis' : 'basis-nodejs',
  module: 'textures',
  version: VERSION$4,
  worker: true,
  extensions: ['basis', 'ktx2'],
  mimeTypes: ['application/octet-stream', 'image/ktx2'],
  tests: ['sB'],
  binary: true,
  options: {
    basis: {
      format: 'auto',
      libraryPath: 'libs/',
      containerFormat: 'auto',
      module: 'transcoder'
    }
  }
};
const BasisLoader = {
  ...BasisWorkerLoader,
  parse: parseBasis
};

async function encodeKTX2BasisTexture(image) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    useSRGB = false,
    qualityLevel = 10,
    encodeUASTC = false,
    mipmaps = false
  } = options;
  const {
    BasisEncoder
  } = await loadBasisEncoderModule(options);
  const basisEncoder = new BasisEncoder();
  try {
    const basisFileData = new Uint8Array(image.width * image.height * 4);
    basisEncoder.setCreateKTX2File(true);
    basisEncoder.setKTX2UASTCSupercompression(true);
    basisEncoder.setKTX2SRGBTransferFunc(true);
    basisEncoder.setSliceSourceImage(0, image.data, image.width, image.height, false);
    basisEncoder.setPerceptual(useSRGB);
    basisEncoder.setMipSRGB(useSRGB);
    basisEncoder.setQualityLevel(qualityLevel);
    basisEncoder.setUASTC(encodeUASTC);
    basisEncoder.setMipGen(mipmaps);
    const numOutputBytes = basisEncoder.encode(basisFileData);
    const actualKTX2FileData = basisFileData.subarray(0, numOutputBytes).buffer;
    return actualKTX2FileData;
  } catch (error) {
    console.error('Basis Universal Supercompressed GPU Texture encoder Error: ', error);
    throw error;
  } finally {
    basisEncoder.delete();
  }
}

const KTX2BasisWriter = {
  name: 'Basis Universal Supercompressed GPU Texture',
  id: 'ktx2-basis-writer',
  module: 'textures',
  version: VERSION$4,
  extensions: ['ktx2'],
  options: {
    useSRGB: false,
    qualityLevel: 10,
    encodeUASTC: false,
    mipmaps: false
  },
  encode: encodeKTX2BasisTexture
};

const VERSION$2 = "3.4.14" ;

const {
  _parseImageNode
} = globalThis;
const IMAGE_SUPPORTED = typeof Image !== 'undefined';
const IMAGE_BITMAP_SUPPORTED = typeof ImageBitmap !== 'undefined';
const NODE_IMAGE_SUPPORTED = Boolean(_parseImageNode);
const DATA_SUPPORTED = isBrowser$2 ? true : NODE_IMAGE_SUPPORTED;
function isImageTypeSupported(type) {
  switch (type) {
    case 'auto':
      return IMAGE_BITMAP_SUPPORTED || IMAGE_SUPPORTED || DATA_SUPPORTED;
    case 'imagebitmap':
      return IMAGE_BITMAP_SUPPORTED;
    case 'image':
      return IMAGE_SUPPORTED;
    case 'data':
      return DATA_SUPPORTED;
    default:
      throw new Error("@loaders.gl/images: image ".concat(type, " not supported in this environment"));
  }
}
function getDefaultImageType() {
  if (IMAGE_BITMAP_SUPPORTED) {
    return 'imagebitmap';
  }
  if (IMAGE_SUPPORTED) {
    return 'image';
  }
  if (DATA_SUPPORTED) {
    return 'data';
  }
  throw new Error('Install \'@loaders.gl/polyfills\' to parse images under Node.js');
}

function getImageType(image) {
  const format = getImageTypeOrNull(image);
  if (!format) {
    throw new Error('Not an image');
  }
  return format;
}
function getImageData(image) {
  switch (getImageType(image)) {
    case 'data':
      return image;
    case 'image':
    case 'imagebitmap':
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('getImageData');
      }
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    default:
      throw new Error('getImageData');
  }
}
function getImageTypeOrNull(image) {
  if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) {
    return 'imagebitmap';
  }
  if (typeof Image !== 'undefined' && image instanceof Image) {
    return 'image';
  }
  if (image && typeof image === 'object' && image.data && image.width && image.height) {
    return 'data';
  }
  return null;
}

const SVG_DATA_URL_PATTERN = /^data:image\/svg\+xml/;
const SVG_URL_PATTERN = /\.svg((\?|#).*)?$/;
function isSVG(url) {
  return url && (SVG_DATA_URL_PATTERN.test(url) || SVG_URL_PATTERN.test(url));
}
function getBlobOrSVGDataUrl(arrayBuffer, url) {
  if (isSVG(url)) {
    const textDecoder = new TextDecoder();
    let xmlText = textDecoder.decode(arrayBuffer);
    try {
      if (typeof unescape === 'function' && typeof encodeURIComponent === 'function') {
        xmlText = unescape(encodeURIComponent(xmlText));
      }
    } catch (error) {
      throw new Error(error.message);
    }
    const src = "data:image/svg+xml;base64,".concat(btoa(xmlText));
    return src;
  }
  return getBlob(arrayBuffer, url);
}
function getBlob(arrayBuffer, url) {
  if (isSVG(url)) {
    throw new Error('SVG cannot be parsed directly to imagebitmap');
  }
  return new Blob([new Uint8Array(arrayBuffer)]);
}

async function parseToImage(arrayBuffer, options, url) {
  const blobOrDataUrl = getBlobOrSVGDataUrl(arrayBuffer, url);
  const URL = self.URL || self.webkitURL;
  const objectUrl = typeof blobOrDataUrl !== 'string' && URL.createObjectURL(blobOrDataUrl);
  try {
    return await loadToImage(objectUrl || blobOrDataUrl, options);
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
async function loadToImage(url, options) {
  const image = new Image();
  image.src = url;
  if (options.image && options.image.decode && image.decode) {
    await image.decode();
    return image;
  }
  return await new Promise((resolve, reject) => {
    try {
      image.onload = () => resolve(image);
      image.onerror = err => reject(new Error("Could not load image ".concat(url, ": ").concat(err)));
    } catch (error) {
      reject(error);
    }
  });
}

const EMPTY_OBJECT = {};
let imagebitmapOptionsSupported = true;
async function parseToImageBitmap(arrayBuffer, options, url) {
  let blob;
  if (isSVG(url)) {
    const image = await parseToImage(arrayBuffer, options, url);
    blob = image;
  } else {
    blob = getBlob(arrayBuffer, url);
  }
  const imagebitmapOptions = options && options.imagebitmap;
  return await safeCreateImageBitmap(blob, imagebitmapOptions);
}
async function safeCreateImageBitmap(blob) {
  let imagebitmapOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
    imagebitmapOptions = null;
  }
  if (imagebitmapOptions) {
    try {
      return await createImageBitmap(blob, imagebitmapOptions);
    } catch (error) {
      console.warn(error);
      imagebitmapOptionsSupported = false;
    }
  }
  return await createImageBitmap(blob);
}
function isEmptyObject(object) {
  for (const key in object || EMPTY_OBJECT) {
    return false;
  }
  return true;
}

function getISOBMFFMediaType(buffer) {
  if (!checkString(buffer, 'ftyp', 4)) {
    return null;
  }
  if ((buffer[8] & 0x60) === 0x00) {
    return null;
  }
  return decodeMajorBrand(buffer);
}
function decodeMajorBrand(buffer) {
  const brandMajor = getUTF8String(buffer, 8, 12).replace('\0', ' ').trim();
  switch (brandMajor) {
    case 'avif':
    case 'avis':
      return {
        extension: 'avif',
        mimeType: 'image/avif'
      };
    default:
      return null;
  }
}
function getUTF8String(array, start, end) {
  return String.fromCharCode(...array.slice(start, end));
}
function stringToBytes(string) {
  return [...string].map(character => character.charCodeAt(0));
}
function checkString(buffer, header) {
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const headerBytes = stringToBytes(header);
  for (let i = 0; i < headerBytes.length; ++i) {
    if (headerBytes[i] !== buffer[i + offset]) {
      return false;
    }
  }
  return true;
}

const BIG_ENDIAN = false;
const LITTLE_ENDIAN = true;
function getBinaryImageMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  return getPngMetadata(dataView) || getJpegMetadata(dataView) || getGifMetadata(dataView) || getBmpMetadata(dataView) || getISOBMFFMetadata(dataView);
}
function getISOBMFFMetadata(binaryData) {
  const buffer = new Uint8Array(binaryData instanceof DataView ? binaryData.buffer : binaryData);
  const mediaType = getISOBMFFMediaType(buffer);
  if (!mediaType) {
    return null;
  }
  return {
    mimeType: mediaType.mimeType,
    width: 0,
    height: 0
  };
}
function getPngMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isPng = dataView.byteLength >= 24 && dataView.getUint32(0, BIG_ENDIAN) === 0x89504e47;
  if (!isPng) {
    return null;
  }
  return {
    mimeType: 'image/png',
    width: dataView.getUint32(16, BIG_ENDIAN),
    height: dataView.getUint32(20, BIG_ENDIAN)
  };
}
function getGifMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isGif = dataView.byteLength >= 10 && dataView.getUint32(0, BIG_ENDIAN) === 0x47494638;
  if (!isGif) {
    return null;
  }
  return {
    mimeType: 'image/gif',
    width: dataView.getUint16(6, LITTLE_ENDIAN),
    height: dataView.getUint16(8, LITTLE_ENDIAN)
  };
}
function getBmpMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isBmp = dataView.byteLength >= 14 && dataView.getUint16(0, BIG_ENDIAN) === 0x424d && dataView.getUint32(2, LITTLE_ENDIAN) === dataView.byteLength;
  if (!isBmp) {
    return null;
  }
  return {
    mimeType: 'image/bmp',
    width: dataView.getUint32(18, LITTLE_ENDIAN),
    height: dataView.getUint32(22, LITTLE_ENDIAN)
  };
}
function getJpegMetadata(binaryData) {
  const dataView = toDataView(binaryData);
  const isJpeg = dataView.byteLength >= 3 && dataView.getUint16(0, BIG_ENDIAN) === 0xffd8 && dataView.getUint8(2) === 0xff;
  if (!isJpeg) {
    return null;
  }
  const {
    tableMarkers,
    sofMarkers
  } = getJpegMarkers();
  let i = 2;
  while (i + 9 < dataView.byteLength) {
    const marker = dataView.getUint16(i, BIG_ENDIAN);
    if (sofMarkers.has(marker)) {
      return {
        mimeType: 'image/jpeg',
        height: dataView.getUint16(i + 5, BIG_ENDIAN),
        width: dataView.getUint16(i + 7, BIG_ENDIAN)
      };
    }
    if (!tableMarkers.has(marker)) {
      return null;
    }
    i += 2;
    i += dataView.getUint16(i, BIG_ENDIAN);
  }
  return null;
}
function getJpegMarkers() {
  const tableMarkers = new Set([0xffdb, 0xffc4, 0xffcc, 0xffdd, 0xfffe]);
  for (let i = 0xffe0; i < 0xfff0; ++i) {
    tableMarkers.add(i);
  }
  const sofMarkers = new Set([0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc9, 0xffca, 0xffcb, 0xffcd, 0xffce, 0xffcf, 0xffde]);
  return {
    tableMarkers,
    sofMarkers
  };
}
function toDataView(data) {
  if (data instanceof DataView) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    return new DataView(data.buffer);
  }
  if (data instanceof ArrayBuffer) {
    return new DataView(data);
  }
  throw new Error('toDataView');
}

async function parseToNodeImage(arrayBuffer, options) {
  const {
    mimeType
  } = getBinaryImageMetadata(arrayBuffer) || {};
  const _parseImageNode = globalThis._parseImageNode;
  assert$5(_parseImageNode);
  return await _parseImageNode(arrayBuffer, mimeType);
}

async function parseImage(arrayBuffer, options, context) {
  options = options || {};
  const imageOptions = options.image || {};
  const imageType = imageOptions.type || 'auto';
  const {
    url
  } = context || {};
  const loadType = getLoadableImageType(imageType);
  let image;
  switch (loadType) {
    case 'imagebitmap':
      image = await parseToImageBitmap(arrayBuffer, options, url);
      break;
    case 'image':
      image = await parseToImage(arrayBuffer, options, url);
      break;
    case 'data':
      image = await parseToNodeImage(arrayBuffer);
      break;
    default:
      assert$5(false);
  }
  if (imageType === 'data') {
    image = getImageData(image);
  }
  return image;
}
function getLoadableImageType(type) {
  switch (type) {
    case 'auto':
    case 'data':
      return getDefaultImageType();
    default:
      isImageTypeSupported(type);
      return type;
  }
}

const EXTENSIONS$1 = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif'];
const MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif', 'image/bmp', 'image/vnd.microsoft.icon', 'image/svg+xml'];
const DEFAULT_IMAGE_LOADER_OPTIONS = {
  image: {
    type: 'auto',
    decode: true
  }
};
const ImageLoader = {
  id: 'image',
  module: 'images',
  name: 'Images',
  version: VERSION$2,
  mimeTypes: MIME_TYPES,
  extensions: EXTENSIONS$1,
  parse: parseImage,
  tests: [arrayBuffer => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer)))],
  options: DEFAULT_IMAGE_LOADER_OPTIONS
};

const mimeTypeSupportedSync = {};
function isImageFormatSupported(mimeType) {
  if (mimeTypeSupportedSync[mimeType] === undefined) {
    const supported = isBrowser$2 ? checkBrowserImageFormatSupport(mimeType) : checkNodeImageFormatSupport(mimeType);
    mimeTypeSupportedSync[mimeType] = supported;
  }
  return mimeTypeSupportedSync[mimeType];
}
function checkNodeImageFormatSupport(mimeType) {
  const NODE_FORMAT_SUPPORT = ['image/png', 'image/jpeg', 'image/gif'];
  const {
    _parseImageNode,
    _imageFormatsNode = NODE_FORMAT_SUPPORT
  } = globalThis;
  return Boolean(_parseImageNode) && _imageFormatsNode.includes(mimeType);
}
function checkBrowserImageFormatSupport(mimeType) {
  switch (mimeType) {
    case 'image/avif':
    case 'image/webp':
      return testBrowserImageFormatSupport(mimeType);
    default:
      return true;
  }
}
function testBrowserImageFormatSupport(mimeType) {
  try {
    const element = document.createElement('canvas');
    const dataURL = element.toDataURL(mimeType);
    return dataURL.indexOf("data:".concat(mimeType)) === 0;
  } catch {
    return false;
  }
}

const tempVec4a = math.vec4([0, 0, 0, 1]);
const tempVec4b = math.vec4([0, 0, 0, 1]);

const tempMat4 = math.mat4();
const tempMat4b = math.mat4();

const kdTreeDimLength = new Float64Array(3);

// XKT texture types

const COLOR_TEXTURE = 0;
const METALLIC_ROUGHNESS_TEXTURE = 1;
const NORMALS_TEXTURE = 2;
const EMISSIVE_TEXTURE = 3;
const OCCLUSION_TEXTURE = 4;

// KTX2 encoding options for each texture type

const TEXTURE_ENCODING_OPTIONS = {};
TEXTURE_ENCODING_OPTIONS[COLOR_TEXTURE] = {
    useSRGB: true,
    qualityLevel: 50,
    encodeUASTC: true,
    mipmaps: true
};
TEXTURE_ENCODING_OPTIONS[EMISSIVE_TEXTURE] = {
    useSRGB: true,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};
TEXTURE_ENCODING_OPTIONS[METALLIC_ROUGHNESS_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 50,
    mipmaps: true // Needed for GGX roughness shading
};
TEXTURE_ENCODING_OPTIONS[NORMALS_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};
TEXTURE_ENCODING_OPTIONS[OCCLUSION_TEXTURE] = {
    useSRGB: false,
    encodeUASTC: true,
    qualityLevel: 10,
    mipmaps: false
};

/**
 * A document model that represents the contents of an .XKT file.
 *
 * * An XKTModel contains {@link XKTTile}s, which spatially subdivide the model into axis-aligned, box-shaped regions.
 * * Each {@link XKTTile} contains {@link XKTEntity}s, which represent the objects within its region.
 * * Each {@link XKTEntity} has {@link XKTMesh}s, which each have a {@link XKTGeometry}. Each {@link XKTGeometry} can be shared by multiple {@link XKTMesh}s.
 * * Import models into an XKTModel using {@link parseGLTFJSONIntoXKTModel}, {@link parseIFCIntoXKTModel}, {@link parseCityJSONIntoXKTModel} etc.
 * * Build an XKTModel programmatically using {@link XKTModel#createGeometry}, {@link XKTModel#createMesh} and {@link XKTModel#createEntity}.
 * * Serialize an XKTModel to an ArrayBuffer using {@link writeXKTModelToArrayBuffer}.
 *
 * ## Usage
 *
 * See [main docs page](/docs/#javascript-api) for usage examples.
 *
 * @class XKTModel
 */
class XKTModel {

    /**
     * Constructs a new XKTModel.
     *
     * @param {*} [cfg] Configuration
     * @param {Number} [cfg.edgeThreshold=10]
     * @param {Number} [cfg.minTileSize=500]
     */
    constructor(cfg = {}) {

        /**
         * The model's ID, if available.
         *
         * Will be "default" by default.
         *
         * @type {String}
         */
        this.modelId = cfg.modelId || "default";

        /**
         * The project ID, if available.
         *
         * Will be an empty string by default.
         *
         * @type {String}
         */
        this.projectId = cfg.projectId || "";

        /**
         * The revision ID, if available.
         *
         * Will be an empty string by default.
         *
         * @type {String}
         */
        this.revisionId = cfg.revisionId || "";

        /**
         * The model author, if available.
         *
         * Will be an empty string by default.
         *
         * @property author
         * @type {String}
         */
        this.author = cfg.author || "";

        /**
         * The date the model was created, if available.
         *
         * Will be an empty string by default.
         *
         * @property createdAt
         * @type {String}
         */
        this.createdAt = cfg.createdAt || "";

        /**
         * The application that created the model, if available.
         *
         * Will be an empty string by default.
         *
         * @property creatingApplication
         * @type {String}
         */
        this.creatingApplication = cfg.creatingApplication || "";

        /**
         * The model schema version, if available.
         *
         * In the case of IFC, this could be "IFC2x3" or "IFC4", for example.
         *
         * Will be an empty string by default.
         *
         * @property schema
         * @type {String}
         */
        this.schema = cfg.schema || "";

        /**
         * The XKT format version.
         *
         * @property xktVersion;
         * @type {number}
         */
        this.xktVersion = XKT_INFO.xktVersion;

        /**
         *
         * @type {Number|number}
         */
        this.edgeThreshold = cfg.edgeThreshold || 10;

        /**
         * Minimum diagonal size of the boundary of an {@link XKTTile}.
         *
         * @type {Number|number}
         */
        this.minTileSize = cfg.minTileSize || 500;

        /**
         * Optional overall AABB that contains all the {@link XKTEntity}s we'll create in this model, if previously known.
         *
         * This is the AABB of a complete set of input files that are provided as a split-model set for conversion.
         *
         * This is used to help the {@link XKTTile.aabb}s within split models align neatly with each other, as we
         * build them with a k-d tree in {@link XKTModel#finalize}.  Without this, the AABBs of the different parts
         * tend to misalign slightly, resulting in excess number of {@link XKTTile}s, which degrades memory and rendering
         * performance when the XKT is viewer in the xeokit Viewer.
         */
        this.modelAABB = cfg.modelAABB;

        /**
         * Map of {@link XKTPropertySet}s within this XKTModel, each mapped to {@link XKTPropertySet#propertySetId}.
         *
         * Created by {@link XKTModel#createPropertySet}.
         *
         * @type {{String:XKTPropertySet}}
         */
        this.propertySets = {};

        /**
         * {@link XKTPropertySet}s within this XKTModel.
         *
         * Each XKTPropertySet holds its position in this list in {@link XKTPropertySet#propertySetIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTPropertySet[]}
         */
        this.propertySetsList = [];

        /**
         * Map of {@link XKTMetaObject}s within this XKTModel, each mapped to {@link XKTMetaObject#metaObjectId}.
         *
         * Created by {@link XKTModel#createMetaObject}.
         *
         * @type {{String:XKTMetaObject}}
         */
        this.metaObjects = {};

        /**
         * {@link XKTMetaObject}s within this XKTModel.
         *
         * Each XKTMetaObject holds its position in this list in {@link XKTMetaObject#metaObjectIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTMetaObject[]}
         */
        this.metaObjectsList = [];

        /**
         * The positions of all shared {@link XKTGeometry}s are de-quantized using this singular
         * de-quantization matrix.
         *
         * This de-quantization matrix is generated from the collective Local-space boundary of the
         * positions of all shared {@link XKTGeometry}s.
         *
         * @type {Float32Array}
         */
        this.reusedGeometriesDecodeMatrix = new Float32Array(16);

        /**
         * Map of {@link XKTGeometry}s within this XKTModel, each mapped to {@link XKTGeometry#geometryId}.
         *
         * Created by {@link XKTModel#createGeometry}.
         *
         * @type {{Number:XKTGeometry}}
         */
        this.geometries = {};

        /**
         * List of {@link XKTGeometry}s within this XKTModel, in the order they were created.
         *
         * Each XKTGeometry holds its position in this list in {@link XKTGeometry#geometryIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTGeometry[]}
         */
        this.geometriesList = [];

        /**
         * Map of {@link XKTTexture}s within this XKTModel, each mapped to {@link XKTTexture#textureId}.
         *
         * Created by {@link XKTModel#createTexture}.
         *
         * @type {{Number:XKTTexture}}
         */
        this.textures = {};

        /**
         * List of {@link XKTTexture}s within this XKTModel, in the order they were created.
         *
         * Each XKTTexture holds its position in this list in {@link XKTTexture#textureIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTexture[]}
         */
        this.texturesList = [];

        /**
         * Map of {@link XKTTextureSet}s within this XKTModel, each mapped to {@link XKTTextureSet#textureSetId}.
         *
         * Created by {@link XKTModel#createTextureSet}.
         *
         * @type {{Number:XKTTextureSet}}
         */
        this.textureSets = {};

        /**
         * List of {@link XKTTextureSet}s within this XKTModel, in the order they were created.
         *
         * Each XKTTextureSet holds its position in this list in {@link XKTTextureSet#textureSetIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTextureSet[]}
         */
        this.textureSetsList = [];

        /**
         * Map of {@link XKTMesh}s within this XKTModel, each mapped to {@link XKTMesh#meshId}.
         *
         * Created by {@link XKTModel#createMesh}.
         *
         * @type {{Number:XKTMesh}}
         */
        this.meshes = {};

        /**
         * List of {@link XKTMesh}s within this XKTModel, in the order they were created.
         *
         * Each XKTMesh holds its position in this list in {@link XKTMesh#meshIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTMesh[]}
         */
        this.meshesList = [];

        /**
         * Map of {@link XKTEntity}s within this XKTModel, each mapped to {@link XKTEntity#entityId}.
         *
         * Created by {@link XKTModel#createEntity}.
         *
         * @type {{String:XKTEntity}}
         */
        this.entities = {};

        /**
         * {@link XKTEntity}s within this XKTModel.
         *
         * Each XKTEntity holds its position in this list in {@link XKTEntity#entityIndex}.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTEntity[]}
         */
        this.entitiesList = [];

        /**
         * {@link XKTTile}s within this XKTModel.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {XKTTile[]}
         */
        this.tilesList = [];

        /**
         * The axis-aligned 3D World-space boundary of this XKTModel.
         *
         * Created by {@link XKTModel#finalize}.
         *
         * @type {Float64Array}
         */
        this.aabb = math.AABB3();

        /**
         * Indicates if this XKTModel has been finalized.
         *
         * Set ````true```` by {@link XKTModel#finalize}.
         *
         * @type {boolean}
         */
        this.finalized = false;
    }

    /**
     * Creates an {@link XKTPropertySet} within this XKTModel.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.propertySetId Unique ID for the {@link XKTPropertySet}.
     * @param {String} [params.propertySetType="default"] A meta type for the {@link XKTPropertySet}.
     * @param {String} [params.propertySetName] Human-readable name for the {@link XKTPropertySet}. Defaults to the ````propertySetId```` parameter.
     * @param {String[]} params.properties Properties for the {@link XKTPropertySet}.
     * @returns {XKTPropertySet} The new {@link XKTPropertySet}.
     */
    createPropertySet(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.propertySetId === null || params.propertySetId === undefined) {
            throw "Parameter expected: params.propertySetId";
        }

        if (params.properties === null || params.properties === undefined) {
            throw "Parameter expected: params.properties";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more property sets");
            return;
        }

        if (this.propertySets[params.propertySetId]) {
            //          console.error("XKTPropertySet already exists with this ID: " + params.propertySetId);
            return;
        }

        const propertySetId = params.propertySetId;
        const propertySetType = params.propertySetType || "Default";
        const propertySetName = params.propertySetName || params.propertySetId;
        const properties = params.properties || [];

        const propertySet = new XKTPropertySet(propertySetId, propertySetType, propertySetName, properties);

        this.propertySets[propertySetId] = propertySet;
        this.propertySetsList.push(propertySet);

        return propertySet;
    }

    /**
     * Creates an {@link XKTMetaObject} within this XKTModel.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.metaObjectId Unique ID for the {@link XKTMetaObject}.
     * @param {String} params.propertySetIds ID of one or more property sets that contains additional metadata about
     * this {@link XKTMetaObject}. The property sets could be stored externally (ie not managed at all by the XKT file),
     * or could be {@link XKTPropertySet}s within {@link XKTModel#propertySets}.
     * @param {String} [params.metaObjectType="default"] A meta type for the {@link XKTMetaObject}. Can be anything,
     * but is usually an IFC type, such as "IfcSite" or "IfcWall".
     * @param {String} [params.metaObjectName] Human-readable name for the {@link XKTMetaObject}. Defaults to the ````metaObjectId```` parameter.
     * @param {String} [params.parentMetaObjectId] ID of the parent {@link XKTMetaObject}, if any. Defaults to the ````metaObjectId```` parameter.
     * @returns {XKTMetaObject} The new {@link XKTMetaObject}.
     */
    createMetaObject(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.metaObjectId === null || params.metaObjectId === undefined) {
            throw "Parameter expected: params.metaObjectId";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more meta objects");
            return;
        }

        if (this.metaObjects[params.metaObjectId]) {
            //          console.error("XKTMetaObject already exists with this ID: " + params.metaObjectId);
            return;
        }

        const metaObjectId = params.metaObjectId;
        const propertySetIds = params.propertySetIds;
        const metaObjectType = params.metaObjectType || "Default";
        const metaObjectName = params.metaObjectName || params.metaObjectId;
        const parentMetaObjectId = params.parentMetaObjectId;

        const metaObject = new XKTMetaObject(metaObjectId, propertySetIds, metaObjectType, metaObjectName, parentMetaObjectId);

        this.metaObjects[metaObjectId] = metaObject;
        this.metaObjectsList.push(metaObject);

        if (!parentMetaObjectId) {
            if (!this._rootMetaObject) {
                this._rootMetaObject = metaObject;
            }
        }

        return metaObject;
    }

    /**
     * Creates an {@link XKTTexture} within this XKTModel.
     *
     * Registers the new {@link XKTTexture} in {@link XKTModel#textures} and {@link XKTModel#texturesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.textureId Unique ID for the {@link XKTTexture}.
     * @param {String} [params.src] Source of an image file for the texture.
     * @param {Buffer} [params.imageData] Image data for the texture.
     * @param {Number} [params.mediaType] Media type (ie. MIME type) of ````imageData````. Supported values are {@link GIFMediaType}, {@link PNGMediaType} and {@link JPEGMediaType}.
     * @param {Number} [params.width] Texture width, used with ````imageData````. Ignored for compressed textures.
     * @param {Number} [params.height] Texture height, used with ````imageData````. Ignored for compressed textures.
     * @param {Boolean} [params.compressed=true] Whether to compress the texture.
     * @param {Number} [params.minFilter=LinearMipMapNearestFilter] How the texture is sampled when a texel covers less than one pixel. Supported
     * values are {@link LinearMipmapLinearFilter}, {@link LinearMipMapNearestFilter}, {@link NearestMipMapNearestFilter},
     * {@link NearestMipMapLinearFilter} and {@link LinearMipMapLinearFilter}. Ignored for compressed textures.
     * @param {Number} [params.magFilter=LinearMipMapNearestFilter] How the texture is sampled when a texel covers more than one pixel. Supported values
     * are {@link LinearFilter} and {@link NearestFilter}. Ignored for compressed textures.
     * @param {Number} [params.wrapS=RepeatWrapping] Wrap parameter for texture coordinate *S*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * @param {Number} [params.wrapT=RepeatWrapping] Wrap parameter for texture coordinate *T*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * {@param {Number} [params.wrapR=RepeatWrapping] Wrap parameter for texture coordinate *R*. Supported values are {@link ClampToEdgeWrapping},
     * {@link MirroredRepeatWrapping} and {@link RepeatWrapping}. Ignored for compressed textures.
     * @returns {XKTTexture} The new {@link XKTTexture}.
     */
    createTexture(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.textureId === null || params.textureId === undefined) {
            throw "Parameter expected: params.textureId";
        }

        if (!params.imageData && !params.src) {
            throw "Parameter expected: params.imageData or params.src";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more textures");
            return;
        }

        if (this.textures[params.textureId]) {
            console.error("XKTTexture already exists with this ID: " + params.textureId);
            return;
        }

        if (params.src) {
            const fileExt = params.src.split('.').pop();
            if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
                console.error(`XKTModel does not support image files with extension '${fileExt}' - won't create texture '${params.textureId}`);
                return;
            }
        }

        const textureId = params.textureId;

        const texture = new XKTTexture({
            textureId,
            imageData: params.imageData,
            mediaType: params.mediaType,
            minFilter: params.minFilter,
            magFilter: params.magFilter,
            wrapS: params.wrapS,
            wrapT: params.wrapT,
            wrapR: params.wrapR,
            width: params.width,
            height: params.height,
            compressed: (params.compressed !== false),
            src: params.src
        });

        this.textures[textureId] = texture;
        this.texturesList.push(texture);

        return texture;
    }

    /**
     * Creates an {@link XKTTextureSet} within this XKTModel.
     *
     * Registers the new {@link XKTTextureSet} in {@link XKTModel#textureSets} and {@link XKTModel#.textureSetsList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.textureSetId Unique ID for the {@link XKTTextureSet}.
     * @param {*} [params.colorTextureId] ID of *RGBA* base color {@link XKTTexture}, with color in *RGB* and alpha in *A*.
     * @param {*} [params.metallicRoughnessTextureId] ID of *RGBA* metal-roughness {@link XKTTexture}, with the metallic factor in *R*, and roughness factor in *G*.
     * @param {*} [params.normalsTextureId] ID of *RGBA* normal {@link XKTTexture}, with normal map vectors in *RGB*.
     * @param {*} [params.emissiveTextureId] ID of *RGBA* emissive {@link XKTTexture}, with emissive color in *RGB*.
     * @param {*} [params.occlusionTextureId] ID of *RGBA* occlusion {@link XKTTexture}, with occlusion factor in *R*.
     * @returns {XKTTextureSet} The new {@link XKTTextureSet}.
     */
    createTextureSet(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.textureSetId === null || params.textureSetId === undefined) {
            throw "Parameter expected: params.textureSetId";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more textureSets");
            return;
        }

        if (this.textureSets[params.textureSetId]) {
            console.error("XKTTextureSet already exists with this ID: " + params.textureSetId);
            return;
        }

        let colorTexture;
        if (params.colorTextureId !== undefined && params.colorTextureId !== null) {
            colorTexture = this.textures[params.colorTextureId];
            if (!colorTexture) {
                console.error(`Texture not found: ${params.colorTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            colorTexture.channel = COLOR_TEXTURE;
        }

        let metallicRoughnessTexture;
        if (params.metallicRoughnessTextureId !== undefined && params.metallicRoughnessTextureId !== null) {
            metallicRoughnessTexture = this.textures[params.metallicRoughnessTextureId];
            if (!metallicRoughnessTexture) {
                console.error(`Texture not found: ${params.metallicRoughnessTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            metallicRoughnessTexture.channel = METALLIC_ROUGHNESS_TEXTURE;
        }

        let normalsTexture;
        if (params.normalsTextureId !== undefined && params.normalsTextureId !== null) {
            normalsTexture = this.textures[params.normalsTextureId];
            if (!normalsTexture) {
                console.error(`Texture not found: ${params.normalsTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            normalsTexture.channel = NORMALS_TEXTURE;
        }

        let emissiveTexture;
        if (params.emissiveTextureId !== undefined && params.emissiveTextureId !== null) {
            emissiveTexture = this.textures[params.emissiveTextureId];
            if (!emissiveTexture) {
                console.error(`Texture not found: ${params.emissiveTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            emissiveTexture.channel = EMISSIVE_TEXTURE;
        }

        let occlusionTexture;
        if (params.occlusionTextureId !== undefined && params.occlusionTextureId !== null) {
            occlusionTexture = this.textures[params.occlusionTextureId];
            if (!occlusionTexture) {
                console.error(`Texture not found: ${params.occlusionTextureId} - ensure that you create it first with createTexture()`);
                return;
            }
            occlusionTexture.channel = OCCLUSION_TEXTURE;
        }

        const textureSet = new XKTTextureSet({
            textureSetId: params.textureSetId,
            textureSetIndex: this.textureSetsList.length,
            colorTexture,
            metallicRoughnessTexture,
            normalsTexture,
            emissiveTexture,
            occlusionTexture
        });

        this.textureSets[params.textureSetId] = textureSet;
        this.textureSetsList.push(textureSet);

        return textureSet;
    }

    /**
     * Creates an {@link XKTGeometry} within this XKTModel.
     *
     * Registers the new {@link XKTGeometry} in {@link XKTModel#geometries} and {@link XKTModel#geometriesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {Number} params.geometryId Unique ID for the {@link XKTGeometry}.
     * @param {String} params.primitiveType The type of {@link XKTGeometry}: "triangles", "lines" or "points".
     * @param {Float64Array} params.positions Floating-point Local-space vertex positions for the {@link XKTGeometry}. Required for all primitive types.
     * @param {Number[]} [params.normals] Floating-point vertex normals for the {@link XKTGeometry}. Only used with triangles primitives. Ignored for points and lines.
     * @param {Number[]} [params.colors] Floating-point RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Number[]} [params.colorsCompressed] Integer RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Number[]} [params.uvs] Floating-point vertex UV coordinates for the {@link XKTGeometry}. Alias for ````uv````.
     * @param {Number[]} [params.uv] Floating-point vertex UV coordinates for the {@link XKTGeometry}. Alias for ````uvs````.
     * @param {Number[]} [params.colorsCompressed] Integer RGBA vertex colors for the {@link XKTGeometry}. Required for points primitives. Ignored for lines and triangles.
     * @param {Uint32Array} [params.indices] Indices for the {@link XKTGeometry}. Required for triangles and lines primitives. Ignored for points.
     * @param {Number} [params.edgeThreshold=10]
     * @returns {XKTGeometry} The new {@link XKTGeometry}.
     */
    createGeometry(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "Parameter expected: params.geometryId";
        }

        if (!params.primitiveType) {
            throw "Parameter expected: params.primitiveType";
        }

        if (!params.positions) {
            throw "Parameter expected: params.positions";
        }

        const triangles = params.primitiveType === "triangles";
        const points = params.primitiveType === "points";
        const lines = params.primitiveType === "lines";
        const line_strip = params.primitiveType === "line-strip";
        const line_loop = params.primitiveType === "line-loop";
        params.primitiveType === "triangle-strip";
        params.primitiveType === "triangle-fan";

        if (!triangles && !points && !lines && !line_strip && !line_loop) {
            throw "Unsupported value for params.primitiveType: "
            + params.primitiveType
            + "' - supported values are 'triangles', 'points', 'lines', 'line-strip', 'triangle-strip' and 'triangle-fan";
        }

        if (triangles) {
            if (!params.indices) {
                params.indices = this._createDefaultIndices();
                throw "Parameter expected for 'triangles' primitive: params.indices";
            }
        }

        if (points) {
            if (!params.colors && !params.colorsCompressed) {
                throw "Parameter expected for 'points' primitive: params.colors or params.colorsCompressed";
            }
        }

        if (lines) {
            if (!params.indices) {
                throw "Parameter expected for 'lines' primitive: params.indices";
            }
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more geometries");
            return;
        }

        if (this.geometries[params.geometryId]) {
            console.error("XKTGeometry already exists with this ID: " + params.geometryId);
            return;
        }

        const geometryId = params.geometryId;
        const primitiveType = params.primitiveType;
        const positions = new Float64Array(params.positions); // May modify in #finalize

        const xktGeometryCfg = {
            geometryId: geometryId,
            geometryIndex: this.geometriesList.length,
            primitiveType: primitiveType,
            positions: positions,
            uvs: params.uvs || params.uv
        };

        if (triangles) {
            if (params.normals) {
                xktGeometryCfg.normals = new Float32Array(params.normals);
            }
            if (params.indices) {
                xktGeometryCfg.indices = params.indices;
            } else {
                xktGeometryCfg.indices = this._createDefaultIndices(positions.length / 3);
            }
        }

        if (points) {
            if (params.colorsCompressed) {
                xktGeometryCfg.colorsCompressed = new Uint8Array(params.colorsCompressed);

            } else {
                const colors = params.colors;
                const colorsCompressed = new Uint8Array(colors.length);
                for (let i = 0, len = colors.length; i < len; i++) {
                    colorsCompressed[i] = Math.floor(colors[i] * 255);
                }
                xktGeometryCfg.colorsCompressed = colorsCompressed;
            }
        }

        if (lines) {
            xktGeometryCfg.indices = params.indices;
        }

        if (triangles) {

            if (!params.normals && !params.uv && !params.uvs) {

                // Building models often duplicate positions to allow face-aligned vertex normals; when we're not
                // providing normals for a geometry, it becomes possible to merge duplicate vertex positions within it.

                // TODO: Make vertex merging also merge normals?

                const mergedPositions = [];
                const mergedIndices = [];
                mergeVertices(xktGeometryCfg.positions, xktGeometryCfg.indices, mergedPositions, mergedIndices);
                xktGeometryCfg.positions = new Float64Array(mergedPositions);
                xktGeometryCfg.indices = mergedIndices;
            }

            xktGeometryCfg.edgeIndices = buildEdgeIndices(xktGeometryCfg.positions, xktGeometryCfg.indices, null, params.edgeThreshold || this.edgeThreshold || 10);
        }

        const geometry = new XKTGeometry(xktGeometryCfg);

        this.geometries[geometryId] = geometry;
        this.geometriesList.push(geometry);

        return geometry;
    }

    _createDefaultIndices(numIndices) {
        const indices = [];
        for (let i = 0; i < numIndices; i++) {
            indices.push(i);
        }
        return indices;
    }

    /**
     * Creates an {@link XKTMesh} within this XKTModel.
     *
     * An {@link XKTMesh} can be owned by one {@link XKTEntity}, which can own multiple {@link XKTMesh}es.
     *
     * Registers the new {@link XKTMesh} in {@link XKTModel#meshes} and {@link XKTModel#meshesList}.
     *
     * @param {*} params Method parameters.
     * @param {Number} params.meshId Unique ID for the {@link XKTMesh}.
     * @param {Number} params.geometryId ID of an existing {@link XKTGeometry} in {@link XKTModel#geometries}.
     * @param {Number} [params.textureSetId] Unique ID of an {@link XKTTextureSet} in {@link XKTModel#textureSets}.
     * @param {Float32Array} params.color RGB color for the {@link XKTMesh}, with each color component in range [0..1].
     * @param {Number} [params.metallic=0] How metallic the {@link XKTMesh} is, in range [0..1]. A value of ````0```` indicates fully dielectric material, while ````1```` indicates fully metallic.
     * @param {Number} [params.roughness=1] How rough the {@link XKTMesh} is, in range [0..1]. A value of ````0```` indicates fully smooth, while ````1```` indicates fully rough.
     * @param {Number} params.opacity Opacity factor for the {@link XKTMesh}, in range [0..1].
     * @param {Float64Array} [params.matrix] Modeling matrix for the {@link XKTMesh}. Overrides ````position````, ````scale```` and ````rotation```` parameters.
     * @param {Number[]} [params.position=[0,0,0]] Position of the {@link XKTMesh}. Overridden by the ````matrix```` parameter.
     * @param {Number[]} [params.scale=[1,1,1]] Scale of the {@link XKTMesh}. Overridden by the ````matrix```` parameter.
     * @param {Number[]} [params.rotation=[0,0,0]] Rotation of the {@link XKTMesh} as Euler angles given in degrees, for each of the X, Y and Z axis. Overridden by the ````matrix```` parameter.
     * @returns {XKTMesh} The new {@link XKTMesh}.
     */
    createMesh(params) {

        if (params.meshId === null || params.meshId === undefined) {
            throw "Parameter expected: params.meshId";
        }

        if (params.geometryId === null || params.geometryId === undefined) {
            throw "Parameter expected: params.geometryId";
        }

        if (this.finalized) {
            throw "XKTModel has been finalized, can't add more meshes";
        }

        if (this.meshes[params.meshId]) {
            console.error("XKTMesh already exists with this ID: " + params.meshId);
            return;
        }

        const geometry = this.geometries[params.geometryId];

        if (!geometry) {
            console.error("XKTGeometry not found: " + params.geometryId);
            return;
        }

        geometry.numInstances++;

        let textureSet = null;
        if (params.textureSetId) {
            textureSet = this.textureSets[params.textureSetId];
            if (!textureSet) {
                console.error("XKTTextureSet not found: " + params.textureSetId);
                return;
            }
            textureSet.numInstances++;
        }

        let matrix = params.matrix;

        if (!matrix) {

            const position = params.position;
            const scale = params.scale;
            const rotation = params.rotation;

            if (position || scale || rotation) {
                matrix = math.identityMat4();
                const quaternion = math.eulerToQuaternion(rotation || [0, 0, 0], "XYZ", math.identityQuaternion());
                math.composeMat4(position || [0, 0, 0], quaternion, scale || [1, 1, 1], matrix);

            } else {
                matrix = math.identityMat4();
            }
        }

        const meshIndex = this.meshesList.length;

        const mesh = new XKTMesh({
            meshId: params.meshId,
            meshIndex,
            matrix,
            geometry,
            color: params.color,
            metallic: params.metallic,
            roughness: params.roughness,
            opacity: params.opacity,
            textureSet
        });

        this.meshes[mesh.meshId] = mesh;
        this.meshesList.push(mesh);

        return mesh;
    }

    /**
     * Creates an {@link XKTEntity} within this XKTModel.
     *
     * Registers the new {@link XKTEntity} in {@link XKTModel#entities} and {@link XKTModel#entitiesList}.
     *
     * Logs error and does nothing if this XKTModel has been finalized (see {@link XKTModel#finalized}).
     *
     * @param {*} params Method parameters.
     * @param {String} params.entityId Unique ID for the {@link XKTEntity}.
     * @param {String[]} params.meshIds IDs of {@link XKTMesh}es used by the {@link XKTEntity}. Note that each {@link XKTMesh} can only be used by one {@link XKTEntity}.
     * @returns {XKTEntity} The new {@link XKTEntity}.
     */
    createEntity(params) {

        if (!params) {
            throw "Parameters expected: params";
        }

        if (params.entityId === null || params.entityId === undefined) {
            throw "Parameter expected: params.entityId";
        }

        if (!params.meshIds) {
            throw "Parameter expected: params.meshIds";
        }

        if (this.finalized) {
            console.error("XKTModel has been finalized, can't add more entities");
            return;
        }

        if (params.meshIds.length === 0) {
            console.warn("XKTEntity has no meshes - won't create: " + params.entityId);
            return;
        }

        let entityId = params.entityId;

        if (this.entities[entityId]) {
            while (this.entities[entityId]) {
                entityId = math.createUUID();
            }
            console.error("XKTEntity already exists with this ID: " + params.entityId + " - substituting random ID instead: " + entityId);
        }

        const meshIds = params.meshIds;
        const meshes = [];

        for (let meshIdIdx = 0, meshIdLen = meshIds.length; meshIdIdx < meshIdLen; meshIdIdx++) {

            const meshId = meshIds[meshIdIdx];
            const mesh = this.meshes[meshId];

            if (!mesh) {
                console.error("XKTMesh found: " + meshId);
                continue;
            }

            if (mesh.entity) {
                console.error("XKTMesh " + meshId + " already used by XKTEntity " + mesh.entity.entityId);
                continue;
            }

            meshes.push(mesh);
        }

        const entity = new XKTEntity(entityId, meshes);

        for (let i = 0, len = meshes.length; i < len; i++) {
            const mesh = meshes[i];
            mesh.entity = entity;
        }

        this.entities[entityId] = entity;
        this.entitiesList.push(entity);

        return entity;
    }

    /**
     * Creates a default {@link XKTMetaObject} for each {@link XKTEntity} that does not already have one.
     */
    createDefaultMetaObjects() {

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {

            const entity = this.entitiesList[i];
            const metaObjectId = entity.entityId;
            const metaObject = this.metaObjects[metaObjectId];

            if (!metaObject) {

                if (!this._rootMetaObject) {
                    this._rootMetaObject = this.createMetaObject({
                        metaObjectId: this.modelId,
                        metaObjectType: "Default",
                        metaObjectName: this.modelId
                    });
                }

                this.createMetaObject({
                    metaObjectId: metaObjectId,
                    metaObjectType: "Default",
                    metaObjectName: "" + metaObjectId,
                    parentMetaObjectId: this._rootMetaObject.metaObjectId
                });
            }
        }
    }

    /**
     * Finalizes this XKTModel.
     *
     * After finalizing, we may then serialize the model to an array buffer using {@link writeXKTModelToArrayBuffer}.
     *
     * Logs error and does nothing if this XKTModel has already been finalized.
     *
     * Internally, this method:
     *
     * * for each {@link XKTEntity} that doesn't already have a {@link XKTMetaObject}, creates one with {@link XKTMetaObject#metaObjectType} set to "default"
     * * sets each {@link XKTEntity}'s {@link XKTEntity#hasReusedGeometries} true if it shares its {@link XKTGeometry}s with other {@link XKTEntity}s,
     * * creates each {@link XKTEntity}'s {@link XKTEntity#aabb},
     * * creates {@link XKTTile}s in {@link XKTModel#tilesList}, and
     * * sets {@link XKTModel#finalized} ````true````.
     */
    async finalize() {

        if (this.finalized) {
            console.log("XKTModel already finalized");
            return;
        }

        this._removeUnusedTextures();

        await this._compressTextures();

        this._bakeSingleUseGeometryPositions();

        this._bakeAndOctEncodeNormals();

        this._createEntityAABBs();

        const rootKDNode = this._createKDTree();

        this.entitiesList = [];

        this._createTilesFromKDTree(rootKDNode);

        this._createReusedGeometriesDecodeMatrix();

        this._flagSolidGeometries();

        this.aabb.set(rootKDNode.aabb);

        this.finalized = true;
    }

    _removeUnusedTextures() {
        let texturesList = [];
        const textures = {};
        for (let i = 0, leni = this.texturesList.length; i < leni; i++) {
            const texture = this.texturesList[i];
            if (texture.channel !== null) {
                texture.textureIndex = texturesList.length;
                texturesList.push(texture);
                textures[texture.textureId] = texture;
            }
        }
        this.texturesList = texturesList;
        this.textures = textures;
    }

    _compressTextures() {
        let countTextures = this.texturesList.length;
        return new Promise((resolve) => {
            if (countTextures === 0) {
                resolve();
                return;
            }
            for (let i = 0, leni = this.texturesList.length; i < leni; i++) {
                const texture = this.texturesList[i];
                const encodingOptions = TEXTURE_ENCODING_OPTIONS[texture.channel] || {};

                if (texture.src) {

                    // XKTTexture created with XKTModel#createTexture({ src: ... })

                    const src = texture.src;
                    const fileExt = src.split('.').pop();
                    switch (fileExt) {
                        case "jpeg":
                        case "jpg":
                        case "png":
                            load(src, ImageLoader, {
                                image: {
                                    type: "data"
                                }
                            }).then((imageData) => {
                                if (texture.compressed) {
                                    encode$4(imageData, KTX2BasisWriter, encodingOptions).then((encodedData) => {
                                        const encodedImageData = new Uint8Array(encodedData);
                                        texture.imageData = encodedImageData;
                                        if (--countTextures <= 0) {
                                            resolve();
                                        }
                                    }).catch((err) => {
                                        console.error("[XKTModel.finalize] Failed to encode image: " + err);
                                        if (--countTextures <= 0) {
                                            resolve();
                                        }
                                    });
                                } else {
                                    texture.imageData = new Uint8Array(1);
                                    if (--countTextures <= 0) {
                                        resolve();
                                    }
                                }
                            }).catch((err) => {
                                console.error("[XKTModel.finalize] Failed to load image: " + err);
                                if (--countTextures <= 0) {
                                    resolve();
                                }
                            });
                            break;
                        default:
                            if (--countTextures <= 0) {
                                resolve();
                            }
                            break;
                    }
                }

                if (texture.imageData) {

                    // XKTTexture created with XKTModel#createTexture({ imageData: ... })

                    if (texture.compressed) {
                        encode$4(texture.imageData, KTX2BasisWriter, encodingOptions)
                            .then((encodedImageData) => {
                                texture.imageData = new Uint8Array(encodedImageData);
                                if (--countTextures <= 0) {
                                    resolve();
                                }
                            }).catch((err) => {
                            console.error("[XKTModel.finalize] Failed to encode image: " + err);
                            if (--countTextures <= 0) {
                                resolve();
                            }
                        });
                    } else {
                        texture.imageData = new Uint8Array(1);
                        if (--countTextures <= 0) {
                            resolve();
                        }
                    }
                }
            }
        });
    }

    _bakeSingleUseGeometryPositions() {

        for (let j = 0, lenj = this.meshesList.length; j < lenj; j++) {

            const mesh = this.meshesList[j];

            const geometry = mesh.geometry;

            if (geometry.numInstances === 1) {

                const matrix = mesh.matrix;

                if (matrix && (!math.isIdentityMat4(matrix))) {

                    const positions = geometry.positions;

                    for (let i = 0, len = positions.length; i < len; i += 3) {

                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        tempVec4a[3] = 1;

                        math.transformPoint4(matrix, tempVec4a, tempVec4b);

                        positions[i + 0] = tempVec4b[0];
                        positions[i + 1] = tempVec4b[1];
                        positions[i + 2] = tempVec4b[2];
                    }
                }
            }
        }
    }

    _bakeAndOctEncodeNormals() {

        for (let i = 0, len = this.meshesList.length; i < len; i++) {

            const mesh = this.meshesList[i];
            const geometry = mesh.geometry;

            if (geometry.normals && !geometry.normalsOctEncoded) {

                geometry.normalsOctEncoded = new Int8Array(geometry.normals.length);

                if (geometry.numInstances > 1) {
                    geometryCompression.octEncodeNormals(geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);

                } else {
                    const modelNormalMatrix = math.inverseMat4(math.transposeMat4(mesh.matrix, tempMat4), tempMat4b);
                    geometryCompression.transformAndOctEncodeNormals(modelNormalMatrix, geometry.normals, geometry.normals.length, geometry.normalsOctEncoded, 0);
                }
            }
        }
    }

    _createEntityAABBs() {

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {

            const entity = this.entitiesList[i];
            const entityAABB = entity.aabb;
            const meshes = entity.meshes;

            math.collapseAABB3(entityAABB);

            for (let j = 0, lenj = meshes.length; j < lenj; j++) {

                const mesh = meshes[j];
                const geometry = mesh.geometry;
                const matrix = mesh.matrix;

                if (geometry.numInstances > 1) {

                    const positions = geometry.positions;
                    for (let i = 0, len = positions.length; i < len; i += 3) {
                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        tempVec4a[3] = 1;
                        math.transformPoint4(matrix, tempVec4a, tempVec4b);
                        math.expandAABB3Point3(entityAABB, tempVec4b);
                    }

                } else {

                    const positions = geometry.positions;
                    for (let i = 0, len = positions.length; i < len; i += 3) {
                        tempVec4a[0] = positions[i + 0];
                        tempVec4a[1] = positions[i + 1];
                        tempVec4a[2] = positions[i + 2];
                        math.expandAABB3Point3(entityAABB, tempVec4a);
                    }
                }
            }
        }
    }

    _createKDTree() {

        let aabb;
        if (this.modelAABB) {
            aabb = this.modelAABB; // Pre-known uber AABB
        } else {
            aabb = math.collapseAABB3();
            for (let i = 0, len = this.entitiesList.length; i < len; i++) {
                const entity = this.entitiesList[i];
                math.expandAABB3(aabb, entity.aabb);
            }
        }

        const rootKDNode = new KDNode(aabb);

        for (let i = 0, len = this.entitiesList.length; i < len; i++) {
            const entity = this.entitiesList[i];
            this._insertEntityIntoKDTree(rootKDNode, entity);
        }

        return rootKDNode;
    }

    _insertEntityIntoKDTree(kdNode, entity) {

        const nodeAABB = kdNode.aabb;
        const entityAABB = entity.aabb;

        const nodeAABBDiag = math.getAABB3Diag(nodeAABB);

        if (nodeAABBDiag < this.minTileSize) {
            kdNode.entities = kdNode.entities || [];
            kdNode.entities.push(entity);
            math.expandAABB3(nodeAABB, entityAABB);
            return;
        }

        if (kdNode.left) {
            if (math.containsAABB3(kdNode.left.aabb, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.left, entity);
                return;
            }
        }

        if (kdNode.right) {
            if (math.containsAABB3(kdNode.right.aabb, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.right, entity);
                return;
            }
        }

        kdTreeDimLength[0] = nodeAABB[3] - nodeAABB[0];
        kdTreeDimLength[1] = nodeAABB[4] - nodeAABB[1];
        kdTreeDimLength[2] = nodeAABB[5] - nodeAABB[2];

        let dim = 0;

        if (kdTreeDimLength[1] > kdTreeDimLength[dim]) {
            dim = 1;
        }

        if (kdTreeDimLength[2] > kdTreeDimLength[dim]) {
            dim = 2;
        }

        if (!kdNode.left) {
            const aabbLeft = nodeAABB.slice();
            aabbLeft[dim + 3] = ((nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0);
            kdNode.left = new KDNode(aabbLeft);
            if (math.containsAABB3(aabbLeft, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.left, entity);
                return;
            }
        }

        if (!kdNode.right) {
            const aabbRight = nodeAABB.slice();
            aabbRight[dim] = ((nodeAABB[dim] + nodeAABB[dim + 3]) / 2.0);
            kdNode.right = new KDNode(aabbRight);
            if (math.containsAABB3(aabbRight, entityAABB)) {
                this._insertEntityIntoKDTree(kdNode.right, entity);
                return;
            }
        }

        kdNode.entities = kdNode.entities || [];
        kdNode.entities.push(entity);

        math.expandAABB3(nodeAABB, entityAABB);
    }

    _createTilesFromKDTree(rootKDNode) {
        this._createTilesFromKDNode(rootKDNode);
    }

    _createTilesFromKDNode(kdNode) {
        if (kdNode.entities && kdNode.entities.length > 0) {
            this._createTileFromEntities(kdNode);
        }
        if (kdNode.left) {
            this._createTilesFromKDNode(kdNode.left);
        }
        if (kdNode.right) {
            this._createTilesFromKDNode(kdNode.right);
        }
    }

    /**
     * Creates a tile from the given entities.
     *
     * For each single-use {@link XKTGeometry}, this method centers {@link XKTGeometry#positions} to make them relative to the
     * tile's center, then quantizes the positions to unsigned 16-bit integers, relative to the tile's boundary.
     *
     * @param kdNode
     */
    _createTileFromEntities(kdNode) {

        const tileAABB = kdNode.aabb;
        const entities = kdNode.entities;

        const tileCenter = math.getAABB3Center(tileAABB);
        const tileCenterNeg = math.mulVec3Scalar(tileCenter, -1, math.vec3());

        const rtcAABB = math.AABB3(); // AABB centered at the RTC origin

        rtcAABB[0] = tileAABB[0] - tileCenter[0];
        rtcAABB[1] = tileAABB[1] - tileCenter[1];
        rtcAABB[2] = tileAABB[2] - tileCenter[2];
        rtcAABB[3] = tileAABB[3] - tileCenter[0];
        rtcAABB[4] = tileAABB[4] - tileCenter[1];
        rtcAABB[5] = tileAABB[5] - tileCenter[2];

        for (let i = 0; i < entities.length; i++) {

            const entity = entities [i];

            const meshes = entity.meshes;

            for (let j = 0, lenj = meshes.length; j < lenj; j++) {

                const mesh = meshes[j];
                const geometry = mesh.geometry;

                if (!geometry.reused) { // Batched geometry

                    const positions = geometry.positions;

                    // Center positions relative to their tile's World-space center

                    for (let k = 0, lenk = positions.length; k < lenk; k += 3) {

                        positions[k + 0] -= tileCenter[0];
                        positions[k + 1] -= tileCenter[1];
                        positions[k + 2] -= tileCenter[2];
                    }

                    // Quantize positions relative to tile's RTC-space boundary

                    geometryCompression.quantizePositions(positions, positions.length, rtcAABB, geometry.positionsQuantized);

                } else { // Instanced geometry

                    // Post-multiply a translation to the mesh's modeling matrix
                    // to center the entity's geometry instances to the tile RTC center

                    //////////////////////////////
                    // Why do we do this?
                    // Seems to break various models
                    /////////////////////////////////

                    math.translateMat4v(tileCenterNeg, mesh.matrix);
                }
            }

            entity.entityIndex = this.entitiesList.length;

            this.entitiesList.push(entity);
        }

        const tile = new XKTTile(tileAABB, entities);

        this.tilesList.push(tile);
    }

    _createReusedGeometriesDecodeMatrix() {

        const tempVec3a = math.vec3();
        const reusedGeometriesAABB = math.collapseAABB3(math.AABB3());
        let countReusedGeometries = 0;

        for (let geometryIndex = 0, numGeometries = this.geometriesList.length; geometryIndex < numGeometries; geometryIndex++) {

            const geometry = this.geometriesList [geometryIndex];

            if (geometry.reused) { // Instanced geometry

                const positions = geometry.positions;

                for (let i = 0, len = positions.length; i < len; i += 3) {

                    tempVec3a[0] = positions[i];
                    tempVec3a[1] = positions[i + 1];
                    tempVec3a[2] = positions[i + 2];

                    math.expandAABB3Point3(reusedGeometriesAABB, tempVec3a);
                }

                countReusedGeometries++;
            }
        }

        if (countReusedGeometries > 0) {

            geometryCompression.createPositionsDecodeMatrix(reusedGeometriesAABB, this.reusedGeometriesDecodeMatrix);

            for (let geometryIndex = 0, numGeometries = this.geometriesList.length; geometryIndex < numGeometries; geometryIndex++) {

                const geometry = this.geometriesList [geometryIndex];

                if (geometry.reused) {
                    geometryCompression.quantizePositions(geometry.positions, geometry.positions.length, reusedGeometriesAABB, geometry.positionsQuantized);
                }
            }

        } else {
            math.identityMat4(this.reusedGeometriesDecodeMatrix); // No need for this matrix, but we'll be tidy and set it to identity
        }
    }

    _flagSolidGeometries() {
        let maxNumPositions = 0;
        let maxNumIndices = 0;
        for (let i = 0, len = this.geometriesList.length; i < len; i++) {
            const geometry = this.geometriesList[i];
            if (geometry.primitiveType === "triangles") {
                if (geometry.positionsQuantized.length > maxNumPositions) {
                    maxNumPositions = geometry.positionsQuantized.length;
                }
                if (geometry.indices.length > maxNumIndices) {
                    maxNumIndices = geometry.indices.length;
                }
            }
        }
        let vertexIndexMapping = new Array(maxNumPositions / 3);
        let edges = new Array(maxNumIndices);
        for (let i = 0, len = this.geometriesList.length; i < len; i++) {
            const geometry = this.geometriesList[i];
            if (geometry.primitiveType === "triangles") {
                geometry.solid = isTriangleMeshSolid(geometry.indices, geometry.positionsQuantized, vertexIndexMapping, edges);
            }
        }
    }
}

function isString(value) {
    return (typeof value === 'string' || value instanceof String);
}

function apply(o, o2) {
    for (const name in o) {
        if (o.hasOwnProperty(name)) {
            o2[name] = o[name];
        }
    }
    return o2;
}

/**
 * @private
 */
const utils = {
    isString,
    apply
};

const VERSION$1 = "3.4.14" ;

function assert$2(condition, message) {
  if (!condition) {
    throw new Error(message || 'assert failed: gltf');
  }
}

function resolveUrl(url, options) {
  const absolute = url.startsWith('data:') || url.startsWith('http:') || url.startsWith('https:');
  if (absolute) {
    return url;
  }
  const baseUrl = options.baseUri || options.uri;
  if (!baseUrl) {
    throw new Error("'baseUri' must be provided to resolve relative url ".concat(url));
  }
  return baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1) + url;
}

function getTypedArrayForBufferView(json, buffers, bufferViewIndex) {
  const bufferView = json.bufferViews[bufferViewIndex];
  assert$2(bufferView);
  const bufferIndex = bufferView.buffer;
  const binChunk = buffers[bufferIndex];
  assert$2(binChunk);
  const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
  return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
}

const TYPES = ['SCALAR', 'VEC2', 'VEC3', 'VEC4'];
const ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT = [[Int8Array, 5120], [Uint8Array, 5121], [Int16Array, 5122], [Uint16Array, 5123], [Uint32Array, 5125], [Float32Array, 5126], [Float64Array, 5130]];
const ARRAY_TO_COMPONENT_TYPE = new Map(ARRAY_CONSTRUCTOR_TO_WEBGL_CONSTANT);
const ATTRIBUTE_TYPE_TO_COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};
const ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
function getAccessorTypeFromSize(size) {
  const type = TYPES[size - 1];
  return type || TYPES[0];
}
function getComponentTypeFromArray(typedArray) {
  const componentType = ARRAY_TO_COMPONENT_TYPE.get(typedArray.constructor);
  if (!componentType) {
    throw new Error('Illegal typed array');
  }
  return componentType;
}
function getAccessorArrayTypeAndLength(accessor, bufferView) {
  const ArrayType = ATTRIBUTE_COMPONENT_TYPE_TO_ARRAY[accessor.componentType];
  const components = ATTRIBUTE_TYPE_TO_COMPONENTS[accessor.type];
  const bytesPerComponent = ATTRIBUTE_COMPONENT_TYPE_TO_BYTE_SIZE[accessor.componentType];
  const length = accessor.count * components;
  const byteLength = accessor.count * components * bytesPerComponent;
  assert$2(byteLength >= 0 && byteLength <= bufferView.byteLength);
  return {
    ArrayType,
    length,
    byteLength
  };
}

const DEFAULT_GLTF_JSON = {
  asset: {
    version: '2.0',
    generator: 'loaders.gl'
  },
  buffers: []
};
class GLTFScenegraph {
  constructor(gltf) {
    _defineProperty(this, "gltf", void 0);
    _defineProperty(this, "sourceBuffers", void 0);
    _defineProperty(this, "byteLength", void 0);
    this.gltf = gltf || {
      json: {
        ...DEFAULT_GLTF_JSON
      },
      buffers: []
    };
    this.sourceBuffers = [];
    this.byteLength = 0;
    if (this.gltf.buffers && this.gltf.buffers[0]) {
      this.byteLength = this.gltf.buffers[0].byteLength;
      this.sourceBuffers = [this.gltf.buffers[0]];
    }
  }
  get json() {
    return this.gltf.json;
  }
  getApplicationData(key) {
    const data = this.json[key];
    return data;
  }
  getExtraData(key) {
    const extras = this.json.extras || {};
    return extras[key];
  }
  getExtension(extensionName) {
    const isExtension = this.getUsedExtensions().find(name => name === extensionName);
    const extensions = this.json.extensions || {};
    return isExtension ? extensions[extensionName] || true : null;
  }
  getRequiredExtension(extensionName) {
    const isRequired = this.getRequiredExtensions().find(name => name === extensionName);
    return isRequired ? this.getExtension(extensionName) : null;
  }
  getRequiredExtensions() {
    return this.json.extensionsRequired || [];
  }
  getUsedExtensions() {
    return this.json.extensionsUsed || [];
  }
  getRemovedExtensions() {
    return this.json.extensionsRemoved || [];
  }
  getObjectExtension(object, extensionName) {
    const extensions = object.extensions || {};
    return extensions[extensionName];
  }
  getScene(index) {
    return this.getObject('scenes', index);
  }
  getNode(index) {
    return this.getObject('nodes', index);
  }
  getSkin(index) {
    return this.getObject('skins', index);
  }
  getMesh(index) {
    return this.getObject('meshes', index);
  }
  getMaterial(index) {
    return this.getObject('materials', index);
  }
  getAccessor(index) {
    return this.getObject('accessors', index);
  }
  getTexture(index) {
    return this.getObject('textures', index);
  }
  getSampler(index) {
    return this.getObject('samplers', index);
  }
  getImage(index) {
    return this.getObject('images', index);
  }
  getBufferView(index) {
    return this.getObject('bufferViews', index);
  }
  getBuffer(index) {
    return this.getObject('buffers', index);
  }
  getObject(array, index) {
    if (typeof index === 'object') {
      return index;
    }
    const object = this.json[array] && this.json[array][index];
    if (!object) {
      throw new Error("glTF file error: Could not find ".concat(array, "[").concat(index, "]"));
    }
    return object;
  }
  getTypedArrayForBufferView(bufferView) {
    bufferView = this.getBufferView(bufferView);
    const bufferIndex = bufferView.buffer;
    const binChunk = this.gltf.buffers[bufferIndex];
    assert$2(binChunk);
    const byteOffset = (bufferView.byteOffset || 0) + binChunk.byteOffset;
    return new Uint8Array(binChunk.arrayBuffer, byteOffset, bufferView.byteLength);
  }
  getTypedArrayForAccessor(accessor) {
    accessor = this.getAccessor(accessor);
    const bufferView = this.getBufferView(accessor.bufferView);
    const buffer = this.getBuffer(bufferView.buffer);
    const arrayBuffer = buffer.data;
    const {
      ArrayType,
      length
    } = getAccessorArrayTypeAndLength(accessor, bufferView);
    const byteOffset = bufferView.byteOffset + accessor.byteOffset;
    return new ArrayType(arrayBuffer, byteOffset, length);
  }
  getTypedArrayForImageData(image) {
    image = this.getAccessor(image);
    const bufferView = this.getBufferView(image.bufferView);
    const buffer = this.getBuffer(bufferView.buffer);
    const arrayBuffer = buffer.data;
    const byteOffset = bufferView.byteOffset || 0;
    return new Uint8Array(arrayBuffer, byteOffset, bufferView.byteLength);
  }
  addApplicationData(key, data) {
    this.json[key] = data;
    return this;
  }
  addExtraData(key, data) {
    this.json.extras = this.json.extras || {};
    this.json.extras[key] = data;
    return this;
  }
  addObjectExtension(object, extensionName, data) {
    object.extensions = object.extensions || {};
    object.extensions[extensionName] = data;
    this.registerUsedExtension(extensionName);
    return this;
  }
  setObjectExtension(object, extensionName, data) {
    const extensions = object.extensions || {};
    extensions[extensionName] = data;
  }
  removeObjectExtension(object, extensionName) {
    const extensions = object.extensions || {};
    const extension = extensions[extensionName];
    delete extensions[extensionName];
    return extension;
  }
  addExtension(extensionName) {
    let extensionData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    assert$2(extensionData);
    this.json.extensions = this.json.extensions || {};
    this.json.extensions[extensionName] = extensionData;
    this.registerUsedExtension(extensionName);
    return extensionData;
  }
  addRequiredExtension(extensionName) {
    let extensionData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    assert$2(extensionData);
    this.addExtension(extensionName, extensionData);
    this.registerRequiredExtension(extensionName);
    return extensionData;
  }
  registerUsedExtension(extensionName) {
    this.json.extensionsUsed = this.json.extensionsUsed || [];
    if (!this.json.extensionsUsed.find(ext => ext === extensionName)) {
      this.json.extensionsUsed.push(extensionName);
    }
  }
  registerRequiredExtension(extensionName) {
    this.registerUsedExtension(extensionName);
    this.json.extensionsRequired = this.json.extensionsRequired || [];
    if (!this.json.extensionsRequired.find(ext => ext === extensionName)) {
      this.json.extensionsRequired.push(extensionName);
    }
  }
  removeExtension(extensionName) {
    if (!this.getExtension(extensionName)) {
      return;
    }
    if (this.json.extensionsRequired) {
      this._removeStringFromArray(this.json.extensionsRequired, extensionName);
    }
    if (this.json.extensionsUsed) {
      this._removeStringFromArray(this.json.extensionsUsed, extensionName);
    }
    if (this.json.extensions) {
      delete this.json.extensions[extensionName];
    }
    if (!Array.isArray(this.json.extensionsRemoved)) {
      this.json.extensionsRemoved = [];
    }
    const extensionsRemoved = this.json.extensionsRemoved;
    if (!extensionsRemoved.includes(extensionName)) {
      extensionsRemoved.push(extensionName);
    }
  }
  setDefaultScene(sceneIndex) {
    this.json.scene = sceneIndex;
  }
  addScene(scene) {
    const {
      nodeIndices
    } = scene;
    this.json.scenes = this.json.scenes || [];
    this.json.scenes.push({
      nodes: nodeIndices
    });
    return this.json.scenes.length - 1;
  }
  addNode(node) {
    const {
      meshIndex,
      matrix
    } = node;
    this.json.nodes = this.json.nodes || [];
    const nodeData = {
      mesh: meshIndex
    };
    if (matrix) {
      nodeData.matrix = matrix;
    }
    this.json.nodes.push(nodeData);
    return this.json.nodes.length - 1;
  }
  addMesh(mesh) {
    const {
      attributes,
      indices,
      material,
      mode = 4
    } = mesh;
    const accessors = this._addAttributes(attributes);
    const glTFMesh = {
      primitives: [{
        attributes: accessors,
        mode
      }]
    };
    if (indices) {
      const indicesAccessor = this._addIndices(indices);
      glTFMesh.primitives[0].indices = indicesAccessor;
    }
    if (Number.isFinite(material)) {
      glTFMesh.primitives[0].material = material;
    }
    this.json.meshes = this.json.meshes || [];
    this.json.meshes.push(glTFMesh);
    return this.json.meshes.length - 1;
  }
  addPointCloud(attributes) {
    const accessorIndices = this._addAttributes(attributes);
    const glTFMesh = {
      primitives: [{
        attributes: accessorIndices,
        mode: 0
      }]
    };
    this.json.meshes = this.json.meshes || [];
    this.json.meshes.push(glTFMesh);
    return this.json.meshes.length - 1;
  }
  addImage(imageData, mimeTypeOpt) {
    const metadata = getBinaryImageMetadata(imageData);
    const mimeType = mimeTypeOpt || (metadata === null || metadata === void 0 ? void 0 : metadata.mimeType);
    const bufferViewIndex = this.addBufferView(imageData);
    const glTFImage = {
      bufferView: bufferViewIndex,
      mimeType
    };
    this.json.images = this.json.images || [];
    this.json.images.push(glTFImage);
    return this.json.images.length - 1;
  }
  addBufferView(buffer) {
    const byteLength = buffer.byteLength;
    assert$2(Number.isFinite(byteLength));
    this.sourceBuffers = this.sourceBuffers || [];
    this.sourceBuffers.push(buffer);
    const glTFBufferView = {
      buffer: 0,
      byteOffset: this.byteLength,
      byteLength
    };
    this.byteLength += padToNBytes(byteLength, 4);
    this.json.bufferViews = this.json.bufferViews || [];
    this.json.bufferViews.push(glTFBufferView);
    return this.json.bufferViews.length - 1;
  }
  addAccessor(bufferViewIndex, accessor) {
    const glTFAccessor = {
      bufferView: bufferViewIndex,
      type: getAccessorTypeFromSize(accessor.size),
      componentType: accessor.componentType,
      count: accessor.count,
      max: accessor.max,
      min: accessor.min
    };
    this.json.accessors = this.json.accessors || [];
    this.json.accessors.push(glTFAccessor);
    return this.json.accessors.length - 1;
  }
  addBinaryBuffer(sourceBuffer) {
    let accessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      size: 3
    };
    const bufferViewIndex = this.addBufferView(sourceBuffer);
    let minMax = {
      min: accessor.min,
      max: accessor.max
    };
    if (!minMax.min || !minMax.max) {
      minMax = this._getAccessorMinMax(sourceBuffer, accessor.size);
    }
    const accessorDefaults = {
      size: accessor.size,
      componentType: getComponentTypeFromArray(sourceBuffer),
      count: Math.round(sourceBuffer.length / accessor.size),
      min: minMax.min,
      max: minMax.max
    };
    return this.addAccessor(bufferViewIndex, Object.assign(accessorDefaults, accessor));
  }
  addTexture(texture) {
    const {
      imageIndex
    } = texture;
    const glTFTexture = {
      source: imageIndex
    };
    this.json.textures = this.json.textures || [];
    this.json.textures.push(glTFTexture);
    return this.json.textures.length - 1;
  }
  addMaterial(pbrMaterialInfo) {
    this.json.materials = this.json.materials || [];
    this.json.materials.push(pbrMaterialInfo);
    return this.json.materials.length - 1;
  }
  createBinaryChunk() {
    var _this$json, _this$json$buffers;
    this.gltf.buffers = [];
    const totalByteLength = this.byteLength;
    const arrayBuffer = new ArrayBuffer(totalByteLength);
    const targetArray = new Uint8Array(arrayBuffer);
    let dstByteOffset = 0;
    for (const sourceBuffer of this.sourceBuffers || []) {
      dstByteOffset = copyToArray(sourceBuffer, targetArray, dstByteOffset);
    }
    if ((_this$json = this.json) !== null && _this$json !== void 0 && (_this$json$buffers = _this$json.buffers) !== null && _this$json$buffers !== void 0 && _this$json$buffers[0]) {
      this.json.buffers[0].byteLength = totalByteLength;
    } else {
      this.json.buffers = [{
        byteLength: totalByteLength
      }];
    }
    this.gltf.binary = arrayBuffer;
    this.sourceBuffers = [arrayBuffer];
  }
  _removeStringFromArray(array, string) {
    let found = true;
    while (found) {
      const index = array.indexOf(string);
      if (index > -1) {
        array.splice(index, 1);
      } else {
        found = false;
      }
    }
  }
  _addAttributes() {
    let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const result = {};
    for (const attributeKey in attributes) {
      const attributeData = attributes[attributeKey];
      const attrName = this._getGltfAttributeName(attributeKey);
      const accessor = this.addBinaryBuffer(attributeData.value, attributeData);
      result[attrName] = accessor;
    }
    return result;
  }
  _addIndices(indices) {
    return this.addBinaryBuffer(indices, {
      size: 1
    });
  }
  _getGltfAttributeName(attributeName) {
    switch (attributeName.toLowerCase()) {
      case 'position':
      case 'positions':
      case 'vertices':
        return 'POSITION';
      case 'normal':
      case 'normals':
        return 'NORMAL';
      case 'color':
      case 'colors':
        return 'COLOR_0';
      case 'texcoord':
      case 'texcoords':
        return 'TEXCOORD_0';
      default:
        return attributeName;
    }
  }
  _getAccessorMinMax(buffer, size) {
    const result = {
      min: null,
      max: null
    };
    if (buffer.length < size) {
      return result;
    }
    result.min = [];
    result.max = [];
    const initValues = buffer.subarray(0, size);
    for (const value of initValues) {
      result.min.push(value);
      result.max.push(value);
    }
    for (let index = size; index < buffer.length; index += size) {
      for (let componentIndex = 0; componentIndex < size; componentIndex++) {
        result.min[0 + componentIndex] = Math.min(result.min[0 + componentIndex], buffer[index + componentIndex]);
        result.max[0 + componentIndex] = Math.max(result.max[0 + componentIndex], buffer[index + componentIndex]);
      }
    }
    return result;
  }
}

const wasm_base = 'B9h9z9tFBBBF8fL9gBB9gLaaaaaFa9gEaaaB9gFaFa9gEaaaFaEMcBFFFGGGEIIILF9wFFFLEFBFKNFaFCx/IFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBF8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBGy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBEn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBIi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBKI9z9iqlBOc+x8ycGBM/qQFTa8jUUUUBCU/EBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAGTkUUUBRNCUoBAG9uC/wgBZHKCUGAKCUG9JyRVAECFJRICBRcGXEXAcAF9PQFAVAFAclAcAVJAF9JyRMGXGXAG9FQBAMCbJHKC9wZRSAKCIrCEJCGrRQANCUGJRfCBRbAIRTEXGXAOATlAQ9PQBCBRISEMATAQJRIGXAS9FQBCBRtCBREEXGXAOAIlCi9PQBCBRISLMANCU/CBJAEJRKGXGXGXGXGXATAECKrJ2BBAtCKZrCEZfIBFGEBMAKhB83EBAKCNJhB83EBSEMAKAI2BIAI2BBHmCKrHYAYCE6HYy86BBAKCFJAICIJAYJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCGJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCEJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCIJAYAmJHY2BBAI2BFHmCKrHPAPCE6HPy86BBAKCLJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCKJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCOJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCNJAYAmJHY2BBAI2BGHmCKrHPAPCE6HPy86BBAKCVJAYAPJHY2BBAmCIrCEZHPAPCE6HPy86BBAKCcJAYAPJHY2BBAmCGrCEZHPAPCE6HPy86BBAKCMJAYAPJHY2BBAmCEZHmAmCE6Hmy86BBAKCSJAYAmJHm2BBAI2BEHICKrHYAYCE6HYy86BBAKCQJAmAYJHm2BBAICIrCEZHYAYCE6HYy86BBAKCfJAmAYJHm2BBAICGrCEZHYAYCE6HYy86BBAKCbJAmAYJHK2BBAICEZHIAICE6HIy86BBAKAIJRISGMAKAI2BNAI2BBHmCIrHYAYCb6HYy86BBAKCFJAICNJAYJHY2BBAmCbZHmAmCb6Hmy86BBAKCGJAYAmJHm2BBAI2BFHYCIrHPAPCb6HPy86BBAKCEJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCIJAmAYJHm2BBAI2BGHYCIrHPAPCb6HPy86BBAKCLJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCKJAmAYJHm2BBAI2BEHYCIrHPAPCb6HPy86BBAKCOJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCNJAmAYJHm2BBAI2BIHYCIrHPAPCb6HPy86BBAKCVJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCcJAmAYJHm2BBAI2BLHYCIrHPAPCb6HPy86BBAKCMJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCSJAmAYJHm2BBAI2BKHYCIrHPAPCb6HPy86BBAKCQJAmAPJHm2BBAYCbZHYAYCb6HYy86BBAKCfJAmAYJHm2BBAI2BOHICIrHYAYCb6HYy86BBAKCbJAmAYJHK2BBAICbZHIAICb6HIy86BBAKAIJRISFMAKAI8pBB83BBAKCNJAICNJ8pBB83BBAICTJRIMAtCGJRtAECTJHEAS9JQBMMGXAIQBCBRISEMGXAM9FQBANAbJ2BBRtCBRKAfREEXAEANCU/CBJAKJ2BBHTCFrCBATCFZl9zAtJHt86BBAEAGJREAKCFJHKAM9HQBMMAfCFJRfAIRTAbCFJHbAG9HQBMMABAcAG9sJANCUGJAMAG9sTkUUUBpANANCUGJAMCaJAG9sJAGTkUUUBpMAMCBAIyAcJRcAIQBMC9+RKSFMCBC99AOAIlAGCAAGCA9Ly6yRKMALCU/EBJ8kUUUUBAKM+OmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUFT+JUUUBpALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM+lLKFaF99GaG99FaG99GXGXAGCI9HQBAF9FQFEXGXGX9DBBB8/9DBBB+/ABCGJHG1BB+yAB1BBHE+yHI+L+TABCFJHL1BBHK+yHO+L+THN9DBBBB9gHVyAN9DBB/+hANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE86BBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG86BBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG86BBABCIJRBAFCaJHFQBSGMMAF9FQBEXGXGX9DBBB8/9DBBB+/ABCIJHG8uFB+yAB8uFBHE+yHI+L+TABCGJHL8uFBHK+yHO+L+THN9DBBBB9gHVyAN9DB/+g6ANAN+U9DBBBBANAVyHcAc+MHMAECa3yAI+SHIAI+UAcAMAKCa3yAO+SHcAc+U+S+S+R+VHO+U+SHN+L9DBBB9P9d9FQBAN+oRESFMCUUUU94REMAGAE87FBGXGX9DBBB8/9DBBB+/Ac9DBBBB9gyAcAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMALAG87FBGXGX9DBBB8/9DBBB+/AI9DBBBB9gyAIAO+U+SHN+L9DBBB9P9d9FQBAN+oRGSFMCUUUU94RGMABAG87FBABCNJRBAFCaJHFQBMMM/SEIEaE99EaF99GXAF9FQBCBREABRIEXGXGX9D/zI818/AICKJ8uFBHLCEq+y+VHKAI8uFB+y+UHO9DB/+g6+U9DBBB8/9DBBB+/AO9DBBBB9gy+SHN+L9DBBB9P9d9FQBAN+oRVSFMCUUUU94RVMAICIJ8uFBRcAICGJ8uFBRMABALCFJCEZAEqCFWJAV87FBGXGXAKAM+y+UHN9DB/+g6+U9DBBB8/9DBBB+/AN9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRMSFMCUUUU94RMMABALCGJCEZAEqCFWJAM87FBGXGXAKAc+y+UHK9DB/+g6+U9DBBB8/9DBBB+/AK9DBBBB9gy+SHS+L9DBBB9P9d9FQBAS+oRcSFMCUUUU94RcMABALCaJCEZAEqCFWJAc87FBGXGX9DBBU8/AOAO+U+TANAN+U+TAKAK+U+THO9DBBBBAO9DBBBB9gy+R9DB/+g6+U9DBBB8/+SHO+L9DBBB9P9d9FQBAO+oRcSFMCUUUU94RcMABALCEZAEqCFWJAc87FBAICNJRIAECIJREAFCaJHFQBMMM9JBGXAGCGrAF9sHF9FQBEXABAB8oGBHGCNWCN91+yAGCi91CnWCUUU/8EJ+++U84GBABCIJRBAFCaJHFQBMMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEM/lFFFaGXGXAFABqCEZ9FQBABRESFMGXGXAGCT9PQBABRESFMABREEXAEAF8oGBjGBAECIJAFCIJ8oGBjGBAECNJAFCNJ8oGBjGBAECSJAFCSJ8oGBjGBAECTJREAFCTJRFAGC9wJHGCb9LQBMMAGCI9JQBEXAEAF8oGBjGBAFCIJRFAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF2BB86BBAECFJREAFCFJRFAGCaJHGQBMMABMoFFGaGXGXABCEZ9FQBABRESFMAFCgFZC+BwsN9sRIGXGXAGCT9PQBABRESFMABREEXAEAIjGBAECSJAIjGBAECNJAIjGBAECIJAIjGBAECTJREAGC9wJHGCb9LQBMMAGCI9JQBEXAEAIjGBAECIJREAGC98JHGCE9LQBMMGXAG9FQBEXAEAF86BBAECFJREAGCaJHGQBMMABMMMFBCUNMIT9kBB';
const wasm_simd = 'B9h9z9tFBBBF8dL9gBB9gLaaaaaFa9gEaaaB9gGaaB9gFaFaEQSBBFBFFGEGEGIILF9wFFFLEFBFKNFaFCx/aFMO/LFVK9tv9t9vq95GBt9f9f939h9z9t9f9j9h9s9s9f9jW9vq9zBBp9tv9z9o9v9wW9f9kv9j9v9kv9WvqWv94h919m9mvqBG8Z9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv94h919m9mvqBIy9tv9z9o9v9wW9f9kv9j9v9kv9J9u9kv949TvZ91v9u9jvBLn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9P9jWBKi9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9R919hWBNn9tv9z9o9v9wW9f9kv9j9v9kv69p9sWvq9F949wBcI9z9iqlBMc/j9JSIBTEM9+FLa8jUUUUBCTlRBCBRFEXCBRGCBREEXABCNJAGJAECUaAFAGrCFZHIy86BBAEAIJREAGCFJHGCN9HQBMAFCx+YUUBJAE86BBAFCEWCxkUUBJAB8pEN83EBAFCFJHFCUG9HQBMMkRIbaG97FaK978jUUUUBCU/KBlHL8kUUUUBC9+RKGXAGCFJAI9LQBCaRKAE2BBC+gF9HQBALAEAIJHOAGlAG/8cBBCUoBAG9uC/wgBZHKCUGAKCUG9JyRNAECFJRKCBRVGXEXAVAF9PQFANAFAVlAVANJAF9JyRcGXGXAG9FQBAcCbJHIC9wZHMCE9sRSAMCFWRQAICIrCEJCGrRfCBRbEXAKRTCBRtGXEXGXAOATlAf9PQBCBRKSLMALCU/CBJAtAM9sJRmATAfJRKCBREGXAMCoB9JQBAOAKlC/gB9JQBCBRIEXAmAIJREGXGXGXGXGXATAICKrJ2BBHYCEZfIBFGEBMAECBDtDMIBSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIBAKCTJRKMGXGXGXGXGXAYCGrCEZfIBFGEBMAECBDtDMITSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMITAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMITAKCTJRKMGXGXGXGXGXAYCIrCEZfIBFGEBMAECBDtDMIASEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIAAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAEAKDBBBDMIAAKCTJRKMGXGXGXGXGXAYCKrfIBFGEBMAECBDtDMI8wSEMAEAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCIJAnDeBJAYCx+YUUBJ2BBJRKSGMAEAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBAYCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HYCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMI8wAKCNJAnDeBJAYCx+YUUBJ2BBJRKSFMAEAKDBBBDMI8wAKCTJRKMAICoBJREAICUFJAM9LQFAERIAOAKlC/fB9LQBMMGXAEAM9PQBAECErRIEXGXAOAKlCi9PQBCBRKSOMAmAEJRYGXGXGXGXGXATAECKrJ2BBAICKZrCEZfIBFGEBMAYCBDtDMIBSEMAYAKDBBIAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnHPCGD+MFAPDQBTFtGmEYIPLdKeOnC0+G+MiDtD9OHdCEDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCIJAnDeBJAeCx+YUUBJ2BBJRKSGMAYAKDBBNAKDBBBHPCID+MFAPDQBTFtGmEYIPLdKeOnC+P+e+8/4BDtD9OHdCbDbD8jHPD8dBhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBAeCx+YUUBJDBBBHnAnDQBBBBBBBBBBBBBBBBAPD8dFhUg/8/4/w/goB9+h84k7HeCEWCxkUUBJDBEBD9uDQBFGEILKOTtmYPdenDfAdAPD9SDMIBAKCNJAnDeBJAeCx+YUUBJ2BBJRKSFMAYAKDBBBDMIBAKCTJRKMAICGJRIAECTJHEAM9JQBMMGXAK9FQBAKRTAtCFJHtCI6QGSFMMCBRKSEMGXAM9FQBALCUGJAbJREALAbJDBGBRnCBRYEXAEALCU/CBJAYJHIDBIBHdCFD9tAdCFDbHPD9OD9hD9RHdAIAMJDBIBHiCFD9tAiAPD9OD9hD9RHiDQBTFtGmEYIPLdKeOnH8ZAIAQJDBIBHpCFD9tApAPD9OD9hD9RHpAIASJDBIBHyCFD9tAyAPD9OD9hD9RHyDQBTFtGmEYIPLdKeOnH8cDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGEAnD9uHnDyBjGBAEAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnA8ZA8cDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNiV8ZcpMyS8cQ8df8eb8fHdApAyDQNiV8ZcpMyS8cQ8df8eb8fHiDQBFTtGEmYILPdKOenHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJHIAnAdAiDQNVi8ZcMpySQ8c8dfb8e8fHPAPDQBFGEBFGEBFGEBFGED9uHnDyBjGBAIAGJHIAnAPAPDQILKOILKOILKOILKOD9uHnDyBjGBAIAGJHIAnAPAPDQNVcMNVcMNVcMNVcMD9uHnDyBjGBAIAGJHIAnAPAPDQSQfbSQfbSQfbSQfbD9uHnDyBjGBAIAGJREAYCTJHYAM9JQBMMAbCIJHbAG9JQBMMABAVAG9sJALCUGJAcAG9s/8cBBALALCUGJAcCaJAG9sJAG/8cBBMAcCBAKyAVJRVAKQBMC9+RKSFMCBC99AOAKlAGCAAGCA9Ly6yRKMALCU/KBJ8kUUUUBAKMNBT+BUUUBM+KmFTa8jUUUUBCoFlHL8kUUUUBC9+RKGXAFCE9uHOCtJAI9LQBCaRKAE2BBHNC/wFZC/gF9HQBANCbZHVCF9LQBALCoBJCgFCUF/8MBALC84Jha83EBALC8wJha83EBALC8oJha83EBALCAJha83EBALCiJha83EBALCTJha83EBALha83ENALha83EBAEAIJC9wJRcAECFJHNAOJRMGXAF9FQBCQCbAVCF6yRSABRECBRVCBRQCBRfCBRICBRKEXGXAMAcuQBC9+RKSEMGXGXAN2BBHOC/vF9LQBALCoBJAOCIrCa9zAKJCbZCEWJHb8oGIRTAb8oGBRtGXAOCbZHbAS9PQBALAOCa9zAIJCbZCGWJ8oGBAVAbyROAb9FRbGXGXAGCG9HQBABAt87FBABCIJAO87FBABCGJAT87FBSFMAEAtjGBAECNJAOjGBAECIJATjGBMAVAbJRVALCoBJAKCEWJHmAOjGBAmATjGIALAICGWJAOjGBALCoBJAKCFJCbZHKCEWJHTAtjGBATAOjGIAIAbJRIAKCFJRKSGMGXGXAbCb6QBAQAbJAbC989zJCFJRQSFMAM1BBHbCgFZROGXGXAbCa9MQBAMCFJRMSFMAM1BFHbCgBZCOWAOCgBZqROGXAbCa9MQBAMCGJRMSFMAM1BGHbCgBZCfWAOqROGXAbCa9MQBAMCEJRMSFMAM1BEHbCgBZCdWAOqROGXAbCa9MQBAMCIJRMSFMAM2BIC8cWAOqROAMCLJRMMAOCFrCBAOCFZl9zAQJRQMGXGXAGCG9HQBABAt87FBABCIJAQ87FBABCGJAT87FBSFMAEAtjGBAECNJAQjGBAECIJATjGBMALCoBJAKCEWJHOAQjGBAOATjGIALAICGWJAQjGBALCoBJAKCFJCbZHKCEWJHOAtjGBAOAQjGIAICFJRIAKCFJRKSFMGXAOCDF9LQBALAIAcAOCbZJ2BBHbCIrHTlCbZCGWJ8oGBAVCFJHtATyROALAIAblCbZCGWJ8oGBAtAT9FHmJHtAbCbZHTyRbAT9FRTGXGXAGCG9HQBABAV87FBABCIJAb87FBABCGJAO87FBSFMAEAVjGBAECNJAbjGBAECIJAOjGBMALAICGWJAVjGBALCoBJAKCEWJHYAOjGBAYAVjGIALAICFJHICbZCGWJAOjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAIAmJCbZHICGWJAbjGBALCoBJAKCGJCbZHKCEWJHOAVjGBAOAbjGIAKCFJRKAIATJRIAtATJRVSFMAVCBAM2BBHYyHTAOC/+F6HPJROAYCbZRtGXGXAYCIrHmQBAOCFJRbSFMAORbALAIAmlCbZCGWJ8oGBROMGXGXAtQBAbCFJRVSFMAbRVALAIAYlCbZCGWJ8oGBRbMGXGXAP9FQBAMCFJRYSFMAM1BFHYCgFZRTGXGXAYCa9MQBAMCGJRYSFMAM1BGHYCgBZCOWATCgBZqRTGXAYCa9MQBAMCEJRYSFMAM1BEHYCgBZCfWATqRTGXAYCa9MQBAMCIJRYSFMAM1BIHYCgBZCdWATqRTGXAYCa9MQBAMCLJRYSFMAMCKJRYAM2BLC8cWATqRTMATCFrCBATCFZl9zAQJHQRTMGXGXAmCb6QBAYRPSFMAY1BBHMCgFZROGXGXAMCa9MQBAYCFJRPSFMAY1BFHMCgBZCOWAOCgBZqROGXAMCa9MQBAYCGJRPSFMAY1BGHMCgBZCfWAOqROGXAMCa9MQBAYCEJRPSFMAY1BEHMCgBZCdWAOqROGXAMCa9MQBAYCIJRPSFMAYCLJRPAY2BIC8cWAOqROMAOCFrCBAOCFZl9zAQJHQROMGXGXAtCb6QBAPRMSFMAP1BBHMCgFZRbGXGXAMCa9MQBAPCFJRMSFMAP1BFHMCgBZCOWAbCgBZqRbGXAMCa9MQBAPCGJRMSFMAP1BGHMCgBZCfWAbqRbGXAMCa9MQBAPCEJRMSFMAP1BEHMCgBZCdWAbqRbGXAMCa9MQBAPCIJRMSFMAPCLJRMAP2BIC8cWAbqRbMAbCFrCBAbCFZl9zAQJHQRbMGXGXAGCG9HQBABAT87FBABCIJAb87FBABCGJAO87FBSFMAEATjGBAECNJAbjGBAECIJAOjGBMALCoBJAKCEWJHYAOjGBAYATjGIALAICGWJATjGBALCoBJAKCFJCbZCEWJHYAbjGBAYAOjGIALAICFJHICbZCGWJAOjGBALCoBJAKCGJCbZCEWJHOATjGBAOAbjGIALAIAm9FAmCb6qJHICbZCGWJAbjGBAIAt9FAtCb6qJRIAKCEJRKMANCFJRNABCKJRBAECSJREAKCbZRKAICbZRIAfCEJHfAF9JQBMMCBC99AMAc6yRKMALCoFJ8kUUUUBAKM/tIFGa8jUUUUBCTlRLC9+RKGXAFCLJAI9LQBCaRKAE2BBC/+FZC/QF9HQBALhB83ENAECFJRKAEAIJC98JREGXAF9FQBGXAGCG6QBEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMALCNJAICFZCGWqHGAICGrCBAICFrCFZl9zAG8oGBJHIjGBABAIjGBABCIJRBAFCaJHFQBSGMMEXGXAKAE9JQBC9+bMAK1BBHGCgFZRIGXGXAGCa9MQBAKCFJRKSFMAK1BFHGCgBZCOWAICgBZqRIGXAGCa9MQBAKCGJRKSFMAK1BGHGCgBZCfWAIqRIGXAGCa9MQBAKCEJRKSFMAK1BEHGCgBZCdWAIqRIGXAGCa9MQBAKCIJRKSFMAK2BIC8cWAIqRIAKCLJRKMABAICGrCBAICFrCFZl9zALCNJAICFZCGWqHI8oGBJHG87FBAIAGjGBABCGJRBAFCaJHFQBMMCBC99AKAE6yRKMAKM/xLGEaK978jUUUUBCAlHE8kUUUUBGXGXAGCI9HQBGXAFC98ZHI9FQBABRGCBRLEXAGAGDBBBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMBBAGCTJRGALCIJHLAI9JQBMMAIAF9PQFAEAFCEZHLCGWHGqCBCTAGl/8MBAEABAICGWJHIAG/8cBBGXAL9FQBAEAEDBIBHKCiD+rFCiD+sFD/6FHOAKCND+rFCiD+sFD/6FAOD/gFAKCTD+rFCiD+sFD/6FHND/gFD/kFD/lFHVCBDtD+2FHcAOCUUUU94DtHMD9OD9RD/kFHO9DBB/+hDYAOAOD/mFAVAVD/mFANAcANAMD9OD9RD/kFHOAOD/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHcD/kFCgFDtD9OAKCUUU94DtD9OD9QAOAND/mFAcD/kFCND+rFCU/+EDtD9OD9QAVAND/mFAcD/kFCTD+rFCUU/8ODtD9OD9QDMIBMAIAEAG/8cBBSFMABAFC98ZHGT+HUUUBAGAF9PQBAEAFCEZHICEWHLJCBCAALl/8MBAEABAGCEWJHGAL/8cBBAEAIT+HUUUBAGAEAL/8cBBMAECAJ8kUUUUBM+yEGGaO97GXAF9FQBCBRGEXABCTJHEAEDBBBHICBDtHLCUU98D8cFCUU98D8cEHKD9OABDBBBHOAIDQILKOSQfbPden8c8d8e8fCggFDtD9OD/6FAOAIDQBFGENVcMTtmYi8ZpyHICTD+sFD/6FHND/gFAICTD+rFCTD+sFD/6FHVD/gFD/kFD/lFHI9DB/+g6DYAVAIALD+2FHLAVCUUUU94DtHcD9OD9RD/kFHVAVD/mFAIAID/mFANALANAcD9OD9RD/kFHIAID/mFD/kFD/kFD/jFD/nFHND/mF9DBBX9LDYHLD/kFCTD+rFAVAND/mFALD/kFCggEDtD9OD9QHVAIAND/mFALD/kFCaDbCBDnGCBDnECBDnKCBDnOCBDncCBDnMCBDnfCBDnbD9OHIDQNVi8ZcMpySQ8c8dfb8e8fD9QDMBBABAOAKD9OAVAIDQBFTtGEmYILPdKOenD9QDMBBABCAJRBAGCIJHGAF9JQBMMM94FEa8jUUUUBCAlHE8kUUUUBABAFC98ZHIT+JUUUBGXAIAF9PQBAEAFCEZHLCEWHFJCBCAAFl/8MBAEABAICEWJHBAF/8cBBAEALT+JUUUBABAEAF/8cBBMAECAJ8kUUUUBM/hEIGaF97FaL978jUUUUBCTlRGGXAF9FQBCBREEXAGABDBBBHIABCTJHLDBBBHKDQILKOSQfbPden8c8d8e8fHOCTD+sFHNCID+rFDMIBAB9DBBU8/DY9D/zI818/DYANCEDtD9QD/6FD/nFHNAIAKDQBFGENVcMTtmYi8ZpyHICTD+rFCTD+sFD/6FD/mFHKAKD/mFANAICTD+sFD/6FD/mFHVAVD/mFANAOCTD+rFCTD+sFD/6FD/mFHOAOD/mFD/kFD/kFD/lFCBDtD+4FD/jF9DB/+g6DYHND/mF9DBBX9LDYHID/kFCggEDtHcD9OAVAND/mFAID/kFCTD+rFD9QHVAOAND/mFAID/kFCTD+rFAKAND/mFAID/kFAcD9OD9QHNDQBFTtGEmYILPdKOenHID8dBAGDBIBDyB+t+J83EBABCNJAID8dFAGDBIBDyF+t+J83EBALAVANDQNVi8ZcMpySQ8c8dfb8e8fHND8dBAGDBIBDyG+t+J83EBABCiJAND8dFAGDBIBDyE+t+J83EBABCAJRBAECIJHEAF9JQBMMM/3FGEaF978jUUUUBCoBlREGXAGCGrAF9sHIC98ZHL9FQBCBRGABRFEXAFAFDBBBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMBBAFCTJRFAGCIJHGAL9JQBMMGXALAI9PQBAEAICEZHGCGWHFqCBCoBAFl/8MBAEABALCGWJHLAF/8cBBGXAG9FQBAEAEDBIBHKCND+rFCND+sFD/6FAKCiD+sFCnD+rFCUUU/8EDtD+uFD/mFDMIBMALAEAF/8cBBMM9TFEaCBCB8oGUkUUBHFABCEJC98ZJHBjGUkUUBGXGXAB8/BCTWHGuQBCaREABAGlCggEJCTrXBCa6QFMAFREMAEMMMFBCUNMIT9tBB';
const detector = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 3, 2, 0, 0, 5, 3, 1, 0, 1, 12, 1, 0, 10, 22, 2, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11, 7, 0, 65, 0, 253, 15, 26, 11]);
const wasmpack = new Uint8Array([32, 0, 65, 253, 3, 1, 2, 34, 4, 106, 6, 5, 11, 8, 7, 20, 13, 33, 12, 16, 128, 9, 116, 64, 19, 113, 127, 15, 10, 21, 22, 14, 255, 66, 24, 54, 136, 107, 18, 23, 192, 26, 114, 118, 132, 17, 77, 101, 130, 144, 27, 87, 131, 44, 45, 74, 156, 154, 70, 167]);
const FILTERS = {
  0: '',
  1: 'meshopt_decodeFilterOct',
  2: 'meshopt_decodeFilterQuat',
  3: 'meshopt_decodeFilterExp',
  NONE: '',
  OCTAHEDRAL: 'meshopt_decodeFilterOct',
  QUATERNION: 'meshopt_decodeFilterQuat',
  EXPONENTIAL: 'meshopt_decodeFilterExp'
};
const DECODERS = {
  0: 'meshopt_decodeVertexBuffer',
  1: 'meshopt_decodeIndexBuffer',
  2: 'meshopt_decodeIndexSequence',
  ATTRIBUTES: 'meshopt_decodeVertexBuffer',
  TRIANGLES: 'meshopt_decodeIndexBuffer',
  INDICES: 'meshopt_decodeIndexSequence'
};
async function meshoptDecodeGltfBuffer(target, count, size, source, mode) {
  let filter = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'NONE';
  const instance = await loadWasmInstance();
  decode$7(instance, instance.exports[DECODERS[mode]], target, count, size, source, instance.exports[FILTERS[filter || 'NONE']]);
}
let wasmPromise;
async function loadWasmInstance() {
  if (!wasmPromise) {
    wasmPromise = loadWasmModule();
  }
  return wasmPromise;
}
async function loadWasmModule() {
  let wasm = wasm_base;
  if (WebAssembly.validate(detector)) {
    wasm = wasm_simd;
    console.log('Warning: meshopt_decoder is using experimental SIMD support');
  }
  const result = await WebAssembly.instantiate(unpack(wasm), {});
  await result.instance.exports.__wasm_call_ctors();
  return result.instance;
}
function unpack(data) {
  const result = new Uint8Array(data.length);
  for (let i = 0; i < data.length; ++i) {
    const ch = data.charCodeAt(i);
    result[i] = ch > 96 ? ch - 71 : ch > 64 ? ch - 65 : ch > 47 ? ch + 4 : ch > 46 ? 63 : 62;
  }
  let write = 0;
  for (let i = 0; i < data.length; ++i) {
    result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
  }
  return result.buffer.slice(0, write);
}
function decode$7(instance, fun, target, count, size, source, filter) {
  const sbrk = instance.exports.sbrk;
  const count4 = count + 3 & ~3;
  const tp = sbrk(count4 * size);
  const sp = sbrk(source.length);
  const heap = new Uint8Array(instance.exports.memory.buffer);
  heap.set(source, sp);
  const res = fun(tp, count, size, sp, source.length);
  if (res === 0 && filter) {
    filter(tp, count4, size);
  }
  target.set(heap.subarray(tp, tp + count * size));
  sbrk(tp - sbrk(0));
  if (res !== 0) {
    throw new Error("Malformed buffer data: ".concat(res));
  }
}

const EXT_MESHOPT_COMPRESSION = 'EXT_meshopt_compression';
const name$8 = EXT_MESHOPT_COMPRESSION;
async function decode$6(gltfData, options) {
  var _options$gltf;
  const scenegraph = new GLTFScenegraph(gltfData);
  if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.decompressMeshes)) {
    return;
  }
  const promises = [];
  for (const bufferViewIndex of gltfData.json.bufferViews || []) {
    promises.push(decodeMeshoptBufferView(scenegraph, bufferViewIndex));
  }
  await Promise.all(promises);
  scenegraph.removeExtension(EXT_MESHOPT_COMPRESSION);
}
async function decodeMeshoptBufferView(scenegraph, bufferView) {
  const meshoptExtension = scenegraph.getObjectExtension(bufferView, EXT_MESHOPT_COMPRESSION);
  if (meshoptExtension) {
    const {
      byteOffset = 0,
      byteLength = 0,
      byteStride,
      count,
      mode,
      filter = 'NONE',
      buffer: bufferIndex
    } = meshoptExtension;
    const buffer = scenegraph.gltf.buffers[bufferIndex];
    const source = new Uint8Array(buffer.arrayBuffer, buffer.byteOffset + byteOffset, byteLength);
    const result = new Uint8Array(scenegraph.gltf.buffers[bufferView.buffer].arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
    await meshoptDecodeGltfBuffer(result, count, byteStride, source, mode, filter);
    return result;
  }
  return null;
}

var EXT_meshopt_compression = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$8,
    decode: decode$6
});

const EXT_TEXTURE_WEBP = 'EXT_texture_webp';
const name$7 = EXT_TEXTURE_WEBP;
function preprocess$3(gltfData, options) {
  const scenegraph = new GLTFScenegraph(gltfData);
  if (!isImageFormatSupported('image/webp')) {
    if (scenegraph.getRequiredExtensions().includes(EXT_TEXTURE_WEBP)) {
      throw new Error("gltf: Required extension ".concat(EXT_TEXTURE_WEBP, " not supported by browser"));
    }
    return;
  }
  const {
    json
  } = scenegraph;
  for (const texture of json.textures || []) {
    const extension = scenegraph.getObjectExtension(texture, EXT_TEXTURE_WEBP);
    if (extension) {
      texture.source = extension.source;
    }
    scenegraph.removeObjectExtension(texture, EXT_TEXTURE_WEBP);
  }
  scenegraph.removeExtension(EXT_TEXTURE_WEBP);
}

var EXT_texture_webp = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$7,
    preprocess: preprocess$3
});

const KHR_TEXTURE_BASISU = 'KHR_texture_basisu';
const name$6 = KHR_TEXTURE_BASISU;
function preprocess$2(gltfData, options) {
  const scene = new GLTFScenegraph(gltfData);
  const {
    json
  } = scene;
  for (const texture of json.textures || []) {
    const extension = scene.getObjectExtension(texture, KHR_TEXTURE_BASISU);
    if (extension) {
      texture.source = extension.source;
    }
    scene.removeObjectExtension(texture, KHR_TEXTURE_BASISU);
  }
  scene.removeExtension(KHR_TEXTURE_BASISU);
}

var KHR_texture_basisu = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$6,
    preprocess: preprocess$2
});

const VERSION = "3.4.14" ;

const DEFAULT_DRACO_OPTIONS = {
  draco: {
    decoderType: typeof WebAssembly === 'object' ? 'wasm' : 'js',
    libraryPath: 'libs/',
    extraAttributes: {},
    attributeNameEntry: undefined
  }
};
const DracoLoader$1 = {
  name: 'Draco',
  id: isBrowser$1 ? 'draco' : 'draco-nodejs',
  module: 'draco',
  shapes: ['mesh'],
  version: VERSION,
  worker: true,
  extensions: ['drc'],
  mimeTypes: ['application/octet-stream'],
  binary: true,
  tests: ['DRACO'],
  options: DEFAULT_DRACO_OPTIONS
};

function getMeshBoundingBox(attributes) {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const positions = attributes.POSITION ? attributes.POSITION.value : [];
  const len = positions && positions.length;
  for (let i = 0; i < len; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    minX = x < minX ? x : minX;
    minY = y < minY ? y : minY;
    minZ = z < minZ ? z : minZ;
    maxX = x > maxX ? x : maxX;
    maxY = y > maxY ? y : maxY;
    maxZ = z > maxZ ? z : maxZ;
  }
  return [[minX, minY, minZ], [maxX, maxY, maxZ]];
}

function assert$1(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}

class Schema {
  constructor(fields, metadata) {
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "metadata", void 0);
    assert$1(Array.isArray(fields));
    checkNames(fields);
    this.fields = fields;
    this.metadata = metadata || new Map();
  }
  compareTo(other) {
    if (this.metadata !== other.metadata) {
      return false;
    }
    if (this.fields.length !== other.fields.length) {
      return false;
    }
    for (let i = 0; i < this.fields.length; ++i) {
      if (!this.fields[i].compareTo(other.fields[i])) {
        return false;
      }
    }
    return true;
  }
  select() {
    const nameMap = Object.create(null);
    for (var _len = arguments.length, columnNames = new Array(_len), _key = 0; _key < _len; _key++) {
      columnNames[_key] = arguments[_key];
    }
    for (const name of columnNames) {
      nameMap[name] = true;
    }
    const selectedFields = this.fields.filter(field => nameMap[field.name]);
    return new Schema(selectedFields, this.metadata);
  }
  selectAt() {
    for (var _len2 = arguments.length, columnIndices = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      columnIndices[_key2] = arguments[_key2];
    }
    const selectedFields = columnIndices.map(index => this.fields[index]).filter(Boolean);
    return new Schema(selectedFields, this.metadata);
  }
  assign(schemaOrFields) {
    let fields;
    let metadata = this.metadata;
    if (schemaOrFields instanceof Schema) {
      const otherSchema = schemaOrFields;
      fields = otherSchema.fields;
      metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherSchema.metadata);
    } else {
      fields = schemaOrFields;
    }
    const fieldMap = Object.create(null);
    for (const field of this.fields) {
      fieldMap[field.name] = field;
    }
    for (const field of fields) {
      fieldMap[field.name] = field;
    }
    const mergedFields = Object.values(fieldMap);
    return new Schema(mergedFields, metadata);
  }
}
function checkNames(fields) {
  const usedNames = {};
  for (const field of fields) {
    if (usedNames[field.name]) {
      console.warn('Schema: duplicated field name', field.name, field);
    }
    usedNames[field.name] = true;
  }
}
function mergeMaps(m1, m2) {
  return new Map([...(m1 || new Map()), ...(m2 || new Map())]);
}

class Field {
  constructor(name, type) {
    let nullable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Map();
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "nullable", void 0);
    _defineProperty(this, "metadata", void 0);
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.metadata = metadata;
  }
  get typeId() {
    return this.type && this.type.typeId;
  }
  clone() {
    return new Field(this.name, this.type, this.nullable, this.metadata);
  }
  compareTo(other) {
    return this.name === other.name && this.type === other.type && this.nullable === other.nullable && this.metadata === other.metadata;
  }
  toString() {
    return "".concat(this.type).concat(this.nullable ? ', nullable' : '').concat(this.metadata ? ", metadata: ".concat(this.metadata) : '');
  }
}

let Type = function (Type) {
  Type[Type["NONE"] = 0] = "NONE";
  Type[Type["Null"] = 1] = "Null";
  Type[Type["Int"] = 2] = "Int";
  Type[Type["Float"] = 3] = "Float";
  Type[Type["Binary"] = 4] = "Binary";
  Type[Type["Utf8"] = 5] = "Utf8";
  Type[Type["Bool"] = 6] = "Bool";
  Type[Type["Decimal"] = 7] = "Decimal";
  Type[Type["Date"] = 8] = "Date";
  Type[Type["Time"] = 9] = "Time";
  Type[Type["Timestamp"] = 10] = "Timestamp";
  Type[Type["Interval"] = 11] = "Interval";
  Type[Type["List"] = 12] = "List";
  Type[Type["Struct"] = 13] = "Struct";
  Type[Type["Union"] = 14] = "Union";
  Type[Type["FixedSizeBinary"] = 15] = "FixedSizeBinary";
  Type[Type["FixedSizeList"] = 16] = "FixedSizeList";
  Type[Type["Map"] = 17] = "Map";
  Type[Type["Dictionary"] = -1] = "Dictionary";
  Type[Type["Int8"] = -2] = "Int8";
  Type[Type["Int16"] = -3] = "Int16";
  Type[Type["Int32"] = -4] = "Int32";
  Type[Type["Int64"] = -5] = "Int64";
  Type[Type["Uint8"] = -6] = "Uint8";
  Type[Type["Uint16"] = -7] = "Uint16";
  Type[Type["Uint32"] = -8] = "Uint32";
  Type[Type["Uint64"] = -9] = "Uint64";
  Type[Type["Float16"] = -10] = "Float16";
  Type[Type["Float32"] = -11] = "Float32";
  Type[Type["Float64"] = -12] = "Float64";
  Type[Type["DateDay"] = -13] = "DateDay";
  Type[Type["DateMillisecond"] = -14] = "DateMillisecond";
  Type[Type["TimestampSecond"] = -15] = "TimestampSecond";
  Type[Type["TimestampMillisecond"] = -16] = "TimestampMillisecond";
  Type[Type["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
  Type[Type["TimestampNanosecond"] = -18] = "TimestampNanosecond";
  Type[Type["TimeSecond"] = -19] = "TimeSecond";
  Type[Type["TimeMillisecond"] = -20] = "TimeMillisecond";
  Type[Type["TimeMicrosecond"] = -21] = "TimeMicrosecond";
  Type[Type["TimeNanosecond"] = -22] = "TimeNanosecond";
  Type[Type["DenseUnion"] = -23] = "DenseUnion";
  Type[Type["SparseUnion"] = -24] = "SparseUnion";
  Type[Type["IntervalDayTime"] = -25] = "IntervalDayTime";
  Type[Type["IntervalYearMonth"] = -26] = "IntervalYearMonth";
  return Type;
}({});

let _Symbol$toStringTag, _Symbol$toStringTag2, _Symbol$toStringTag7;
class DataType {
  static isNull(x) {
    return x && x.typeId === Type.Null;
  }
  static isInt(x) {
    return x && x.typeId === Type.Int;
  }
  static isFloat(x) {
    return x && x.typeId === Type.Float;
  }
  static isBinary(x) {
    return x && x.typeId === Type.Binary;
  }
  static isUtf8(x) {
    return x && x.typeId === Type.Utf8;
  }
  static isBool(x) {
    return x && x.typeId === Type.Bool;
  }
  static isDecimal(x) {
    return x && x.typeId === Type.Decimal;
  }
  static isDate(x) {
    return x && x.typeId === Type.Date;
  }
  static isTime(x) {
    return x && x.typeId === Type.Time;
  }
  static isTimestamp(x) {
    return x && x.typeId === Type.Timestamp;
  }
  static isInterval(x) {
    return x && x.typeId === Type.Interval;
  }
  static isList(x) {
    return x && x.typeId === Type.List;
  }
  static isStruct(x) {
    return x && x.typeId === Type.Struct;
  }
  static isUnion(x) {
    return x && x.typeId === Type.Union;
  }
  static isFixedSizeBinary(x) {
    return x && x.typeId === Type.FixedSizeBinary;
  }
  static isFixedSizeList(x) {
    return x && x.typeId === Type.FixedSizeList;
  }
  static isMap(x) {
    return x && x.typeId === Type.Map;
  }
  static isDictionary(x) {
    return x && x.typeId === Type.Dictionary;
  }
  get typeId() {
    return Type.NONE;
  }
  compareTo(other) {
    return this === other;
  }
}
_Symbol$toStringTag = Symbol.toStringTag;
class Int extends DataType {
  constructor(isSigned, bitWidth) {
    super();
    _defineProperty(this, "isSigned", void 0);
    _defineProperty(this, "bitWidth", void 0);
    this.isSigned = isSigned;
    this.bitWidth = bitWidth;
  }
  get typeId() {
    return Type.Int;
  }
  get [_Symbol$toStringTag]() {
    return 'Int';
  }
  toString() {
    return "".concat(this.isSigned ? 'I' : 'Ui', "nt").concat(this.bitWidth);
  }
}
class Int8 extends Int {
  constructor() {
    super(true, 8);
  }
}
class Int16 extends Int {
  constructor() {
    super(true, 16);
  }
}
class Int32 extends Int {
  constructor() {
    super(true, 32);
  }
}
class Uint8 extends Int {
  constructor() {
    super(false, 8);
  }
}
class Uint16 extends Int {
  constructor() {
    super(false, 16);
  }
}
class Uint32 extends Int {
  constructor() {
    super(false, 32);
  }
}
const Precision = {
  HALF: 16,
  SINGLE: 32,
  DOUBLE: 64
};
_Symbol$toStringTag2 = Symbol.toStringTag;
class Float extends DataType {
  constructor(precision) {
    super();
    _defineProperty(this, "precision", void 0);
    this.precision = precision;
  }
  get typeId() {
    return Type.Float;
  }
  get [_Symbol$toStringTag2]() {
    return 'Float';
  }
  toString() {
    return "Float".concat(this.precision);
  }
}
class Float32 extends Float {
  constructor() {
    super(Precision.SINGLE);
  }
}
class Float64 extends Float {
  constructor() {
    super(Precision.DOUBLE);
  }
}
_Symbol$toStringTag7 = Symbol.toStringTag;
class FixedSizeList extends DataType {
  constructor(listSize, child) {
    super();
    _defineProperty(this, "listSize", void 0);
    _defineProperty(this, "children", void 0);
    this.listSize = listSize;
    this.children = [child];
  }
  get typeId() {
    return Type.FixedSizeList;
  }
  get valueType() {
    return this.children[0].type;
  }
  get valueField() {
    return this.children[0];
  }
  get [_Symbol$toStringTag7]() {
    return 'FixedSizeList';
  }
  toString() {
    return "FixedSizeList[".concat(this.listSize, "]<").concat(this.valueType, ">");
  }
}

function getArrowTypeFromTypedArray(array) {
  switch (array.constructor) {
    case Int8Array:
      return new Int8();
    case Uint8Array:
      return new Uint8();
    case Int16Array:
      return new Int16();
    case Uint16Array:
      return new Uint16();
    case Int32Array:
      return new Int32();
    case Uint32Array:
      return new Uint32();
    case Float32Array:
      return new Float32();
    case Float64Array:
      return new Float64();
    default:
      throw new Error('array type not supported');
  }
}

function deduceMeshField(attributeName, attribute, optionalMetadata) {
  const type = getArrowTypeFromTypedArray(attribute.value);
  const metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
  const field = new Field(attributeName, new FixedSizeList(attribute.size, new Field('value', type)), false, metadata);
  return field;
}
function makeMeshAttributeMetadata(attribute) {
  const result = new Map();
  if ('byteOffset' in attribute) {
    result.set('byteOffset', attribute.byteOffset.toString(10));
  }
  if ('byteStride' in attribute) {
    result.set('byteStride', attribute.byteStride.toString(10));
  }
  if ('normalized' in attribute) {
    result.set('normalized', attribute.normalized.toString());
  }
  return result;
}

function getDracoSchema(attributes, loaderData, indices) {
  const metadataMap = makeMetadata(loaderData.metadata);
  const fields = [];
  const namedLoaderDataAttributes = transformAttributesLoaderData(loaderData.attributes);
  for (const attributeName in attributes) {
    const attribute = attributes[attributeName];
    const field = getArrowFieldFromAttribute(attributeName, attribute, namedLoaderDataAttributes[attributeName]);
    fields.push(field);
  }
  if (indices) {
    const indicesField = getArrowFieldFromAttribute('indices', indices);
    fields.push(indicesField);
  }
  return new Schema(fields, metadataMap);
}
function transformAttributesLoaderData(loaderData) {
  const result = {};
  for (const key in loaderData) {
    const dracoAttribute = loaderData[key];
    result[dracoAttribute.name || 'undefined'] = dracoAttribute;
  }
  return result;
}
function getArrowFieldFromAttribute(attributeName, attribute, loaderData) {
  const metadataMap = loaderData ? makeMetadata(loaderData.metadata) : undefined;
  const field = deduceMeshField(attributeName, attribute, metadataMap);
  return field;
}
function makeMetadata(metadata) {
  const metadataMap = new Map();
  for (const key in metadata) {
    metadataMap.set("".concat(key, ".string"), JSON.stringify(metadata[key]));
  }
  return metadataMap;
}

const DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP = {
  POSITION: 'POSITION',
  NORMAL: 'NORMAL',
  COLOR: 'COLOR_0',
  TEX_COORD: 'TEXCOORD_0'
};
const DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP = {
  1: Int8Array,
  2: Uint8Array,
  3: Int16Array,
  4: Uint16Array,
  5: Int32Array,
  6: Uint32Array,
  9: Float32Array
};
const INDEX_ITEM_SIZE = 4;
class DracoParser {
  constructor(draco) {
    _defineProperty(this, "draco", void 0);
    _defineProperty(this, "decoder", void 0);
    _defineProperty(this, "metadataQuerier", void 0);
    this.draco = draco;
    this.decoder = new this.draco.Decoder();
    this.metadataQuerier = new this.draco.MetadataQuerier();
  }
  destroy() {
    this.draco.destroy(this.decoder);
    this.draco.destroy(this.metadataQuerier);
  }
  parseSync(arrayBuffer) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const buffer = new this.draco.DecoderBuffer();
    buffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);
    this._disableAttributeTransforms(options);
    const geometry_type = this.decoder.GetEncodedGeometryType(buffer);
    const dracoGeometry = geometry_type === this.draco.TRIANGULAR_MESH ? new this.draco.Mesh() : new this.draco.PointCloud();
    try {
      let dracoStatus;
      switch (geometry_type) {
        case this.draco.TRIANGULAR_MESH:
          dracoStatus = this.decoder.DecodeBufferToMesh(buffer, dracoGeometry);
          break;
        case this.draco.POINT_CLOUD:
          dracoStatus = this.decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
          break;
        default:
          throw new Error('DRACO: Unknown geometry type.');
      }
      if (!dracoStatus.ok() || !dracoGeometry.ptr) {
        const message = "DRACO decompression failed: ".concat(dracoStatus.error_msg());
        throw new Error(message);
      }
      const loaderData = this._getDracoLoaderData(dracoGeometry, geometry_type, options);
      const geometry = this._getMeshData(dracoGeometry, loaderData, options);
      const boundingBox = getMeshBoundingBox(geometry.attributes);
      const schema = getDracoSchema(geometry.attributes, loaderData, geometry.indices);
      const data = {
        loader: 'draco',
        loaderData,
        header: {
          vertexCount: dracoGeometry.num_points(),
          boundingBox
        },
        ...geometry,
        schema
      };
      return data;
    } finally {
      this.draco.destroy(buffer);
      if (dracoGeometry) {
        this.draco.destroy(dracoGeometry);
      }
    }
  }
  _getDracoLoaderData(dracoGeometry, geometry_type, options) {
    const metadata = this._getTopLevelMetadata(dracoGeometry);
    const attributes = this._getDracoAttributes(dracoGeometry, options);
    return {
      geometry_type,
      num_attributes: dracoGeometry.num_attributes(),
      num_points: dracoGeometry.num_points(),
      num_faces: dracoGeometry instanceof this.draco.Mesh ? dracoGeometry.num_faces() : 0,
      metadata,
      attributes
    };
  }
  _getDracoAttributes(dracoGeometry, options) {
    const dracoAttributes = {};
    for (let attributeId = 0; attributeId < dracoGeometry.num_attributes(); attributeId++) {
      const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attributeId);
      const metadata = this._getAttributeMetadata(dracoGeometry, attributeId);
      dracoAttributes[dracoAttribute.unique_id()] = {
        unique_id: dracoAttribute.unique_id(),
        attribute_type: dracoAttribute.attribute_type(),
        data_type: dracoAttribute.data_type(),
        num_components: dracoAttribute.num_components(),
        byte_offset: dracoAttribute.byte_offset(),
        byte_stride: dracoAttribute.byte_stride(),
        normalized: dracoAttribute.normalized(),
        attribute_index: attributeId,
        metadata
      };
      const quantization = this._getQuantizationTransform(dracoAttribute, options);
      if (quantization) {
        dracoAttributes[dracoAttribute.unique_id()].quantization_transform = quantization;
      }
      const octahedron = this._getOctahedronTransform(dracoAttribute, options);
      if (octahedron) {
        dracoAttributes[dracoAttribute.unique_id()].octahedron_transform = octahedron;
      }
    }
    return dracoAttributes;
  }
  _getMeshData(dracoGeometry, loaderData, options) {
    const attributes = this._getMeshAttributes(loaderData, dracoGeometry, options);
    const positionAttribute = attributes.POSITION;
    if (!positionAttribute) {
      throw new Error('DRACO: No position attribute found.');
    }
    if (dracoGeometry instanceof this.draco.Mesh) {
      switch (options.topology) {
        case 'triangle-strip':
          return {
            topology: 'triangle-strip',
            mode: 4,
            attributes,
            indices: {
              value: this._getTriangleStripIndices(dracoGeometry),
              size: 1
            }
          };
        case 'triangle-list':
        default:
          return {
            topology: 'triangle-list',
            mode: 5,
            attributes,
            indices: {
              value: this._getTriangleListIndices(dracoGeometry),
              size: 1
            }
          };
      }
    }
    return {
      topology: 'point-list',
      mode: 0,
      attributes
    };
  }
  _getMeshAttributes(loaderData, dracoGeometry, options) {
    const attributes = {};
    for (const loaderAttribute of Object.values(loaderData.attributes)) {
      const attributeName = this._deduceAttributeName(loaderAttribute, options);
      loaderAttribute.name = attributeName;
      const {
        value,
        size
      } = this._getAttributeValues(dracoGeometry, loaderAttribute);
      attributes[attributeName] = {
        value,
        size,
        byteOffset: loaderAttribute.byte_offset,
        byteStride: loaderAttribute.byte_stride,
        normalized: loaderAttribute.normalized
      };
    }
    return attributes;
  }
  _getTriangleListIndices(dracoGeometry) {
    const numFaces = dracoGeometry.num_faces();
    const numIndices = numFaces * 3;
    const byteLength = numIndices * INDEX_ITEM_SIZE;
    const ptr = this.draco._malloc(byteLength);
    try {
      this.decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
      return new Uint32Array(this.draco.HEAPF32.buffer, ptr, numIndices).slice();
    } finally {
      this.draco._free(ptr);
    }
  }
  _getTriangleStripIndices(dracoGeometry) {
    const dracoArray = new this.draco.DracoInt32Array();
    try {
      this.decoder.GetTriangleStripsFromMesh(dracoGeometry, dracoArray);
      return getUint32Array(dracoArray);
    } finally {
      this.draco.destroy(dracoArray);
    }
  }
  _getAttributeValues(dracoGeometry, attribute) {
    const TypedArrayCtor = DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP[attribute.data_type];
    const numComponents = attribute.num_components;
    const numPoints = dracoGeometry.num_points();
    const numValues = numPoints * numComponents;
    const byteLength = numValues * TypedArrayCtor.BYTES_PER_ELEMENT;
    const dataType = getDracoDataType(this.draco, TypedArrayCtor);
    let value;
    const ptr = this.draco._malloc(byteLength);
    try {
      const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attribute.attribute_index);
      this.decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, dracoAttribute, dataType, byteLength, ptr);
      value = new TypedArrayCtor(this.draco.HEAPF32.buffer, ptr, numValues).slice();
    } finally {
      this.draco._free(ptr);
    }
    return {
      value,
      size: numComponents
    };
  }
  _deduceAttributeName(attribute, options) {
    const uniqueId = attribute.unique_id;
    for (const [attributeName, attributeUniqueId] of Object.entries(options.extraAttributes || {})) {
      if (attributeUniqueId === uniqueId) {
        return attributeName;
      }
    }
    const thisAttributeType = attribute.attribute_type;
    for (const dracoAttributeConstant in DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP) {
      const attributeType = this.draco[dracoAttributeConstant];
      if (attributeType === thisAttributeType) {
        return DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP[dracoAttributeConstant];
      }
    }
    const entryName = options.attributeNameEntry || 'name';
    if (attribute.metadata[entryName]) {
      return attribute.metadata[entryName].string;
    }
    return "CUSTOM_ATTRIBUTE_".concat(uniqueId);
  }
  _getTopLevelMetadata(dracoGeometry) {
    const dracoMetadata = this.decoder.GetMetadata(dracoGeometry);
    return this._getDracoMetadata(dracoMetadata);
  }
  _getAttributeMetadata(dracoGeometry, attributeId) {
    const dracoMetadata = this.decoder.GetAttributeMetadata(dracoGeometry, attributeId);
    return this._getDracoMetadata(dracoMetadata);
  }
  _getDracoMetadata(dracoMetadata) {
    if (!dracoMetadata || !dracoMetadata.ptr) {
      return {};
    }
    const result = {};
    const numEntries = this.metadataQuerier.NumEntries(dracoMetadata);
    for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
      const entryName = this.metadataQuerier.GetEntryName(dracoMetadata, entryIndex);
      result[entryName] = this._getDracoMetadataField(dracoMetadata, entryName);
    }
    return result;
  }
  _getDracoMetadataField(dracoMetadata, entryName) {
    const dracoArray = new this.draco.DracoInt32Array();
    try {
      this.metadataQuerier.GetIntEntryArray(dracoMetadata, entryName, dracoArray);
      const intArray = getInt32Array(dracoArray);
      return {
        int: this.metadataQuerier.GetIntEntry(dracoMetadata, entryName),
        string: this.metadataQuerier.GetStringEntry(dracoMetadata, entryName),
        double: this.metadataQuerier.GetDoubleEntry(dracoMetadata, entryName),
        intArray
      };
    } finally {
      this.draco.destroy(dracoArray);
    }
  }
  _disableAttributeTransforms(options) {
    const {
      quantizedAttributes = [],
      octahedronAttributes = []
    } = options;
    const skipAttributes = [...quantizedAttributes, ...octahedronAttributes];
    for (const dracoAttributeName of skipAttributes) {
      this.decoder.SkipAttributeTransform(this.draco[dracoAttributeName]);
    }
  }
  _getQuantizationTransform(dracoAttribute, options) {
    const {
      quantizedAttributes = []
    } = options;
    const attribute_type = dracoAttribute.attribute_type();
    const skip = quantizedAttributes.map(type => this.decoder[type]).includes(attribute_type);
    if (skip) {
      const transform = new this.draco.AttributeQuantizationTransform();
      try {
        if (transform.InitFromAttribute(dracoAttribute)) {
          return {
            quantization_bits: transform.quantization_bits(),
            range: transform.range(),
            min_values: new Float32Array([1, 2, 3]).map(i => transform.min_value(i))
          };
        }
      } finally {
        this.draco.destroy(transform);
      }
    }
    return null;
  }
  _getOctahedronTransform(dracoAttribute, options) {
    const {
      octahedronAttributes = []
    } = options;
    const attribute_type = dracoAttribute.attribute_type();
    const octahedron = octahedronAttributes.map(type => this.decoder[type]).includes(attribute_type);
    if (octahedron) {
      const transform = new this.draco.AttributeQuantizationTransform();
      try {
        if (transform.InitFromAttribute(dracoAttribute)) {
          return {
            quantization_bits: transform.quantization_bits()
          };
        }
      } finally {
        this.draco.destroy(transform);
      }
    }
    return null;
  }
}
function getDracoDataType(draco, attributeType) {
  switch (attributeType) {
    case Float32Array:
      return draco.DT_FLOAT32;
    case Int8Array:
      return draco.DT_INT8;
    case Int16Array:
      return draco.DT_INT16;
    case Int32Array:
      return draco.DT_INT32;
    case Uint8Array:
      return draco.DT_UINT8;
    case Uint16Array:
      return draco.DT_UINT16;
    case Uint32Array:
      return draco.DT_UINT32;
    default:
      return draco.DT_INVALID;
  }
}
function getInt32Array(dracoArray) {
  const numValues = dracoArray.size();
  const intArray = new Int32Array(numValues);
  for (let i = 0; i < numValues; i++) {
    intArray[i] = dracoArray.GetValue(i);
  }
  return intArray;
}
function getUint32Array(dracoArray) {
  const numValues = dracoArray.size();
  const intArray = new Int32Array(numValues);
  for (let i = 0; i < numValues; i++) {
    intArray[i] = dracoArray.GetValue(i);
  }
  return intArray;
}

const DRACO_DECODER_VERSION = '1.5.5';
const STATIC_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/".concat(DRACO_DECODER_VERSION);
const DRACO_JS_DECODER_URL = "".concat(STATIC_DECODER_URL, "/draco_decoder.js");
const DRACO_WASM_WRAPPER_URL = "".concat(STATIC_DECODER_URL, "/draco_wasm_wrapper.js");
const DRACO_WASM_DECODER_URL = "".concat(STATIC_DECODER_URL, "/draco_decoder.wasm");
let loadDecoderPromise;
async function loadDracoDecoderModule(options) {
  const modules = options.modules || {};
  if (modules.draco3d) {
    loadDecoderPromise = loadDecoderPromise || modules.draco3d.createDecoderModule({}).then(draco => {
      return {
        draco
      };
    });
  } else {
    loadDecoderPromise = loadDecoderPromise || loadDracoDecoder(options);
  }
  return await loadDecoderPromise;
}
async function loadDracoDecoder(options) {
  let DracoDecoderModule;
  let wasmBinary;
  switch (options.draco && options.draco.decoderType) {
    case 'js':
      DracoDecoderModule = await loadLibrary(DRACO_JS_DECODER_URL, 'draco', options);
      break;
    case 'wasm':
    default:
      [DracoDecoderModule, wasmBinary] = await Promise.all([await loadLibrary(DRACO_WASM_WRAPPER_URL, 'draco', options), await loadLibrary(DRACO_WASM_DECODER_URL, 'draco', options)]);
  }
  DracoDecoderModule = DracoDecoderModule || globalThis.DracoDecoderModule;
  return await initializeDracoDecoder(DracoDecoderModule, wasmBinary);
}
function initializeDracoDecoder(DracoDecoderModule, wasmBinary) {
  const options = {};
  if (wasmBinary) {
    options.wasmBinary = wasmBinary;
  }
  return new Promise(resolve => {
    DracoDecoderModule({
      ...options,
      onModuleLoaded: draco => resolve({
        draco
      })
    });
  });
}

({
  id: isBrowser$1 ? 'draco-writer' : 'draco-writer-nodejs',
  name: 'Draco compressed geometry writer',
  module: 'draco',
  version: VERSION,
  worker: true,
  options: {
    draco: {},
    source: null
  }
});
const DracoLoader = {
  ...DracoLoader$1,
  parse: parse$1
};
async function parse$1(arrayBuffer, options) {
  const {
    draco
  } = await loadDracoDecoderModule(options);
  const dracoParser = new DracoParser(draco);
  try {
    return dracoParser.parseSync(arrayBuffer, options === null || options === void 0 ? void 0 : options.draco);
  } finally {
    dracoParser.destroy();
  }
}

function getGLTFAccessors(attributes) {
  const accessors = {};
  for (const name in attributes) {
    const attribute = attributes[name];
    if (name !== 'indices') {
      const glTFAccessor = getGLTFAccessor(attribute);
      accessors[name] = glTFAccessor;
    }
  }
  return accessors;
}
function getGLTFAccessor(attribute) {
  const {
    buffer,
    size,
    count
  } = getAccessorData(attribute);
  const glTFAccessor = {
    value: buffer,
    size,
    byteOffset: 0,
    count,
    type: getAccessorTypeFromSize(size),
    componentType: getComponentTypeFromArray(buffer)
  };
  return glTFAccessor;
}
function getAccessorData(attribute) {
  let buffer = attribute;
  let size = 1;
  let count = 0;
  if (attribute && attribute.value) {
    buffer = attribute.value;
    size = attribute.size || 1;
  }
  if (buffer) {
    if (!ArrayBuffer.isView(buffer)) {
      buffer = toTypedArray(buffer, Float32Array);
    }
    count = buffer.length / size;
  }
  return {
    buffer,
    size,
    count
  };
}
function toTypedArray(array, ArrayType) {
  let convertTypedArrays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!array) {
    return null;
  }
  if (Array.isArray(array)) {
    return new ArrayType(array);
  }
  if (convertTypedArrays && !(array instanceof ArrayType)) {
    return new ArrayType(array);
  }
  return array;
}

const KHR_DRACO_MESH_COMPRESSION = 'KHR_draco_mesh_compression';
const name$5 = KHR_DRACO_MESH_COMPRESSION;
function preprocess$1(gltfData, options, context) {
  const scenegraph = new GLTFScenegraph(gltfData);
  for (const primitive of makeMeshPrimitiveIterator(scenegraph)) {
    if (scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION)) ;
  }
}
async function decode$5(gltfData, options, context) {
  var _options$gltf;
  if (!(options !== null && options !== void 0 && (_options$gltf = options.gltf) !== null && _options$gltf !== void 0 && _options$gltf.decompressMeshes)) {
    return;
  }
  const scenegraph = new GLTFScenegraph(gltfData);
  const promises = [];
  for (const primitive of makeMeshPrimitiveIterator(scenegraph)) {
    if (scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION)) {
      promises.push(decompressPrimitive(scenegraph, primitive, options, context));
    }
  }
  await Promise.all(promises);
  scenegraph.removeExtension(KHR_DRACO_MESH_COMPRESSION);
}
function encode$3(gltfData) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const scenegraph = new GLTFScenegraph(gltfData);
  for (const mesh of scenegraph.json.meshes || []) {
    compressMesh(mesh, options);
    scenegraph.addRequiredExtension(KHR_DRACO_MESH_COMPRESSION);
  }
}
async function decompressPrimitive(scenegraph, primitive, options, context) {
  const dracoExtension = scenegraph.getObjectExtension(primitive, KHR_DRACO_MESH_COMPRESSION);
  if (!dracoExtension) {
    return;
  }
  const buffer = scenegraph.getTypedArrayForBufferView(dracoExtension.bufferView);
  const bufferCopy = sliceArrayBuffer(buffer.buffer, buffer.byteOffset);
  const {
    parse
  } = context;
  const dracoOptions = {
    ...options
  };
  delete dracoOptions['3d-tiles'];
  const decodedData = await parse(bufferCopy, DracoLoader, dracoOptions, context);
  const decodedAttributes = getGLTFAccessors(decodedData.attributes);
  for (const [attributeName, decodedAttribute] of Object.entries(decodedAttributes)) {
    if (attributeName in primitive.attributes) {
      const accessorIndex = primitive.attributes[attributeName];
      const accessor = scenegraph.getAccessor(accessorIndex);
      if (accessor !== null && accessor !== void 0 && accessor.min && accessor !== null && accessor !== void 0 && accessor.max) {
        decodedAttribute.min = accessor.min;
        decodedAttribute.max = accessor.max;
      }
    }
  }
  primitive.attributes = decodedAttributes;
  if (decodedData.indices) {
    primitive.indices = getGLTFAccessor(decodedData.indices);
  }
  checkPrimitive(primitive);
}
function compressMesh(attributes, indices) {
  var _context$parseSync;
  let mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  let options = arguments.length > 3 ? arguments[3] : undefined;
  let context = arguments.length > 4 ? arguments[4] : undefined;
  if (!options.DracoWriter) {
    throw new Error('options.gltf.DracoWriter not provided');
  }
  const compressedData = options.DracoWriter.encodeSync({
    attributes
  });
  const decodedData = context === null || context === void 0 ? void 0 : (_context$parseSync = context.parseSync) === null || _context$parseSync === void 0 ? void 0 : _context$parseSync.call(context, {
    attributes
  });
  const fauxAccessors = options._addFauxAttributes(decodedData.attributes);
  const bufferViewIndex = options.addBufferView(compressedData);
  const glTFMesh = {
    primitives: [{
      attributes: fauxAccessors,
      mode,
      extensions: {
        [KHR_DRACO_MESH_COMPRESSION]: {
          bufferView: bufferViewIndex,
          attributes: fauxAccessors
        }
      }
    }]
  };
  return glTFMesh;
}
function checkPrimitive(primitive) {
  if (!primitive.attributes && Object.keys(primitive.attributes).length > 0) {
    throw new Error('glTF: Empty primitive detected: Draco decompression failure?');
  }
}
function* makeMeshPrimitiveIterator(scenegraph) {
  for (const mesh of scenegraph.json.meshes || []) {
    for (const primitive of mesh.primitives) {
      yield primitive;
    }
  }
}

var KHR_draco_mesh_compression = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$5,
    preprocess: preprocess$1,
    decode: decode$5,
    encode: encode$3
});

function assert(condition, message) {
  if (!condition) {
    throw new Error("math.gl assertion ".concat(message));
  }
}

const config = {
  EPSILON: 1e-12,
  debug: false,
  precision: 4,
  printTypes: false,
  printDegrees: false,
  printRowMajor: true
};
function formatValue(value, {
  precision = config.precision
} = {}) {
  value = round(value);
  return "".concat(parseFloat(value.toPrecision(precision)));
}
function isArray(value) {
  return Array.isArray(value) || ArrayBuffer.isView(value) && !(value instanceof DataView);
}
function equals(a, b, epsilon) {
  const oldEpsilon = config.EPSILON;

  if (epsilon) {
    config.EPSILON = epsilon;
  }

  try {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }

      for (let i = 0; i < a.length; ++i) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    if (a && a.equals) {
      return a.equals(b);
    }

    if (b && b.equals) {
      return b.equals(a);
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return Math.abs(a - b) <= config.EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
    }

    return false;
  } finally {
    config.EPSILON = oldEpsilon;
  }
}

function round(value) {
  return Math.round(value / config.EPSILON) * config.EPSILON;
}

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}
class MathArray extends _extendableBuiltin(Array) {
  clone() {
    return new this.constructor().copy(this);
  }

  fromArray(array, offset = 0) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = array[i + offset];
    }

    return this.check();
  }

  toArray(targetArray = [], offset = 0) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      targetArray[offset + i] = this[i];
    }

    return targetArray;
  }

  from(arrayOrObject) {
    return Array.isArray(arrayOrObject) ? this.copy(arrayOrObject) : this.fromObject(arrayOrObject);
  }

  to(arrayOrObject) {
    if (arrayOrObject === this) {
      return this;
    }

    return isArray(arrayOrObject) ? this.toArray(arrayOrObject) : this.toObject(arrayOrObject);
  }

  toTarget(target) {
    return target ? this.to(target) : this;
  }

  toFloat32Array() {
    return new Float32Array(this);
  }

  toString() {
    return this.formatString(config);
  }

  formatString(opts) {
    let string = '';

    for (let i = 0; i < this.ELEMENTS; ++i) {
      string += (i > 0 ? ', ' : '') + formatValue(this[i], opts);
    }

    return "".concat(opts.printTypes ? this.constructor.name : '', "[").concat(string, "]");
  }

  equals(array) {
    if (!array || this.length !== array.length) {
      return false;
    }

    for (let i = 0; i < this.ELEMENTS; ++i) {
      if (!equals(this[i], array[i])) {
        return false;
      }
    }

    return true;
  }

  exactEquals(array) {
    if (!array || this.length !== array.length) {
      return false;
    }

    for (let i = 0; i < this.ELEMENTS; ++i) {
      if (this[i] !== array[i]) {
        return false;
      }
    }

    return true;
  }

  negate() {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = -this[i];
    }

    return this.check();
  }

  lerp(a, b, t) {
    if (t === undefined) {
      return this.lerp(this, a, b);
    }

    for (let i = 0; i < this.ELEMENTS; ++i) {
      const ai = a[i];
      this[i] = ai + t * (b[i] - ai);
    }

    return this.check();
  }

  min(vector) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = Math.min(vector[i], this[i]);
    }

    return this.check();
  }

  max(vector) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = Math.max(vector[i], this[i]);
    }

    return this.check();
  }

  clamp(minVector, maxVector) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = Math.min(Math.max(this[i], minVector[i]), maxVector[i]);
    }

    return this.check();
  }

  add(...vectors) {
    for (const vector of vectors) {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] += vector[i];
      }
    }

    return this.check();
  }

  subtract(...vectors) {
    for (const vector of vectors) {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] -= vector[i];
      }
    }

    return this.check();
  }

  scale(scale) {
    if (typeof scale === 'number') {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] *= scale;
      }
    } else {
      for (let i = 0; i < this.ELEMENTS && i < scale.length; ++i) {
        this[i] *= scale[i];
      }
    }

    return this.check();
  }

  multiplyByScalar(scalar) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] *= scalar;
    }

    return this.check();
  }

  check() {
    if (config.debug && !this.validate()) {
      throw new Error("math.gl: ".concat(this.constructor.name, " some fields set to invalid numbers'"));
    }

    return this;
  }

  validate() {
    let valid = this.length === this.ELEMENTS;

    for (let i = 0; i < this.ELEMENTS; ++i) {
      valid = valid && Number.isFinite(this[i]);
    }

    return valid;
  }

  sub(a) {
    return this.subtract(a);
  }

  setScalar(a) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = a;
    }

    return this.check();
  }

  addScalar(a) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] += a;
    }

    return this.check();
  }

  subScalar(a) {
    return this.addScalar(-a);
  }

  multiplyScalar(scalar) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] *= scalar;
    }

    return this.check();
  }

  divideScalar(a) {
    return this.multiplyByScalar(1 / a);
  }

  clampScalar(min, max) {
    for (let i = 0; i < this.ELEMENTS; ++i) {
      this[i] = Math.min(Math.max(this[i], min), max);
    }

    return this.check();
  }

  get elements() {
    return this;
  }

}

function validateVector(v, length) {
  if (v.length !== length) {
    return false;
  }

  for (let i = 0; i < v.length; ++i) {
    if (!Number.isFinite(v[i])) {
      return false;
    }
  }

  return true;
}
function checkNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid number ".concat(value));
  }

  return value;
}
function checkVector(v, length, callerName = '') {
  if (config.debug && !validateVector(v, length)) {
    throw new Error("math.gl: ".concat(callerName, " some fields set to invalid numbers'"));
  }

  return v;
}

class Vector extends MathArray {
  get x() {
    return this[0];
  }

  set x(value) {
    this[0] = checkNumber(value);
  }

  get y() {
    return this[1];
  }

  set y(value) {
    this[1] = checkNumber(value);
  }

  len() {
    return Math.sqrt(this.lengthSquared());
  }

  magnitude() {
    return this.len();
  }

  lengthSquared() {
    let length = 0;

    for (let i = 0; i < this.ELEMENTS; ++i) {
      length += this[i] * this[i];
    }

    return length;
  }

  magnitudeSquared() {
    return this.lengthSquared();
  }

  distance(mathArray) {
    return Math.sqrt(this.distanceSquared(mathArray));
  }

  distanceSquared(mathArray) {
    let length = 0;

    for (let i = 0; i < this.ELEMENTS; ++i) {
      const dist = this[i] - mathArray[i];
      length += dist * dist;
    }

    return checkNumber(length);
  }

  dot(mathArray) {
    let product = 0;

    for (let i = 0; i < this.ELEMENTS; ++i) {
      product += this[i] * mathArray[i];
    }

    return checkNumber(product);
  }

  normalize() {
    const length = this.magnitude();

    if (length !== 0) {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] /= length;
      }
    }

    return this.check();
  }

  multiply(...vectors) {
    for (const vector of vectors) {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] *= vector[i];
      }
    }

    return this.check();
  }

  divide(...vectors) {
    for (const vector of vectors) {
      for (let i = 0; i < this.ELEMENTS; ++i) {
        this[i] /= vector[i];
      }
    }

    return this.check();
  }

  lengthSq() {
    return this.lengthSquared();
  }

  distanceTo(vector) {
    return this.distance(vector);
  }

  distanceToSquared(vector) {
    return this.distanceSquared(vector);
  }

  getComponent(i) {
    assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
    return checkNumber(this[i]);
  }

  setComponent(i, value) {
    assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
    this[i] = value;
    return this.check();
  }

  addVectors(a, b) {
    return this.copy(a).add(b);
  }

  subVectors(a, b) {
    return this.copy(a).subtract(b);
  }

  multiplyVectors(a, b) {
    return this.copy(a).multiply(b);
  }

  addScaledVector(a, b) {
    return this.add(new this.constructor(a).multiplyScalar(b));
  }

}

/**
 * Common utilities
 * @module glMatrix
 */
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$1() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the vector to transform
 * @param {ReadonlyMat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3$1(out, a, m) {
  var x = a[0],
      y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

function vec3_transformMat4AsVector(out, a, m) {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = m[3] * x + m[7] * y + m[11] * z || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
function vec3_transformMat2(out, a, m) {
  const x = a[0];
  const y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  out[2] = a[2];
  return out;
}
function vec4_transformMat3(out, a, m) {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  out[0] = m[0] * x + m[3] * y + m[6] * z;
  out[1] = m[1] * x + m[4] * y + m[7] * z;
  out[2] = m[2] * x + m[5] * y + m[8] * z;
  out[3] = a[3];
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

const ORIGIN = [0, 0, 0];
let ZERO;
class Vector3 extends Vector {
  static get ZERO() {
    if (!ZERO) {
      ZERO = new Vector3(0, 0, 0);
      Object.freeze(ZERO);
    }

    return ZERO;
  }

  constructor(x = 0, y = 0, z = 0) {
    super(-0, -0, -0);

    if (arguments.length === 1 && isArray(x)) {
      this.copy(x);
    } else {
      if (config.debug) {
        checkNumber(x);
        checkNumber(y);
        checkNumber(z);
      }

      this[0] = x;
      this[1] = y;
      this[2] = z;
    }
  }

  set(x, y, z) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    return this.check();
  }

  copy(array) {
    this[0] = array[0];
    this[1] = array[1];
    this[2] = array[2];
    return this.check();
  }

  fromObject(object) {
    if (config.debug) {
      checkNumber(object.x);
      checkNumber(object.y);
      checkNumber(object.z);
    }

    this[0] = object.x;
    this[1] = object.y;
    this[2] = object.z;
    return this.check();
  }

  toObject(object) {
    object.x = this[0];
    object.y = this[1];
    object.z = this[2];
    return object;
  }

  get ELEMENTS() {
    return 3;
  }

  get z() {
    return this[2];
  }

  set z(value) {
    this[2] = checkNumber(value);
  }

  angle(vector) {
    return angle(this, vector);
  }

  cross(vector) {
    cross(this, this, vector);
    return this.check();
  }

  rotateX({
    radians,
    origin = ORIGIN
  }) {
    rotateX(this, this, origin, radians);
    return this.check();
  }

  rotateY({
    radians,
    origin = ORIGIN
  }) {
    rotateY(this, this, origin, radians);
    return this.check();
  }

  rotateZ({
    radians,
    origin = ORIGIN
  }) {
    rotateZ(this, this, origin, radians);
    return this.check();
  }

  transform(matrix4) {
    return this.transformAsPoint(matrix4);
  }

  transformAsPoint(matrix4) {
    transformMat4(this, this, matrix4);
    return this.check();
  }

  transformAsVector(matrix4) {
    vec3_transformMat4AsVector(this, this, matrix4);
    return this.check();
  }

  transformByMatrix3(matrix3) {
    transformMat3(this, this, matrix3);
    return this.check();
  }

  transformByMatrix2(matrix2) {
    vec3_transformMat2(this, this, matrix2);
    return this.check();
  }

  transformByQuaternion(quaternion) {
    transformQuat(this, this, quaternion);
    return this.check();
  }

}

class Matrix extends MathArray {
  toString() {
    let string = '[';

    if (config.printRowMajor) {
      string += 'row-major:';

      for (let row = 0; row < this.RANK; ++row) {
        for (let col = 0; col < this.RANK; ++col) {
          string += " ".concat(this[col * this.RANK + row]);
        }
      }
    } else {
      string += 'column-major:';

      for (let i = 0; i < this.ELEMENTS; ++i) {
        string += " ".concat(this[i]);
      }
    }

    string += ']';
    return string;
  }

  getElementIndex(row, col) {
    return col * this.RANK + row;
  }

  getElement(row, col) {
    return this[col * this.RANK + row];
  }

  setElement(row, col, value) {
    this[col * this.RANK + row] = checkNumber(value);
    return this;
  }

  getColumn(columnIndex, result = new Array(this.RANK).fill(-0)) {
    const firstIndex = columnIndex * this.RANK;

    for (let i = 0; i < this.RANK; ++i) {
      result[i] = this[firstIndex + i];
    }

    return result;
  }

  setColumn(columnIndex, columnVector) {
    const firstIndex = columnIndex * this.RANK;

    for (let i = 0; i < this.RANK; ++i) {
      this[firstIndex + i] = columnVector[i];
    }

    return this;
  }

}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the source matrix
 * @returns {mat3} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {ReadonlyMat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the first operand
 * @param {ReadonlyMat3} b the second operand
 * @returns {mat3} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2];
  var a10 = a[3],
      a11 = a[4],
      a12 = a[5];
  var a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  var b00 = b[0],
      b01 = b[1],
      b02 = b[2];
  var b10 = b[3],
      b11 = b[4],
      b12 = b[5];
  var b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}

var INDICES;

(function (INDICES) {
  INDICES[INDICES["COL0ROW0"] = 0] = "COL0ROW0";
  INDICES[INDICES["COL0ROW1"] = 1] = "COL0ROW1";
  INDICES[INDICES["COL0ROW2"] = 2] = "COL0ROW2";
  INDICES[INDICES["COL1ROW0"] = 3] = "COL1ROW0";
  INDICES[INDICES["COL1ROW1"] = 4] = "COL1ROW1";
  INDICES[INDICES["COL1ROW2"] = 5] = "COL1ROW2";
  INDICES[INDICES["COL2ROW0"] = 6] = "COL2ROW0";
  INDICES[INDICES["COL2ROW1"] = 7] = "COL2ROW1";
  INDICES[INDICES["COL2ROW2"] = 8] = "COL2ROW2";
})(INDICES || (INDICES = {}));

const IDENTITY_MATRIX = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
class Matrix3 extends Matrix {
  static get IDENTITY() {
    return getIdentityMatrix();
  }

  static get ZERO() {
    return getZeroMatrix();
  }

  get ELEMENTS() {
    return 9;
  }

  get RANK() {
    return 3;
  }

  get INDICES() {
    return INDICES;
  }

  constructor(array, ...args) {
    super(-0, -0, -0, -0, -0, -0, -0, -0, -0);

    if (arguments.length === 1 && Array.isArray(array)) {
      this.copy(array);
    } else if (args.length > 0) {
      this.copy([array, ...args]);
    } else {
      this.identity();
    }
  }

  copy(array) {
    this[0] = array[0];
    this[1] = array[1];
    this[2] = array[2];
    this[3] = array[3];
    this[4] = array[4];
    this[5] = array[5];
    this[6] = array[6];
    this[7] = array[7];
    this[8] = array[8];
    return this.check();
  }

  identity() {
    return this.copy(IDENTITY_MATRIX);
  }

  fromObject(object) {
    return this.check();
  }

  fromQuaternion(q) {
    fromQuat(this, q);
    return this.check();
  }

  set(m00, m10, m20, m01, m11, m21, m02, m12, m22) {
    this[0] = m00;
    this[1] = m10;
    this[2] = m20;
    this[3] = m01;
    this[4] = m11;
    this[5] = m21;
    this[6] = m02;
    this[7] = m12;
    this[8] = m22;
    return this.check();
  }

  setRowMajor(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    this[0] = m00;
    this[1] = m10;
    this[2] = m20;
    this[3] = m01;
    this[4] = m11;
    this[5] = m21;
    this[6] = m02;
    this[7] = m12;
    this[8] = m22;
    return this.check();
  }

  determinant() {
    return determinant(this);
  }

  transpose() {
    transpose(this, this);
    return this.check();
  }

  invert() {
    invert(this, this);
    return this.check();
  }

  multiplyLeft(a) {
    multiply(this, a, this);
    return this.check();
  }

  multiplyRight(a) {
    multiply(this, this, a);
    return this.check();
  }

  rotate(radians) {
    rotate(this, this, radians);
    return this.check();
  }

  scale(factor) {
    if (Array.isArray(factor)) {
      scale(this, this, factor);
    } else {
      scale(this, this, [factor, factor]);
    }

    return this.check();
  }

  translate(vec) {
    translate(this, this, vec);
    return this.check();
  }

  transform(vector, result) {
    let out;

    switch (vector.length) {
      case 2:
        out = transformMat3$1(result || [-0, -0], vector, this);
        break;

      case 3:
        out = transformMat3(result || [-0, -0, -0], vector, this);
        break;

      case 4:
        out = vec4_transformMat3(result || [-0, -0, -0, -0], vector, this);
        break;

      default:
        throw new Error('Illegal vector');
    }

    checkVector(out, vector.length);
    return out;
  }

  transformVector(vector, result) {
    return this.transform(vector, result);
  }

  transformVector2(vector, result) {
    return this.transform(vector, result);
  }

  transformVector3(vector, result) {
    return this.transform(vector, result);
  }

}
let ZERO_MATRIX3;
let IDENTITY_MATRIX3;

function getZeroMatrix() {
  if (!ZERO_MATRIX3) {
    ZERO_MATRIX3 = new Matrix3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    Object.freeze(ZERO_MATRIX3);
  }

  return ZERO_MATRIX3;
}

function getIdentityMatrix() {
  if (!IDENTITY_MATRIX3) {
    IDENTITY_MATRIX3 = new Matrix3();
    Object.freeze(IDENTITY_MATRIX3);
  }

  return IDENTITY_MATRIX3;
}

const COMPONENTS$1 = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const BYTES$1 = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};

const EXT_MESHOPT_TRANSFORM = 'KHR_texture_transform';
const name$4 = EXT_MESHOPT_TRANSFORM;
const scratchVector = new Vector3();
const scratchRotationMatrix = new Matrix3();
const scratchScaleMatrix = new Matrix3();
async function decode$4(gltfData, options) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const extension = gltfScenegraph.getExtension(EXT_MESHOPT_TRANSFORM);
  if (!extension) {
    return;
  }
  const materials = gltfData.json.materials || [];
  for (let i = 0; i < materials.length; i++) {
    transformTexCoords(i, gltfData);
  }
}
function transformTexCoords(materialIndex, gltfData) {
  var _gltfData$json$materi, _material$pbrMetallic, _material$pbrMetallic2;
  const processedTexCoords = [];
  const material = (_gltfData$json$materi = gltfData.json.materials) === null || _gltfData$json$materi === void 0 ? void 0 : _gltfData$json$materi[materialIndex];
  const baseColorTexture = material === null || material === void 0 ? void 0 : (_material$pbrMetallic = material.pbrMetallicRoughness) === null || _material$pbrMetallic === void 0 ? void 0 : _material$pbrMetallic.baseColorTexture;
  if (baseColorTexture) {
    transformPrimitives(gltfData, materialIndex, baseColorTexture, processedTexCoords);
  }
  const emisiveTexture = material === null || material === void 0 ? void 0 : material.emissiveTexture;
  if (emisiveTexture) {
    transformPrimitives(gltfData, materialIndex, emisiveTexture, processedTexCoords);
  }
  const normalTexture = material === null || material === void 0 ? void 0 : material.normalTexture;
  if (normalTexture) {
    transformPrimitives(gltfData, materialIndex, normalTexture, processedTexCoords);
  }
  const occlusionTexture = material === null || material === void 0 ? void 0 : material.occlusionTexture;
  if (occlusionTexture) {
    transformPrimitives(gltfData, materialIndex, occlusionTexture, processedTexCoords);
  }
  const metallicRoughnessTexture = material === null || material === void 0 ? void 0 : (_material$pbrMetallic2 = material.pbrMetallicRoughness) === null || _material$pbrMetallic2 === void 0 ? void 0 : _material$pbrMetallic2.metallicRoughnessTexture;
  if (metallicRoughnessTexture) {
    transformPrimitives(gltfData, materialIndex, metallicRoughnessTexture, processedTexCoords);
  }
}
function transformPrimitives(gltfData, materialIndex, texture, processedTexCoords) {
  const transformParameters = getTransformParameters(texture, processedTexCoords);
  if (!transformParameters) {
    return;
  }
  const meshes = gltfData.json.meshes || [];
  for (const mesh of meshes) {
    for (const primitive of mesh.primitives) {
      const material = primitive.material;
      if (Number.isFinite(material) && materialIndex === material) {
        transformPrimitive(gltfData, primitive, transformParameters);
      }
    }
  }
}
function getTransformParameters(texture, processedTexCoords) {
  var _texture$extensions;
  const textureInfo = (_texture$extensions = texture.extensions) === null || _texture$extensions === void 0 ? void 0 : _texture$extensions[EXT_MESHOPT_TRANSFORM];
  const {
    texCoord: originalTexCoord = 0
  } = texture;
  const {
    texCoord = originalTexCoord
  } = textureInfo;
  const isProcessed = processedTexCoords.findIndex(_ref => {
    let [original, newTexCoord] = _ref;
    return original === originalTexCoord && newTexCoord === texCoord;
  }) !== -1;
  if (!isProcessed) {
    const matrix = makeTransformationMatrix(textureInfo);
    if (originalTexCoord !== texCoord) {
      texture.texCoord = texCoord;
    }
    processedTexCoords.push([originalTexCoord, texCoord]);
    return {
      originalTexCoord,
      texCoord,
      matrix
    };
  }
  return null;
}
function transformPrimitive(gltfData, primitive, transformParameters) {
  const {
    originalTexCoord,
    texCoord,
    matrix
  } = transformParameters;
  const texCoordAccessor = primitive.attributes["TEXCOORD_".concat(originalTexCoord)];
  if (Number.isFinite(texCoordAccessor)) {
    var _gltfData$json$access;
    const accessor = (_gltfData$json$access = gltfData.json.accessors) === null || _gltfData$json$access === void 0 ? void 0 : _gltfData$json$access[texCoordAccessor];
    if (accessor && accessor.bufferView) {
      var _gltfData$json$buffer;
      const bufferView = (_gltfData$json$buffer = gltfData.json.bufferViews) === null || _gltfData$json$buffer === void 0 ? void 0 : _gltfData$json$buffer[accessor.bufferView];
      if (bufferView) {
        const {
          arrayBuffer,
          byteOffset: bufferByteOffset
        } = gltfData.buffers[bufferView.buffer];
        const byteOffset = (bufferByteOffset || 0) + (accessor.byteOffset || 0) + (bufferView.byteOffset || 0);
        const {
          ArrayType,
          length
        } = getAccessorArrayTypeAndLength(accessor, bufferView);
        const bytes = BYTES$1[accessor.componentType];
        const components = COMPONENTS$1[accessor.type];
        const elementAddressScale = bufferView.byteStride || bytes * components;
        const result = new Float32Array(length);
        for (let i = 0; i < accessor.count; i++) {
          const uv = new ArrayType(arrayBuffer, byteOffset + i * elementAddressScale, 2);
          scratchVector.set(uv[0], uv[1], 1);
          scratchVector.transformByMatrix3(matrix);
          result.set([scratchVector[0], scratchVector[1]], i * components);
        }
        if (originalTexCoord === texCoord) {
          updateGltf(accessor, bufferView, gltfData.buffers, result);
        } else {
          createAttribute(texCoord, accessor, primitive, gltfData, result);
        }
      }
    }
  }
}
function updateGltf(accessor, bufferView, buffers, newTexCoordArray) {
  accessor.componentType = 5126;
  buffers.push({
    arrayBuffer: newTexCoordArray.buffer,
    byteOffset: 0,
    byteLength: newTexCoordArray.buffer.byteLength
  });
  bufferView.buffer = buffers.length - 1;
  bufferView.byteLength = newTexCoordArray.buffer.byteLength;
  bufferView.byteOffset = 0;
  delete bufferView.byteStride;
}
function createAttribute(newTexCoord, originalAccessor, primitive, gltfData, newTexCoordArray) {
  gltfData.buffers.push({
    arrayBuffer: newTexCoordArray.buffer,
    byteOffset: 0,
    byteLength: newTexCoordArray.buffer.byteLength
  });
  const bufferViews = gltfData.json.bufferViews;
  if (!bufferViews) {
    return;
  }
  bufferViews.push({
    buffer: gltfData.buffers.length - 1,
    byteLength: newTexCoordArray.buffer.byteLength,
    byteOffset: 0
  });
  const accessors = gltfData.json.accessors;
  if (!accessors) {
    return;
  }
  accessors.push({
    bufferView: (bufferViews === null || bufferViews === void 0 ? void 0 : bufferViews.length) - 1,
    byteOffset: 0,
    componentType: 5126,
    count: originalAccessor.count,
    type: 'VEC2'
  });
  primitive.attributes["TEXCOORD_".concat(newTexCoord)] = accessors.length - 1;
}
function makeTransformationMatrix(extensionData) {
  const {
    offset = [0, 0],
    rotation = 0,
    scale = [1, 1]
  } = extensionData;
  const translationMatirx = new Matrix3().set(1, 0, 0, 0, 1, 0, offset[0], offset[1], 1);
  const rotationMatirx = scratchRotationMatrix.set(Math.cos(rotation), Math.sin(rotation), 0, -Math.sin(rotation), Math.cos(rotation), 0, 0, 0, 1);
  const scaleMatrix = scratchScaleMatrix.set(scale[0], 0, 0, 0, scale[1], 0, 0, 0, 1);
  return translationMatirx.multiplyRight(rotationMatirx).multiplyRight(scaleMatrix);
}

var KHR_texture_transform = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$4,
    decode: decode$4
});

const KHR_LIGHTS_PUNCTUAL = 'KHR_lights_punctual';
const name$3 = KHR_LIGHTS_PUNCTUAL;
async function decode$3(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  const extension = gltfScenegraph.getExtension(KHR_LIGHTS_PUNCTUAL);
  if (extension) {
    gltfScenegraph.json.lights = extension.lights;
    gltfScenegraph.removeExtension(KHR_LIGHTS_PUNCTUAL);
  }
  for (const node of json.nodes || []) {
    const nodeExtension = gltfScenegraph.getObjectExtension(node, KHR_LIGHTS_PUNCTUAL);
    if (nodeExtension) {
      node.light = nodeExtension.light;
    }
    gltfScenegraph.removeObjectExtension(node, KHR_LIGHTS_PUNCTUAL);
  }
}
async function encode$2(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  if (json.lights) {
    const extension = gltfScenegraph.addExtension(KHR_LIGHTS_PUNCTUAL);
    assert$2(!extension.lights);
    extension.lights = json.lights;
    delete json.lights;
  }
  if (gltfScenegraph.json.lights) {
    for (const light of gltfScenegraph.json.lights) {
      const node = light.node;
      gltfScenegraph.addObjectExtension(node, KHR_LIGHTS_PUNCTUAL, light);
    }
    delete gltfScenegraph.json.lights;
  }
}

var KHR_lights_punctual = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$3,
    decode: decode$3,
    encode: encode$2
});

const KHR_MATERIALS_UNLIT = 'KHR_materials_unlit';
const name$2 = KHR_MATERIALS_UNLIT;
async function decode$2(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  for (const material of json.materials || []) {
    const extension = material.extensions && material.extensions.KHR_materials_unlit;
    if (extension) {
      material.unlit = true;
    }
    gltfScenegraph.removeObjectExtension(material, KHR_MATERIALS_UNLIT);
  }
  gltfScenegraph.removeExtension(KHR_MATERIALS_UNLIT);
}
function encode$1(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  if (gltfScenegraph.materials) {
    for (const material of json.materials || []) {
      if (material.unlit) {
        delete material.unlit;
        gltfScenegraph.addObjectExtension(material, KHR_MATERIALS_UNLIT, {});
        gltfScenegraph.addExtension(KHR_MATERIALS_UNLIT);
      }
    }
  }
}

var KHR_materials_unlit = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$2,
    decode: decode$2,
    encode: encode$1
});

const KHR_TECHNIQUES_WEBGL = 'KHR_techniques_webgl';
const name$1 = KHR_TECHNIQUES_WEBGL;
async function decode$1(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  const extension = gltfScenegraph.getExtension(KHR_TECHNIQUES_WEBGL);
  if (extension) {
    const techniques = resolveTechniques(extension, gltfScenegraph);
    for (const material of json.materials || []) {
      const materialExtension = gltfScenegraph.getObjectExtension(material, KHR_TECHNIQUES_WEBGL);
      if (materialExtension) {
        material.technique = Object.assign({}, materialExtension, techniques[materialExtension.technique]);
        material.technique.values = resolveValues(material.technique, gltfScenegraph);
      }
      gltfScenegraph.removeObjectExtension(material, KHR_TECHNIQUES_WEBGL);
    }
    gltfScenegraph.removeExtension(KHR_TECHNIQUES_WEBGL);
  }
}
async function encode(gltfData, options) {}
function resolveTechniques(techniquesExtension, gltfScenegraph) {
  const {
    programs = [],
    shaders = [],
    techniques = []
  } = techniquesExtension;
  const textDecoder = new TextDecoder();
  shaders.forEach(shader => {
    if (Number.isFinite(shader.bufferView)) {
      shader.code = textDecoder.decode(gltfScenegraph.getTypedArrayForBufferView(shader.bufferView));
    } else {
      throw new Error('KHR_techniques_webgl: no shader code');
    }
  });
  programs.forEach(program => {
    program.fragmentShader = shaders[program.fragmentShader];
    program.vertexShader = shaders[program.vertexShader];
  });
  techniques.forEach(technique => {
    technique.program = programs[technique.program];
  });
  return techniques;
}
function resolveValues(technique, gltfScenegraph) {
  const values = Object.assign({}, technique.values);
  Object.keys(technique.uniforms || {}).forEach(uniform => {
    if (technique.uniforms[uniform].value && !(uniform in values)) {
      values[uniform] = technique.uniforms[uniform].value;
    }
  });
  Object.keys(values).forEach(uniform => {
    if (typeof values[uniform] === 'object' && values[uniform].index !== undefined) {
      values[uniform].texture = gltfScenegraph.getTexture(values[uniform].index);
    }
  });
  return values;
}

var KHR_techniques_webgl = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name$1,
    decode: decode$1,
    encode: encode
});

const EXT_FEATURE_METADATA = 'EXT_feature_metadata';
const name = EXT_FEATURE_METADATA;
async function decode(gltfData) {
  const scenegraph = new GLTFScenegraph(gltfData);
  decodeExtFeatureMetadata(scenegraph);
}
function decodeExtFeatureMetadata(scenegraph) {
  var _extension$schema;
  const extension = scenegraph.getExtension(EXT_FEATURE_METADATA);
  const schemaClasses = extension === null || extension === void 0 ? void 0 : (_extension$schema = extension.schema) === null || _extension$schema === void 0 ? void 0 : _extension$schema.classes;
  const featureTables = extension === null || extension === void 0 ? void 0 : extension.featureTables;
  const featureTextures = extension === null || extension === void 0 ? void 0 : extension.featureTextures;
  if (featureTextures) {
    console.warn('featureTextures is not yet supported in the "EXT_feature_metadata" extension.');
  }
  if (schemaClasses && featureTables) {
    for (const schemaName in schemaClasses) {
      const schemaClass = schemaClasses[schemaName];
      const featureTable = findFeatureTableByName(featureTables, schemaName);
      if (featureTable) {
        handleFeatureTableProperties(scenegraph, featureTable, schemaClass);
      }
    }
  }
}
function handleFeatureTableProperties(scenegraph, featureTable, schemaClass) {
  for (const propertyName in schemaClass.properties) {
    var _featureTable$propert;
    const schemaProperty = schemaClass.properties[propertyName];
    const featureTableProperty = featureTable === null || featureTable === void 0 ? void 0 : (_featureTable$propert = featureTable.properties) === null || _featureTable$propert === void 0 ? void 0 : _featureTable$propert[propertyName];
    const numberOfFeatures = featureTable.count;
    if (featureTableProperty) {
      const data = getPropertyDataFromBinarySource(scenegraph, schemaProperty, numberOfFeatures, featureTableProperty);
      featureTableProperty.data = data;
    }
  }
}
function getPropertyDataFromBinarySource(scenegraph, schemaProperty, numberOfFeatures, featureTableProperty) {
  const bufferView = featureTableProperty.bufferView;
  let data = scenegraph.getTypedArrayForBufferView(bufferView);
  switch (schemaProperty.type) {
    case 'STRING':
      {
        const stringOffsetBufferView = featureTableProperty.stringOffsetBufferView;
        const offsetsData = scenegraph.getTypedArrayForBufferView(stringOffsetBufferView);
        data = getStringAttributes(data, offsetsData, numberOfFeatures);
        break;
      }
  }
  return data;
}
function findFeatureTableByName(featureTables, schemaClassName) {
  for (const featureTableName in featureTables) {
    const featureTable = featureTables[featureTableName];
    if (featureTable.class === schemaClassName) {
      return featureTable;
    }
  }
  return null;
}
function getStringAttributes(data, offsetsData, stringsCount) {
  const stringsArray = [];
  const textDecoder = new TextDecoder('utf8');
  let stringOffset = 0;
  const bytesPerStringSize = 4;
  for (let index = 0; index < stringsCount; index++) {
    const stringByteSize = offsetsData[(index + 1) * bytesPerStringSize] - offsetsData[index * bytesPerStringSize];
    const stringData = data.subarray(stringOffset, stringByteSize + stringOffset);
    const stringAttribute = textDecoder.decode(stringData);
    stringsArray.push(stringAttribute);
    stringOffset += stringByteSize;
  }
  return stringsArray;
}

var EXT_feature_metadata = /*#__PURE__*/Object.freeze({
    __proto__: null,
    name: name,
    decode: decode
});

const EXTENSIONS = [EXT_meshopt_compression, EXT_texture_webp, KHR_texture_basisu, KHR_draco_mesh_compression, KHR_lights_punctual, KHR_materials_unlit, KHR_techniques_webgl, KHR_texture_transform, EXT_feature_metadata];
function preprocessExtensions(gltf) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let context = arguments.length > 2 ? arguments[2] : undefined;
  const extensions = EXTENSIONS.filter(extension => useExtension(extension.name, options));
  for (const extension of extensions) {
    var _extension$preprocess;
    (_extension$preprocess = extension.preprocess) === null || _extension$preprocess === void 0 ? void 0 : _extension$preprocess.call(extension, gltf, options, context);
  }
}
async function decodeExtensions(gltf) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let context = arguments.length > 2 ? arguments[2] : undefined;
  const extensions = EXTENSIONS.filter(extension => useExtension(extension.name, options));
  for (const extension of extensions) {
    var _extension$decode;
    await ((_extension$decode = extension.decode) === null || _extension$decode === void 0 ? void 0 : _extension$decode.call(extension, gltf, options, context));
  }
}
function useExtension(extensionName, options) {
  var _options$gltf;
  const excludes = (options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.excludeExtensions) || {};
  const exclude = extensionName in excludes && !excludes[extensionName];
  return !exclude;
}

const KHR_BINARY_GLTF = 'KHR_binary_glTF';
function preprocess(gltfData) {
  const gltfScenegraph = new GLTFScenegraph(gltfData);
  const {
    json
  } = gltfScenegraph;
  for (const image of json.images || []) {
    const extension = gltfScenegraph.getObjectExtension(image, KHR_BINARY_GLTF);
    if (extension) {
      Object.assign(image, extension);
    }
    gltfScenegraph.removeObjectExtension(image, KHR_BINARY_GLTF);
  }
  if (json.buffers && json.buffers[0]) {
    delete json.buffers[0].uri;
  }
  gltfScenegraph.removeExtension(KHR_BINARY_GLTF);
}

const GLTF_ARRAYS = {
  accessors: 'accessor',
  animations: 'animation',
  buffers: 'buffer',
  bufferViews: 'bufferView',
  images: 'image',
  materials: 'material',
  meshes: 'mesh',
  nodes: 'node',
  samplers: 'sampler',
  scenes: 'scene',
  skins: 'skin',
  textures: 'texture'
};
const GLTF_KEYS = {
  accessor: 'accessors',
  animations: 'animation',
  buffer: 'buffers',
  bufferView: 'bufferViews',
  image: 'images',
  material: 'materials',
  mesh: 'meshes',
  node: 'nodes',
  sampler: 'samplers',
  scene: 'scenes',
  skin: 'skins',
  texture: 'textures'
};
class GLTFV1Normalizer {
  constructor() {
    _defineProperty(this, "idToIndexMap", {
      animations: {},
      accessors: {},
      buffers: {},
      bufferViews: {},
      images: {},
      materials: {},
      meshes: {},
      nodes: {},
      samplers: {},
      scenes: {},
      skins: {},
      textures: {}
    });
    _defineProperty(this, "json", void 0);
  }
  normalize(gltf, options) {
    this.json = gltf.json;
    const json = gltf.json;
    switch (json.asset && json.asset.version) {
      case '2.0':
        return;
      case undefined:
      case '1.0':
        break;
      default:
        console.warn("glTF: Unknown version ".concat(json.asset.version));
        return;
    }
    if (!options.normalize) {
      throw new Error('glTF v1 is not supported.');
    }
    console.warn('Converting glTF v1 to glTF v2 format. This is experimental and may fail.');
    this._addAsset(json);
    this._convertTopLevelObjectsToArrays(json);
    preprocess(gltf);
    this._convertObjectIdsToArrayIndices(json);
    this._updateObjects(json);
    this._updateMaterial(json);
  }
  _addAsset(json) {
    json.asset = json.asset || {};
    json.asset.version = '2.0';
    json.asset.generator = json.asset.generator || 'Normalized to glTF 2.0 by loaders.gl';
  }
  _convertTopLevelObjectsToArrays(json) {
    for (const arrayName in GLTF_ARRAYS) {
      this._convertTopLevelObjectToArray(json, arrayName);
    }
  }
  _convertTopLevelObjectToArray(json, mapName) {
    const objectMap = json[mapName];
    if (!objectMap || Array.isArray(objectMap)) {
      return;
    }
    json[mapName] = [];
    for (const id in objectMap) {
      const object = objectMap[id];
      object.id = object.id || id;
      const index = json[mapName].length;
      json[mapName].push(object);
      this.idToIndexMap[mapName][id] = index;
    }
  }
  _convertObjectIdsToArrayIndices(json) {
    for (const arrayName in GLTF_ARRAYS) {
      this._convertIdsToIndices(json, arrayName);
    }
    if ('scene' in json) {
      json.scene = this._convertIdToIndex(json.scene, 'scene');
    }
    for (const texture of json.textures) {
      this._convertTextureIds(texture);
    }
    for (const mesh of json.meshes) {
      this._convertMeshIds(mesh);
    }
    for (const node of json.nodes) {
      this._convertNodeIds(node);
    }
    for (const node of json.scenes) {
      this._convertSceneIds(node);
    }
  }
  _convertTextureIds(texture) {
    if (texture.source) {
      texture.source = this._convertIdToIndex(texture.source, 'image');
    }
  }
  _convertMeshIds(mesh) {
    for (const primitive of mesh.primitives) {
      const {
        attributes,
        indices,
        material
      } = primitive;
      for (const attributeName in attributes) {
        attributes[attributeName] = this._convertIdToIndex(attributes[attributeName], 'accessor');
      }
      if (indices) {
        primitive.indices = this._convertIdToIndex(indices, 'accessor');
      }
      if (material) {
        primitive.material = this._convertIdToIndex(material, 'material');
      }
    }
  }
  _convertNodeIds(node) {
    if (node.children) {
      node.children = node.children.map(child => this._convertIdToIndex(child, 'node'));
    }
    if (node.meshes) {
      node.meshes = node.meshes.map(mesh => this._convertIdToIndex(mesh, 'mesh'));
    }
  }
  _convertSceneIds(scene) {
    if (scene.nodes) {
      scene.nodes = scene.nodes.map(node => this._convertIdToIndex(node, 'node'));
    }
  }
  _convertIdsToIndices(json, topLevelArrayName) {
    if (!json[topLevelArrayName]) {
      console.warn("gltf v1: json doesn't contain attribute ".concat(topLevelArrayName));
      json[topLevelArrayName] = [];
    }
    for (const object of json[topLevelArrayName]) {
      for (const key in object) {
        const id = object[key];
        const index = this._convertIdToIndex(id, key);
        object[key] = index;
      }
    }
  }
  _convertIdToIndex(id, key) {
    const arrayName = GLTF_KEYS[key];
    if (arrayName in this.idToIndexMap) {
      const index = this.idToIndexMap[arrayName][id];
      if (!Number.isFinite(index)) {
        throw new Error("gltf v1: failed to resolve ".concat(key, " with id ").concat(id));
      }
      return index;
    }
    return id;
  }
  _updateObjects(json) {
    for (const buffer of this.json.buffers) {
      delete buffer.type;
    }
  }
  _updateMaterial(json) {
    for (const material of json.materials) {
      var _material$values, _material$values2, _material$values3;
      material.pbrMetallicRoughness = {
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 1,
        roughnessFactor: 1
      };
      const textureId = ((_material$values = material.values) === null || _material$values === void 0 ? void 0 : _material$values.tex) || ((_material$values2 = material.values) === null || _material$values2 === void 0 ? void 0 : _material$values2.texture2d_0) || ((_material$values3 = material.values) === null || _material$values3 === void 0 ? void 0 : _material$values3.diffuseTex);
      const textureIndex = json.textures.findIndex(texture => texture.id === textureId);
      if (textureIndex !== -1) {
        material.pbrMetallicRoughness.baseColorTexture = {
          index: textureIndex
        };
      }
    }
  }
}
function normalizeGLTFV1(gltf) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new GLTFV1Normalizer().normalize(gltf, options);
}

const COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const BYTES = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4
};
const GL_SAMPLER = {
  TEXTURE_MAG_FILTER: 0x2800,
  TEXTURE_MIN_FILTER: 0x2801,
  TEXTURE_WRAP_S: 0x2802,
  TEXTURE_WRAP_T: 0x2803,
  REPEAT: 0x2901,
  LINEAR: 0x2601,
  NEAREST_MIPMAP_LINEAR: 0x2702
};
const SAMPLER_PARAMETER_GLTF_TO_GL = {
  magFilter: GL_SAMPLER.TEXTURE_MAG_FILTER,
  minFilter: GL_SAMPLER.TEXTURE_MIN_FILTER,
  wrapS: GL_SAMPLER.TEXTURE_WRAP_S,
  wrapT: GL_SAMPLER.TEXTURE_WRAP_T
};
const DEFAULT_SAMPLER = {
  [GL_SAMPLER.TEXTURE_MAG_FILTER]: GL_SAMPLER.LINEAR,
  [GL_SAMPLER.TEXTURE_MIN_FILTER]: GL_SAMPLER.NEAREST_MIPMAP_LINEAR,
  [GL_SAMPLER.TEXTURE_WRAP_S]: GL_SAMPLER.REPEAT,
  [GL_SAMPLER.TEXTURE_WRAP_T]: GL_SAMPLER.REPEAT
};
function getBytesFromComponentType(componentType) {
  return BYTES[componentType];
}
function getSizeFromAccessorType(type) {
  return COMPONENTS[type];
}
class GLTFPostProcessor {
  constructor() {
    _defineProperty(this, "baseUri", '');
    _defineProperty(this, "json", {});
    _defineProperty(this, "buffers", []);
    _defineProperty(this, "images", []);
  }
  postProcess(gltf) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      json,
      buffers = [],
      images = [],
      baseUri = ''
    } = gltf;
    assert$2(json);
    this.baseUri = baseUri;
    this.json = json;
    this.buffers = buffers;
    this.images = images;
    this._resolveTree(this.json, options);
    return this.json;
  }
  _resolveTree(json) {
    if (json.bufferViews) {
      json.bufferViews = json.bufferViews.map((bufView, i) => this._resolveBufferView(bufView, i));
    }
    if (json.images) {
      json.images = json.images.map((image, i) => this._resolveImage(image, i));
    }
    if (json.samplers) {
      json.samplers = json.samplers.map((sampler, i) => this._resolveSampler(sampler, i));
    }
    if (json.textures) {
      json.textures = json.textures.map((texture, i) => this._resolveTexture(texture, i));
    }
    if (json.accessors) {
      json.accessors = json.accessors.map((accessor, i) => this._resolveAccessor(accessor, i));
    }
    if (json.materials) {
      json.materials = json.materials.map((material, i) => this._resolveMaterial(material, i));
    }
    if (json.meshes) {
      json.meshes = json.meshes.map((mesh, i) => this._resolveMesh(mesh, i));
    }
    if (json.nodes) {
      json.nodes = json.nodes.map((node, i) => this._resolveNode(node, i));
    }
    if (json.skins) {
      json.skins = json.skins.map((skin, i) => this._resolveSkin(skin, i));
    }
    if (json.scenes) {
      json.scenes = json.scenes.map((scene, i) => this._resolveScene(scene, i));
    }
    if (json.scene !== undefined) {
      json.scene = json.scenes[this.json.scene];
    }
  }
  getScene(index) {
    return this._get('scenes', index);
  }
  getNode(index) {
    return this._get('nodes', index);
  }
  getSkin(index) {
    return this._get('skins', index);
  }
  getMesh(index) {
    return this._get('meshes', index);
  }
  getMaterial(index) {
    return this._get('materials', index);
  }
  getAccessor(index) {
    return this._get('accessors', index);
  }
  getCamera(index) {
    return null;
  }
  getTexture(index) {
    return this._get('textures', index);
  }
  getSampler(index) {
    return this._get('samplers', index);
  }
  getImage(index) {
    return this._get('images', index);
  }
  getBufferView(index) {
    return this._get('bufferViews', index);
  }
  getBuffer(index) {
    return this._get('buffers', index);
  }
  _get(array, index) {
    if (typeof index === 'object') {
      return index;
    }
    const object = this.json[array] && this.json[array][index];
    if (!object) {
      console.warn("glTF file error: Could not find ".concat(array, "[").concat(index, "]"));
    }
    return object;
  }
  _resolveScene(scene, index) {
    scene.id = scene.id || "scene-".concat(index);
    scene.nodes = (scene.nodes || []).map(node => this.getNode(node));
    return scene;
  }
  _resolveNode(node, index) {
    node.id = node.id || "node-".concat(index);
    if (node.children) {
      node.children = node.children.map(child => this.getNode(child));
    }
    if (node.mesh !== undefined) {
      node.mesh = this.getMesh(node.mesh);
    } else if (node.meshes !== undefined && node.meshes.length) {
      node.mesh = node.meshes.reduce((accum, meshIndex) => {
        const mesh = this.getMesh(meshIndex);
        accum.id = mesh.id;
        accum.primitives = accum.primitives.concat(mesh.primitives);
        return accum;
      }, {
        primitives: []
      });
    }
    if (node.camera !== undefined) {
      node.camera = this.getCamera(node.camera);
    }
    if (node.skin !== undefined) {
      node.skin = this.getSkin(node.skin);
    }
    return node;
  }
  _resolveSkin(skin, index) {
    skin.id = skin.id || "skin-".concat(index);
    skin.inverseBindMatrices = this.getAccessor(skin.inverseBindMatrices);
    return skin;
  }
  _resolveMesh(mesh, index) {
    mesh.id = mesh.id || "mesh-".concat(index);
    if (mesh.primitives) {
      mesh.primitives = mesh.primitives.map(primitive => {
        primitive = {
          ...primitive
        };
        const attributes = primitive.attributes;
        primitive.attributes = {};
        for (const attribute in attributes) {
          primitive.attributes[attribute] = this.getAccessor(attributes[attribute]);
        }
        if (primitive.indices !== undefined) {
          primitive.indices = this.getAccessor(primitive.indices);
        }
        if (primitive.material !== undefined) {
          primitive.material = this.getMaterial(primitive.material);
        }
        return primitive;
      });
    }
    return mesh;
  }
  _resolveMaterial(material, index) {
    material.id = material.id || "material-".concat(index);
    if (material.normalTexture) {
      material.normalTexture = {
        ...material.normalTexture
      };
      material.normalTexture.texture = this.getTexture(material.normalTexture.index);
    }
    if (material.occlusionTexture) {
      material.occlustionTexture = {
        ...material.occlustionTexture
      };
      material.occlusionTexture.texture = this.getTexture(material.occlusionTexture.index);
    }
    if (material.emissiveTexture) {
      material.emmisiveTexture = {
        ...material.emmisiveTexture
      };
      material.emissiveTexture.texture = this.getTexture(material.emissiveTexture.index);
    }
    if (!material.emissiveFactor) {
      material.emissiveFactor = material.emmisiveTexture ? [1, 1, 1] : [0, 0, 0];
    }
    if (material.pbrMetallicRoughness) {
      material.pbrMetallicRoughness = {
        ...material.pbrMetallicRoughness
      };
      const mr = material.pbrMetallicRoughness;
      if (mr.baseColorTexture) {
        mr.baseColorTexture = {
          ...mr.baseColorTexture
        };
        mr.baseColorTexture.texture = this.getTexture(mr.baseColorTexture.index);
      }
      if (mr.metallicRoughnessTexture) {
        mr.metallicRoughnessTexture = {
          ...mr.metallicRoughnessTexture
        };
        mr.metallicRoughnessTexture.texture = this.getTexture(mr.metallicRoughnessTexture.index);
      }
    }
    return material;
  }
  _resolveAccessor(accessor, index) {
    accessor.id = accessor.id || "accessor-".concat(index);
    if (accessor.bufferView !== undefined) {
      accessor.bufferView = this.getBufferView(accessor.bufferView);
    }
    accessor.bytesPerComponent = getBytesFromComponentType(accessor.componentType);
    accessor.components = getSizeFromAccessorType(accessor.type);
    accessor.bytesPerElement = accessor.bytesPerComponent * accessor.components;
    if (accessor.bufferView) {
      const buffer = accessor.bufferView.buffer;
      const {
        ArrayType,
        byteLength
      } = getAccessorArrayTypeAndLength(accessor, accessor.bufferView);
      const byteOffset = (accessor.bufferView.byteOffset || 0) + (accessor.byteOffset || 0) + buffer.byteOffset;
      let cutBuffer = buffer.arrayBuffer.slice(byteOffset, byteOffset + byteLength);
      if (accessor.bufferView.byteStride) {
        cutBuffer = this._getValueFromInterleavedBuffer(buffer, byteOffset, accessor.bufferView.byteStride, accessor.bytesPerElement, accessor.count);
      }
      accessor.value = new ArrayType(cutBuffer);
    }
    return accessor;
  }
  _getValueFromInterleavedBuffer(buffer, byteOffset, byteStride, bytesPerElement, count) {
    const result = new Uint8Array(count * bytesPerElement);
    for (let i = 0; i < count; i++) {
      const elementOffset = byteOffset + i * byteStride;
      result.set(new Uint8Array(buffer.arrayBuffer.slice(elementOffset, elementOffset + bytesPerElement)), i * bytesPerElement);
    }
    return result.buffer;
  }
  _resolveTexture(texture, index) {
    texture.id = texture.id || "texture-".concat(index);
    texture.sampler = 'sampler' in texture ? this.getSampler(texture.sampler) : DEFAULT_SAMPLER;
    texture.source = this.getImage(texture.source);
    return texture;
  }
  _resolveSampler(sampler, index) {
    sampler.id = sampler.id || "sampler-".concat(index);
    sampler.parameters = {};
    for (const key in sampler) {
      const glEnum = this._enumSamplerParameter(key);
      if (glEnum !== undefined) {
        sampler.parameters[glEnum] = sampler[key];
      }
    }
    return sampler;
  }
  _enumSamplerParameter(key) {
    return SAMPLER_PARAMETER_GLTF_TO_GL[key];
  }
  _resolveImage(image, index) {
    image.id = image.id || "image-".concat(index);
    if (image.bufferView !== undefined) {
      image.bufferView = this.getBufferView(image.bufferView);
    }
    const preloadedImage = this.images[index];
    if (preloadedImage) {
      image.image = preloadedImage;
    }
    return image;
  }
  _resolveBufferView(bufferView, index) {
    const bufferIndex = bufferView.buffer;
    const result = {
      id: "bufferView-".concat(index),
      ...bufferView,
      buffer: this.buffers[bufferIndex]
    };
    const arrayBuffer = this.buffers[bufferIndex].arrayBuffer;
    let byteOffset = this.buffers[bufferIndex].byteOffset || 0;
    if ('byteOffset' in bufferView) {
      byteOffset += bufferView.byteOffset;
    }
    result.data = new Uint8Array(arrayBuffer, byteOffset, bufferView.byteLength);
    return result;
  }
  _resolveCamera(camera, index) {
    camera.id = camera.id || "camera-".concat(index);
    if (camera.perspective) ;
    if (camera.orthographic) ;
    return camera;
  }
}
function postProcessGLTF(gltf, options) {
  return new GLTFPostProcessor().postProcess(gltf, options);
}

const MAGIC_glTF = 0x676c5446;
const GLB_FILE_HEADER_SIZE = 12;
const GLB_CHUNK_HEADER_SIZE = 8;
const GLB_CHUNK_TYPE_JSON = 0x4e4f534a;
const GLB_CHUNK_TYPE_BIN = 0x004e4942;
const GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED = 0;
const GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED = 1;
const GLB_V1_CONTENT_FORMAT_JSON = 0x0;
const LE = true;
function getMagicString(dataView) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return "".concat(String.fromCharCode(dataView.getUint8(byteOffset + 0))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 1))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 2))).concat(String.fromCharCode(dataView.getUint8(byteOffset + 3)));
}
function isGLB(arrayBuffer) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const dataView = new DataView(arrayBuffer);
  const {
    magic = MAGIC_glTF
  } = options;
  const magic1 = dataView.getUint32(byteOffset, false);
  return magic1 === magic || magic1 === MAGIC_glTF;
}
function parseGLBSync(glb, arrayBuffer) {
  let byteOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  const dataView = new DataView(arrayBuffer);
  const type = getMagicString(dataView, byteOffset + 0);
  const version = dataView.getUint32(byteOffset + 4, LE);
  const byteLength = dataView.getUint32(byteOffset + 8, LE);
  Object.assign(glb, {
    header: {
      byteOffset,
      byteLength,
      hasBinChunk: false
    },
    type,
    version,
    json: {},
    binChunks: []
  });
  byteOffset += GLB_FILE_HEADER_SIZE;
  switch (glb.version) {
    case 1:
      return parseGLBV1(glb, dataView, byteOffset);
    case 2:
      return parseGLBV2(glb, dataView, byteOffset, {});
    default:
      throw new Error("Invalid GLB version ".concat(glb.version, ". Only supports v1 and v2."));
  }
}
function parseGLBV1(glb, dataView, byteOffset) {
  assert$5(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  const contentLength = dataView.getUint32(byteOffset + 0, LE);
  const contentFormat = dataView.getUint32(byteOffset + 4, LE);
  byteOffset += GLB_CHUNK_HEADER_SIZE;
  assert$5(contentFormat === GLB_V1_CONTENT_FORMAT_JSON);
  parseJSONChunk(glb, dataView, byteOffset, contentLength);
  byteOffset += contentLength;
  byteOffset += parseBINChunk(glb, dataView, byteOffset, glb.header.byteLength);
  return byteOffset;
}
function parseGLBV2(glb, dataView, byteOffset, options) {
  assert$5(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  parseGLBChunksSync(glb, dataView, byteOffset, options);
  return byteOffset + glb.header.byteLength;
}
function parseGLBChunksSync(glb, dataView, byteOffset, options) {
  while (byteOffset + 8 <= glb.header.byteLength) {
    const chunkLength = dataView.getUint32(byteOffset + 0, LE);
    const chunkFormat = dataView.getUint32(byteOffset + 4, LE);
    byteOffset += GLB_CHUNK_HEADER_SIZE;
    switch (chunkFormat) {
      case GLB_CHUNK_TYPE_JSON:
        parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_BIN:
        parseBINChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
      case GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseBINChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
    }
    byteOffset += padToNBytes(chunkLength, 4);
  }
  return byteOffset;
}
function parseJSONChunk(glb, dataView, byteOffset, chunkLength) {
  const jsonChunk = new Uint8Array(dataView.buffer, byteOffset, chunkLength);
  const textDecoder = new TextDecoder('utf8');
  const jsonText = textDecoder.decode(jsonChunk);
  glb.json = JSON.parse(jsonText);
  return padToNBytes(chunkLength, 4);
}
function parseBINChunk(glb, dataView, byteOffset, chunkLength) {
  glb.header.hasBinChunk = true;
  glb.binChunks.push({
    byteOffset,
    byteLength: chunkLength,
    arrayBuffer: dataView.buffer
  });
  return padToNBytes(chunkLength, 4);
}

async function parseGLTF(gltf, arrayBufferOrString) {
  var _options$gltf, _options$gltf2, _options$gltf3, _options$gltf4;
  let byteOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let options = arguments.length > 3 ? arguments[3] : undefined;
  let context = arguments.length > 4 ? arguments[4] : undefined;
  parseGLTFContainerSync(gltf, arrayBufferOrString, byteOffset, options);
  normalizeGLTFV1(gltf, {
    normalize: options === null || options === void 0 ? void 0 : (_options$gltf = options.gltf) === null || _options$gltf === void 0 ? void 0 : _options$gltf.normalize
  });
  preprocessExtensions(gltf, options, context);
  const promises = [];
  if (options !== null && options !== void 0 && (_options$gltf2 = options.gltf) !== null && _options$gltf2 !== void 0 && _options$gltf2.loadBuffers && gltf.json.buffers) {
    await loadBuffers(gltf, options, context);
  }
  if (options !== null && options !== void 0 && (_options$gltf3 = options.gltf) !== null && _options$gltf3 !== void 0 && _options$gltf3.loadImages) {
    const promise = loadImages(gltf, options, context);
    promises.push(promise);
  }
  const promise = decodeExtensions(gltf, options, context);
  promises.push(promise);
  await Promise.all(promises);
  return options !== null && options !== void 0 && (_options$gltf4 = options.gltf) !== null && _options$gltf4 !== void 0 && _options$gltf4.postProcess ? postProcessGLTF(gltf, options) : gltf;
}
function parseGLTFContainerSync(gltf, data, byteOffset, options) {
  if (options.uri) {
    gltf.baseUri = options.uri;
  }
  if (data instanceof ArrayBuffer && !isGLB(data, byteOffset, options)) {
    const textDecoder = new TextDecoder();
    data = textDecoder.decode(data);
  }
  if (typeof data === 'string') {
    gltf.json = parseJSON(data);
  } else if (data instanceof ArrayBuffer) {
    const glb = {};
    byteOffset = parseGLBSync(glb, data, byteOffset, options.glb);
    assert$2(glb.type === 'glTF', "Invalid GLB magic string ".concat(glb.type));
    gltf._glb = glb;
    gltf.json = glb.json;
  } else {
    assert$2(false, 'GLTF: must be ArrayBuffer or string');
  }
  const buffers = gltf.json.buffers || [];
  gltf.buffers = new Array(buffers.length).fill(null);
  if (gltf._glb && gltf._glb.header.hasBinChunk) {
    const {
      binChunks
    } = gltf._glb;
    gltf.buffers[0] = {
      arrayBuffer: binChunks[0].arrayBuffer,
      byteOffset: binChunks[0].byteOffset,
      byteLength: binChunks[0].byteLength
    };
  }
  const images = gltf.json.images || [];
  gltf.images = new Array(images.length).fill({});
}
async function loadBuffers(gltf, options, context) {
  const buffers = gltf.json.buffers || [];
  for (let i = 0; i < buffers.length; ++i) {
    const buffer = buffers[i];
    if (buffer.uri) {
      var _context$fetch, _response$arrayBuffer;
      const {
        fetch
      } = context;
      assert$2(fetch);
      const uri = resolveUrl(buffer.uri, options);
      const response = await (context === null || context === void 0 ? void 0 : (_context$fetch = context.fetch) === null || _context$fetch === void 0 ? void 0 : _context$fetch.call(context, uri));
      const arrayBuffer = await (response === null || response === void 0 ? void 0 : (_response$arrayBuffer = response.arrayBuffer) === null || _response$arrayBuffer === void 0 ? void 0 : _response$arrayBuffer.call(response));
      gltf.buffers[i] = {
        arrayBuffer,
        byteOffset: 0,
        byteLength: arrayBuffer.byteLength
      };
      delete buffer.uri;
    } else if (gltf.buffers[i] === null) {
      gltf.buffers[i] = {
        arrayBuffer: new ArrayBuffer(buffer.byteLength),
        byteOffset: 0,
        byteLength: buffer.byteLength
      };
    }
  }
}
async function loadImages(gltf, options, context) {
  const imageIndices = getReferencesImageIndices(gltf);
  const images = gltf.json.images || [];
  const promises = [];
  for (const imageIndex of imageIndices) {
    promises.push(loadImage(gltf, images[imageIndex], imageIndex, options, context));
  }
  return await Promise.all(promises);
}
function getReferencesImageIndices(gltf) {
  const imageIndices = new Set();
  const textures = gltf.json.textures || [];
  for (const texture of textures) {
    if (texture.source !== undefined) {
      imageIndices.add(texture.source);
    }
  }
  return Array.from(imageIndices).sort();
}
async function loadImage(gltf, image, index, options, context) {
  const {
    fetch,
    parse
  } = context;
  let arrayBuffer;
  if (image.uri && !image.hasOwnProperty('bufferView')) {
    const uri = resolveUrl(image.uri, options);
    const response = await fetch(uri);
    arrayBuffer = await response.arrayBuffer();
    image.bufferView = {
      data: arrayBuffer
    };
  }
  if (Number.isFinite(image.bufferView)) {
    const array = getTypedArrayForBufferView(gltf.json, gltf.buffers, image.bufferView);
    arrayBuffer = sliceArrayBuffer(array.buffer, array.byteOffset, array.byteLength);
  }
  assert$2(arrayBuffer, 'glTF image has no data');
  let parsedImage = await parse(arrayBuffer, [ImageLoader, BasisLoader], {
    mimeType: image.mimeType,
    basis: options.basis || {
      format: selectSupportedBasisFormat()
    }
  }, context);
  if (parsedImage && parsedImage[0]) {
    parsedImage = {
      compressed: true,
      mipmaps: false,
      width: parsedImage[0].width,
      height: parsedImage[0].height,
      data: parsedImage[0]
    };
  }
  gltf.images = gltf.images || [];
  gltf.images[index] = parsedImage;
}

const GLTFLoader = {
  name: 'glTF',
  id: 'gltf',
  module: 'gltf',
  version: VERSION$1,
  extensions: ['gltf', 'glb'],
  mimeTypes: ['model/gltf+json', 'model/gltf-binary'],
  text: true,
  binary: true,
  tests: ['glTF'],
  parse,
  options: {
    gltf: {
      normalize: true,
      loadBuffers: true,
      loadImages: true,
      decompressMeshes: true,
      postProcess: true
    },
    log: console
  },
  deprecatedOptions: {
    fetchImages: 'gltf.loadImages',
    createImages: 'gltf.loadImages',
    decompress: 'gltf.decompressMeshes',
    postProcess: 'gltf.postProcess',
    gltf: {
      decompress: 'gltf.decompressMeshes'
    }
  }
};
async function parse(arrayBuffer) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let context = arguments.length > 2 ? arguments[2] : undefined;
  options = {
    ...GLTFLoader.options,
    ...options
  };
  options.gltf = {
    ...GLTFLoader.options.gltf,
    ...options.gltf
  };
  const {
    byteOffset = 0
  } = options;
  const gltf = {};
  return await parseGLTF(gltf, arrayBuffer, byteOffset, options, context);
}

/**
 * @desc Parses glTF into an {@link XKTModel}, supporting ````.glb```` and textures.
 *
 * * Supports ````.glb```` and textures
 * * For a lightweight glTF JSON parser that ignores textures, see {@link parseGLTFJSONIntoXKTModel}.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then load a binary glTF model into it.
 *
 * ````javascript
 * utils.loadArraybuffer("../assets/models/gltf/HousePlan/glTF-Binary/HousePlan.glb", async (data) => {
 *
 *     const xktModel = new XKTModel();
 *
 *     parseGLTFIntoXKTModel({
 *          data,
 *          xktModel,
 *          log: (msg) => { console.log(msg); }
 *     }).then(()=>{
 *        xktModel.finalize();
 *     },
 *     (msg) => {
 *         console.error(msg);
 *     });
 * });
 * ````
 *
 * @param {Object} params Parsing parameters.
 * @param {ArrayBuffer} params.data The glTF.
 * @param {String} [params.baseUri] The base URI used to load this glTF, if any. For resolving relative uris to linked resources.
 * @param {Object} [params.metaModelData] Metamodel JSON. If this is provided, then parsing is able to ensure that the XKTObjects it creates will fit the metadata properly.
 * @param {XKTModel} params.xktModel XKTModel to parse into.
 * @param {Boolean} [params.includeTextures=true] Whether to parse textures.
 * @param {Boolean} [params.includeNormals=true] Whether to parse normals. When false, the parser will ignore the glTF
 * geometry normals, and the glTF data will rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the glTF.
 * @param {Object} [params.stats] Collects statistics.
 * @param {function} [params.log] Logging callback.
 @returns {Promise} Resolves when glTF has been parsed.
 */
function parseGLTFIntoXKTModel({
                                   data,
                                   baseUri,
                                   xktModel,
                                   metaModelData,
                                   includeTextures = true,
                                   includeNormals = true,
                                   getAttachment,
                                   stats = {},
                                   log
                               }) {

    return new Promise(function (resolve, reject) {

        if (!data) {
            reject("Argument expected: data");
            return;
        }

        if (!xktModel) {
            reject("Argument expected: xktModel");
            return;
        }

        stats.sourceFormat = "glTF";
        stats.schemaVersion = "2.0";
        stats.title = "";
        stats.author = "";
        stats.created = "";
        stats.numTriangles = 0;
        stats.numVertices = 0;
        stats.numNormals = 0;
        stats.numUVs = 0;
        stats.numTextures = 0;
        stats.numObjects = 0;
        stats.numGeometries = 0;

        parse$2(data, GLTFLoader, {
            baseUri
        }).then((gltfData) => {

            const ctx = {
                gltfData,
                metaModelCorrections: metaModelData,
                getAttachment: getAttachment || (() => {
                    throw new Error('You must define getAttachment() method to convert glTF with external resources')
                }),
                log: (log || function (msg) {
                }),
                error: function (msg) {
                    console.error(msg);
                },
                xktModel,
                includeNormals: (includeNormals !== false),
                includeTextures: (includeTextures !== false),
                geometryCreated: {},
                nextId: 0,
                stats
            };

            ctx.log("Using parser: parseGLTFIntoXKTModel");
            ctx.log(`Parsing normals: ${ctx.includeNormals ? "enabled" : "disabled"}`);
            ctx.log(`Parsing textures: ${ctx.includeTextures ? "enabled" : "disabled"}`);

            if (ctx.includeTextures) {
                parseTextures(ctx);
            }
            parseMaterials(ctx);
            parseDefaultScene(ctx);

            resolve();

        }, (errMsg) => {
            reject(`[parseGLTFIntoXKTModel] ${errMsg}`);
        });
    });
}

function parseTextures(ctx) {
    const gltfData = ctx.gltfData;
    const textures = gltfData.textures;
    if (textures) {
        for (let i = 0, len = textures.length; i < len; i++) {
            parseTexture(ctx, textures[i]);
            ctx.stats.numTextures++;
        }
    }
}

function parseTexture(ctx, texture) {
    if (!texture.source || !texture.source.image) {
        return;
    }
    const textureId = `texture-${ctx.nextId++}`;

    let minFilter = NearestMipMapLinearFilter;
    switch (texture.sampler.minFilter) {
        case 9728:
            minFilter = NearestFilter;
            break;
        case 9729:
            minFilter = LinearFilter;
            break;
        case 9984:
            minFilter = NearestMipMapNearestFilter;
            break;
        case 9985:
            minFilter = LinearMipMapNearestFilter;
            break;
        case 9986:
            minFilter = NearestMipMapLinearFilter;
            break;
        case 9987:
            minFilter = LinearMipMapLinearFilter;
            break;
    }

    let magFilter = LinearFilter;
    switch (texture.sampler.magFilter) {
        case 9728:
            magFilter = NearestFilter;
            break;
        case 9729:
            magFilter = LinearFilter;
            break;
    }

    let wrapS = RepeatWrapping;
    switch (texture.sampler.wrapS) {
        case 33071:
            wrapS = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapS = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapS = RepeatWrapping;
            break;
    }

    let wrapT = RepeatWrapping;
    switch (texture.sampler.wrapT) {
        case 33071:
            wrapT = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapT = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapT = RepeatWrapping;
            break;
    }

    let wrapR = RepeatWrapping;
    switch (texture.sampler.wrapR) {
        case 33071:
            wrapR = ClampToEdgeWrapping;
            break;
        case 33648:
            wrapR = MirroredRepeatWrapping;
            break;
        case 10497:
            wrapR = RepeatWrapping;
            break;
    }

    ctx.xktModel.createTexture({
        textureId: textureId,
        imageData: texture.source.image,
        mediaType: texture.source.mediaType,
        compressed: true,
        width: texture.source.image.width,
        height: texture.source.image.height,
        minFilter,
        magFilter,
        wrapS,
        wrapT,
        wrapR,
        flipY: !!texture.flipY,
        //     encoding: "sRGB"
    });
    texture._textureId = textureId;
}

function parseMaterials(ctx) {
    const gltfData = ctx.gltfData;
    const materials = gltfData.materials;
    if (materials) {
        for (let i = 0, len = materials.length; i < len; i++) {
            const material = materials[i];
            material._textureSetId = ctx.includeTextures ? parseTextureSet(ctx, material) : null;
            material._attributes = parseMaterialAttributes(ctx, material);
        }
    }
}

function parseTextureSet(ctx, material) {
    const textureSetCfg = {};
    if (material.normalTexture) {
        textureSetCfg.normalTextureId = material.normalTexture.texture._textureId;
    }
    if (material.occlusionTexture) {
        textureSetCfg.occlusionTextureId = material.occlusionTexture.texture._textureId;
    }
    if (material.emissiveTexture) {
        textureSetCfg.emissiveTextureId = material.emissiveTexture.texture._textureId;
    }
    // const alphaMode = material.alphaMode;
    // switch (alphaMode) {
    //     case "NORMAL_OPAQUE":
    //         materialCfg.alphaMode = "opaque";
    //         break;
    //     case "MASK":
    //         materialCfg.alphaMode = "mask";
    //         break;
    //     case "BLEND":
    //         materialCfg.alphaMode = "blend";
    //         break;
    //     default:
    // }
    // const alphaCutoff = material.alphaCutoff;
    // if (alphaCutoff !== undefined) {
    //     materialCfg.alphaCutoff = alphaCutoff;
    // }
    const metallicPBR = material.pbrMetallicRoughness;
    if (material.pbrMetallicRoughness) {
        const pbrMetallicRoughness = material.pbrMetallicRoughness;
        const baseColorTexture = pbrMetallicRoughness.baseColorTexture || pbrMetallicRoughness.colorTexture;
        if (baseColorTexture) {
            if (baseColorTexture.texture) {
                textureSetCfg.colorTextureId = baseColorTexture.texture._textureId;
            } else {
                textureSetCfg.colorTextureId = ctx.gltfData.textures[baseColorTexture.index]._textureId;
            }
        }
        if (metallicPBR.metallicRoughnessTexture) {
            textureSetCfg.metallicRoughnessTextureId = metallicPBR.metallicRoughnessTexture.texture._textureId;
        }
    }
    const extensions = material.extensions;
    if (extensions) {
        const specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
        if (specularPBR) {
            specularPBR.specularTexture;
            const specularColorTexture = specularPBR.specularColorTexture;
            if (specularColorTexture !== null && specularColorTexture !== undefined) {
                textureSetCfg.colorTextureId = ctx.gltfData.textures[specularColorTexture.index]._textureId;
            }
        }
    }
    if (textureSetCfg.normalTextureId !== undefined ||
        textureSetCfg.occlusionTextureId !== undefined ||
        textureSetCfg.emissiveTextureId !== undefined ||
        textureSetCfg.colorTextureId !== undefined ||
        textureSetCfg.metallicRoughnessTextureId !== undefined) {
        textureSetCfg.textureSetId = `textureSet-${ctx.nextId++};`;
        ctx.xktModel.createTextureSet(textureSetCfg);
        ctx.stats.numTextureSets++;
        return textureSetCfg.textureSetId;
    }
    return null;
}

function parseMaterialAttributes(ctx, material) { // Substitute RGBA for material, to use fast flat shading instead
    const extensions = material.extensions;
    const materialAttributes = {
        color: new Float32Array([1, 1, 1, 1]),
        opacity: 1,
        metallic: 0,
        roughness: 1
    };
    if (extensions) {
        const specularPBR = extensions["KHR_materials_pbrSpecularGlossiness"];
        if (specularPBR) {
            const diffuseFactor = specularPBR.diffuseFactor;
            if (diffuseFactor !== null && diffuseFactor !== undefined) {
                materialAttributes.color.set(diffuseFactor);
            }
        }
        const common = extensions["KHR_materials_common"];
        if (common) {
            const technique = common.technique;
            const values = common.values || {};
            const blinn = technique === "BLINN";
            const phong = technique === "PHONG";
            const lambert = technique === "LAMBERT";
            const diffuse = values.diffuse;
            if (diffuse && (blinn || phong || lambert)) {
                if (!utils.isString(diffuse)) {
                    materialAttributes.color.set(diffuse);
                }
            }
            const transparency = values.transparency;
            if (transparency !== null && transparency !== undefined) {
                materialAttributes.opacity = transparency;
            }
            const transparent = values.transparent;
            if (transparent !== null && transparent !== undefined) {
                materialAttributes.opacity = transparent;
            }
        }
    }
    const metallicPBR = material.pbrMetallicRoughness;
    if (metallicPBR) {
        const baseColorFactor = metallicPBR.baseColorFactor;
        if (baseColorFactor) {
            materialAttributes.color[0] = baseColorFactor[0];
            materialAttributes.color[1] = baseColorFactor[1];
            materialAttributes.color[2] = baseColorFactor[2];
            materialAttributes.opacity = baseColorFactor[3];
        }
        const metallicFactor = metallicPBR.metallicFactor;
        if (metallicFactor !== null && metallicFactor !== undefined) {
            materialAttributes.metallic = metallicFactor;
        }
        const roughnessFactor = metallicPBR.roughnessFactor;
        if (roughnessFactor !== null && roughnessFactor !== undefined) {
            materialAttributes.roughness = roughnessFactor;
        }
    }
    return materialAttributes;
}

function parseDefaultScene(ctx) {
    const gltfData = ctx.gltfData;
    const scene = gltfData.scene || gltfData.scenes[0];
    if (!scene) {
        ctx.error("glTF has no default scene");
        return;
    }
    parseScene(ctx, scene);
}

function parseScene(ctx, scene) {
    const nodes = scene.nodes;
    if (!nodes) {
        return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        countMeshUsage(ctx, node);
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        parseNode(ctx, node, 0, null);
    }
}

function countMeshUsage(ctx, node) {
    const mesh = node.mesh;
    if (mesh) {
        mesh.instances = mesh.instances ? mesh.instances + 1 : 1;
    }
    if (node.children) {
        const children = node.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (!childNode) {
                ctx.error("Node not found: " + i);
                continue;
            }
            countMeshUsage(ctx, childNode);
        }
    }
}

const objectIdStack = [];
const meshIdsStack = [];

let meshIds = null;

function parseNode(ctx, node, depth, matrix) {

    const xktModel = ctx.xktModel;

    // Pre-order visit scene node

    let localMatrix;
    if (node.matrix) {
        localMatrix = node.matrix;
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.translation) {
        localMatrix = math.translationMat4v(node.translation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.rotation) {
        localMatrix = math.quaternionToMat4(node.rotation);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }
    if (node.scale) {
        localMatrix = math.scalingMat4v(node.scale);
        if (matrix) {
            matrix = math.mulMat4(matrix, localMatrix, math.mat4());
        } else {
            matrix = localMatrix;
        }
    }

    if (node.name) {
        meshIds = [];
        let xktEntityId = node.name;
        if (!!xktEntityId && xktModel.entities[xktEntityId]) {
            ctx.log(`Warning: Two or more glTF nodes found with same 'name' attribute: '${xktEntityId} - will randomly-generating an object ID in XKT`);
        }
        while (!xktEntityId || xktModel.entities[xktEntityId]) {
            xktEntityId = "entity-" + ctx.nextId++;
        }
        objectIdStack.push(xktEntityId);
        meshIdsStack.push(meshIds);
    }

    if (meshIds && node.mesh) {

        const mesh = node.mesh;
        const numPrimitives = mesh.primitives.length;

        if (numPrimitives > 0) {
            for (let i = 0; i < numPrimitives; i++) {
                const primitive = mesh.primitives[i];
                if (!primitive._xktGeometryId) {
                    const xktGeometryId = "geometry-" + ctx.nextId++;
                    const geometryCfg = {
                        geometryId: xktGeometryId
                    };
                    switch (primitive.mode) {
                        case 0: // POINTS
                            geometryCfg.primitiveType = "points";
                            break;
                        case 1: // LINES
                            geometryCfg.primitiveType = "lines";
                            break;
                        case 2: // LINE_LOOP
                            geometryCfg.primitiveType = "line-loop";
                            break;
                        case 3: // LINE_STRIP
                            geometryCfg.primitiveType = "line-strip";
                            break;
                        case 4: // TRIANGLES
                            geometryCfg.primitiveType = "triangles";
                            break;
                        case 5: // TRIANGLE_STRIP
                            geometryCfg.primitiveType = "triangle-strip";
                            break;
                        case 6: // TRIANGLE_FAN
                            geometryCfg.primitiveType = "triangle-fan";
                            break;
                        default:
                            geometryCfg.primitiveType = "triangles";
                    }
                    const POSITION = primitive.attributes.POSITION;
                    if (!POSITION) {
                        continue;
                    }
                    geometryCfg.positions = primitive.attributes.POSITION.value;
                    ctx.stats.numVertices += geometryCfg.positions.length / 3;
                    if (ctx.includeNormals) {
                        if (primitive.attributes.NORMAL) {
                            geometryCfg.normals = primitive.attributes.NORMAL.value;
                            ctx.stats.numNormals += geometryCfg.normals.length / 3;
                        }
                    }
                    if (primitive.attributes.COLOR_0) {
                        geometryCfg.colorsCompressed = primitive.attributes.COLOR_0.value;
                    }
                    if (ctx.includeTextures) {
                        if (primitive.attributes.TEXCOORD_0) {
                            geometryCfg.uvs = primitive.attributes.TEXCOORD_0.value;
                            ctx.stats.numUVs += geometryCfg.uvs.length / 2;
                        }
                    }
                    if (primitive.indices) {
                        geometryCfg.indices = primitive.indices.value;
                        if (primitive.mode === 4) {
                            ctx.stats.numTriangles += geometryCfg.indices.length / 3;
                        }
                    }
                    xktModel.createGeometry(geometryCfg);
                    primitive._xktGeometryId = xktGeometryId;
                    ctx.stats.numGeometries++;
                }

                const xktMeshId = ctx.nextId++;
                const meshCfg = {
                    meshId: xktMeshId,
                    geometryId: primitive._xktGeometryId,
                    matrix: matrix ? matrix.slice() : math.identityMat4()
                };
                const material = primitive.material;
                if (material) {
                    meshCfg.textureSetId = material._textureSetId;
                    meshCfg.color = material._attributes.color;
                    meshCfg.opacity = material._attributes.opacity;
                    meshCfg.metallic = material._attributes.metallic;
                    meshCfg.roughness = material._attributes.roughness;
                } else {
                    meshCfg.color = [1.0, 1.0, 1.0];
                    meshCfg.opacity = 1.0;
                }
                xktModel.createMesh(meshCfg);
                meshIds.push(xktMeshId);
            }
        }
    }

    // Visit child scene nodes

    if (node.children) {
        const children = node.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            parseNode(ctx, childNode, depth + 1, matrix);
        }
    }

    // Post-order visit scene node

    const nodeName = node.name;
    if ((nodeName !== undefined && nodeName !== null) || depth === 0) {
        if (nodeName === undefined || nodeName === null) {
            ctx.log(`Warning: 'name' properties not found on glTF scene nodes - will randomly-generate object IDs in XKT`);
        }
        let xktEntityId = objectIdStack.pop();
        if (!xktEntityId) { // For when there are no nodes with names
            xktEntityId = "entity-" + ctx.nextId++;
        }
        let entityMeshIds = meshIdsStack.pop();
        if (meshIds && meshIds.length > 0) {
            xktModel.createEntity({
                entityId: xktEntityId,
                meshIds: entityMeshIds
            });
        }
        ctx.stats.numObjects++;
        meshIds = meshIdsStack.length > 0 ? meshIdsStack[meshIdsStack.length - 1] : null;
    }
}

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}


var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;

var deflate_1$1 = {
	Deflate: Deflate_1$1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1$1,
	gzip: gzip_1$1,
	constants: constants$1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD$1 = 16209;       /* got a data error -- remain here until reset */
const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


var inftrees = inflate_table;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.






const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
  Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Uint8Array(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate$2 = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR$1;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$1;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$1;
};


var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
} = constants$2;

/* ===========================================================================*/


/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ''
  }, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  let status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Skip snyc markers if more data follows and not raw mode
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           strm.state.wrap > 0 &&
           data[strm.next_in] !== 0)
    {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }

    // Must repeat iteration if out buffer is full
    if (status === Z_OK && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};

const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
var deflate_1 = deflate;

const XKT_VERSION = XKT_INFO.xktVersion;
const NUM_TEXTURE_ATTRIBUTES = 9;
const NUM_MATERIAL_ATTRIBUTES = 6;

/**
 * Writes an {@link XKTModel} to an {@link ArrayBuffer}.
 *
 * @param {XKTModel} xktModel The {@link XKTModel}.
 * @param {String} metaModelJSON The metamodel JSON in a string.
 * @param {Object} [stats] Collects statistics.
 * @param {Object} options Options for how the XKT is written.
 * @param {Boolean} [options.zip=true] ZIP the contents?
 * @returns {ArrayBuffer} The {@link ArrayBuffer}.
 */
function writeXKTModelToArrayBuffer(xktModel, metaModelJSON, stats, options) {
    const data = getModelData(xktModel, metaModelJSON, stats);
    const deflatedData = deflateData(data, metaModelJSON, options);
    stats.texturesSize += deflatedData.textureData.byteLength;
    const arrayBuffer = createArrayBuffer(deflatedData);
    return arrayBuffer;
}

function getModelData(xktModel, metaModelDataStr, stats) {

    //------------------------------------------------------------------------------------------------------------------
    // Allocate data
    //------------------------------------------------------------------------------------------------------------------

    const propertySetsList = xktModel.propertySetsList;
    const metaObjectsList = xktModel.metaObjectsList;
    const geometriesList = xktModel.geometriesList;
    const texturesList = xktModel.texturesList;
    const textureSetsList = xktModel.textureSetsList;
    const meshesList = xktModel.meshesList;
    const entitiesList = xktModel.entitiesList;
    const tilesList = xktModel.tilesList;

    const numPropertySets = propertySetsList.length;
    const numMetaObjects = metaObjectsList.length;
    const numGeometries = geometriesList.length;
    const numTextures = texturesList.length;
    const numTextureSets = textureSetsList.length;
    const numMeshes = meshesList.length;
    const numEntities = entitiesList.length;
    const numTiles = tilesList.length;

    let lenPositions = 0;
    let lenNormals = 0;
    let lenColors = 0;
    let lenUVs = 0;
    let lenIndices = 0;
    let lenEdgeIndices = 0;
    let lenMatrices = 0;
    let lenTextures = 0;

    for (let geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {
        const geometry = geometriesList [geometryIndex];
        if (geometry.positionsQuantized) {
            lenPositions += geometry.positionsQuantized.length;
        }
        if (geometry.normalsOctEncoded) {
            lenNormals += geometry.normalsOctEncoded.length;
        }
        if (geometry.colorsCompressed) {
            lenColors += geometry.colorsCompressed.length;
        }
        if (geometry.uvs) {
            lenUVs += geometry.uvs.length;
        }
        if (geometry.indices) {
            lenIndices += geometry.indices.length;
        }
        if (geometry.edgeIndices) {
            lenEdgeIndices += geometry.edgeIndices.length;
        }
    }

    for (let textureIndex = 0; textureIndex < numTextures; textureIndex++) {
        const xktTexture = texturesList[textureIndex];
        const imageData = xktTexture.imageData;
        lenTextures += imageData.byteLength;

        if (xktTexture.compressed) {
            stats.numCompressedTextures++;
        }
    }

    for (let meshIndex = 0; meshIndex < numMeshes; meshIndex++) {
        const mesh = meshesList[meshIndex];
        if (mesh.geometry.numInstances > 1) {
            lenMatrices += 16;
        }
    }

    const data = {
        metadata: {},
        textureData: new Uint8Array(lenTextures), // All textures
        eachTextureDataPortion: new Uint32Array(numTextures), // For each texture, an index to its first element in textureData
        eachTextureAttributes: new Uint16Array(numTextures * NUM_TEXTURE_ATTRIBUTES),
        positions: new Uint16Array(lenPositions), // All geometry arrays
        normals: new Int8Array(lenNormals),
        colors: new Uint8Array(lenColors),
        uvs: new Float32Array(lenUVs),
        indices: new Uint32Array(lenIndices),
        edgeIndices: new Uint32Array(lenEdgeIndices),
        eachTextureSetTextures: new Int32Array(numTextureSets * 5), // For each texture set, a set of five Texture indices [color, metal/roughness,normals,emissive,occlusion]; each index has value -1 if no texture
        matrices: new Float32Array(lenMatrices), // Modeling matrices for entities that share geometries. Each entity either shares all it's geometries, or owns all its geometries exclusively. Exclusively-owned geometries are pre-transformed into World-space, and so their entities don't have modeling matrices in this array.
        reusedGeometriesDecodeMatrix: new Float32Array(xktModel.reusedGeometriesDecodeMatrix), // A single, global vertex position de-quantization matrix for all reused geometries. Reused geometries are quantized to their collective Local-space AABB, and this matrix is derived from that AABB.
        eachGeometryPrimitiveType: new Uint8Array(numGeometries), // Primitive type for each geometry (0=solid triangles, 1=surface triangles, 2=lines, 3=points, 4=line-strip)
        eachGeometryPositionsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.positions. Every primitive type has positions.
        eachGeometryNormalsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.normals. If the next geometry has the same index, then this geometry has no normals.
        eachGeometryColorsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.colors. If the next geometry has the same index, then this geometry has no colors.
        eachGeometryUVsPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.uvs. If the next geometry has the same index, then this geometry has no UVs.
        eachGeometryIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.indices. If the next geometry has the same index, then this geometry has no indices.
        eachGeometryEdgeIndicesPortion: new Uint32Array(numGeometries), // For each geometry, an index to its first element in data.edgeIndices. If the next geometry has the same index, then this geometry has no edge indices.
        eachMeshGeometriesPortion: new Uint32Array(numMeshes), // For each mesh, an index into the eachGeometry* arrays
        eachMeshMatricesPortion: new Uint32Array(numMeshes), // For each mesh that shares its geometry, an index to its first element in data.matrices, to indicate the modeling matrix that transforms the shared geometry Local-space vertex positions. This is ignored for meshes that don't share geometries, because the vertex positions of non-shared geometries are pre-transformed into World-space.
        eachMeshTextureSet: new Int32Array(numMeshes), // For each mesh, the index of its texture set in data.eachTextureSetTextures; this array contains signed integers so that we can use -1 to indicate when a mesh has no texture set
        eachMeshMaterialAttributes: new Uint8Array(numMeshes * NUM_MATERIAL_ATTRIBUTES), // For each mesh, an RGBA integer color of format [0..255, 0..255, 0..255, 0..255], and PBR metallic and roughness factors, of format [0..255, 0..255]
        eachEntityId: [], // For each entity, an ID string
        eachEntityMeshesPortion: new Uint32Array(numEntities), // For each entity, the index of the first element of meshes used by the entity
        eachTileAABB: new Float64Array(numTiles * 6), // For each tile, an axis-aligned bounding box
        eachTileEntitiesPortion: new Uint32Array(numTiles) // For each tile, the index of the first element of eachEntityId, eachEntityMeshesPortion and eachEntityMatricesPortion used by the tile
    };

    let countPositions = 0;
    let countNormals = 0;
    let countColors = 0;
    let countUVs = 0;
    let countIndices = 0;
    let countEdgeIndices = 0;

    // Metadata

    data.metadata = {
        id: xktModel.modelId,
        projectId: xktModel.projectId,
        revisionId: xktModel.revisionId,
        author: xktModel.author,
        createdAt: xktModel.createdAt,
        creatingApplication: xktModel.creatingApplication,
        schema: xktModel.schema,
        propertySets: [],
        metaObjects: []
    };

    // Property sets

    for (let propertySetsIndex = 0; propertySetsIndex < numPropertySets; propertySetsIndex++) {
        const propertySet = propertySetsList[propertySetsIndex];
        const propertySetJSON = {
            id: "" + propertySet.propertySetId,
            name: propertySet.propertySetName,
            type: propertySet.propertySetType,
            properties: propertySet.properties
        };
        data.metadata.propertySets.push(propertySetJSON);
    }

    // Metaobjects

    if (!metaModelDataStr) {
        for (let metaObjectsIndex = 0; metaObjectsIndex < numMetaObjects; metaObjectsIndex++) {
            const metaObject = metaObjectsList[metaObjectsIndex];
            const metaObjectJSON = {
                name: metaObject.metaObjectName,
                type: metaObject.metaObjectType,
                id: "" + metaObject.metaObjectId
            };
            if (metaObject.parentMetaObjectId !== undefined && metaObject.parentMetaObjectId !== null) {
                metaObjectJSON.parent = "" + metaObject.parentMetaObjectId;
            }
            if (metaObject.propertySetIds && metaObject.propertySetIds.length > 0) {
                metaObjectJSON.propertySetIds = metaObject.propertySetIds;
            }
            if (metaObject.external) {
                metaObjectJSON.external = metaObject.external;
            }
            data.metadata.metaObjects.push(metaObjectJSON);
        }
    }

    // Geometries

    for (let geometryIndex = 0; geometryIndex < numGeometries; geometryIndex++) {
        const geometry = geometriesList [geometryIndex];
        let primitiveType = 1;
        switch (geometry.primitiveType) {
            case "triangles":
                primitiveType = geometry.solid ? 0 : 1;
                break;
            case "points":
                primitiveType = 2;
                break;
            case "lines":
                primitiveType = 3;
                break;
            case "line-strip":
            case "line-loop":
                primitiveType = 4;
                break;
            case "triangle-strip":
                primitiveType = 5;
                break;
            case "triangle-fan":
                primitiveType = 6;
                break;
            default:
                primitiveType = 1;
        }
        data.eachGeometryPrimitiveType [geometryIndex] = primitiveType;
        data.eachGeometryPositionsPortion [geometryIndex] = countPositions;
        data.eachGeometryNormalsPortion [geometryIndex] = countNormals;
        data.eachGeometryColorsPortion [geometryIndex] = countColors;
        data.eachGeometryUVsPortion [geometryIndex] = countUVs;
        data.eachGeometryIndicesPortion [geometryIndex] = countIndices;
        data.eachGeometryEdgeIndicesPortion [geometryIndex] = countEdgeIndices;
        if (geometry.positionsQuantized) {
            data.positions.set(geometry.positionsQuantized, countPositions);
            countPositions += geometry.positionsQuantized.length;
        }
        if (geometry.normalsOctEncoded) {
            data.normals.set(geometry.normalsOctEncoded, countNormals);
            countNormals += geometry.normalsOctEncoded.length;
        }
        if (geometry.colorsCompressed) {
            data.colors.set(geometry.colorsCompressed, countColors);
            countColors += geometry.colorsCompressed.length;
        }
        if (geometry.uvs) {
            data.uvs.set(geometry.uvs, countUVs);
            countUVs += geometry.uvs.length;
        }
        if (geometry.indices) {
            data.indices.set(geometry.indices, countIndices);
            countIndices += geometry.indices.length;
        }
        if (geometry.edgeIndices) {
            data.edgeIndices.set(geometry.edgeIndices, countEdgeIndices);
            countEdgeIndices += geometry.edgeIndices.length;
        }
    }

    // Textures

    for (let textureIndex = 0, numTextures = xktModel.texturesList.length, portionIdx = 0; textureIndex < numTextures; textureIndex++) {
        const xktTexture = xktModel.texturesList[textureIndex];
        const imageData = xktTexture.imageData;
        data.textureData.set(imageData, portionIdx);
        data.eachTextureDataPortion[textureIndex] = portionIdx;

        portionIdx += imageData.byteLength;

        let textureAttrIdx = textureIndex * NUM_TEXTURE_ATTRIBUTES;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.compressed ? 1 : 0;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.mediaType; // GIFMediaType | PNGMediaType | JPEGMediaType
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.width;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.height;
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.minFilter; // LinearMipmapLinearFilter | LinearMipMapNearestFilter | NearestMipMapNearestFilter | NearestMipMapLinearFilter | LinearMipMapLinearFilter
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.magFilter; // LinearFilter | NearestFilter
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapS; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapT; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
        data.eachTextureAttributes[textureAttrIdx++] = xktTexture.wrapR; // ClampToEdgeWrapping | MirroredRepeatWrapping | RepeatWrapping
    }

    // Texture sets

    for (let textureSetIndex = 0, numTextureSets = xktModel.textureSetsList.length, eachTextureSetTexturesIndex = 0; textureSetIndex < numTextureSets; textureSetIndex++) {
        const textureSet = textureSetsList[textureSetIndex];
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.colorTexture ? textureSet.colorTexture.textureIndex : -1; // Color map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.metallicRoughnessTexture ? textureSet.metallicRoughnessTexture.textureIndex : -1; // Metal/rough map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.normalsTexture ? textureSet.normalsTexture.textureIndex : -1; // Normal map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.emissiveTexture ? textureSet.emissiveTexture.textureIndex : -1; // Emissive map
        data.eachTextureSetTextures[eachTextureSetTexturesIndex++] = textureSet.occlusionTexture ? textureSet.occlusionTexture.textureIndex : -1; // Occlusion map
    }

    // Tiles -> Entities -> Meshes

    let entityIndex = 0;
    let countEntityMeshesPortion = 0;
    let eachMeshMaterialAttributesIndex = 0;
    let matricesIndex = 0;
    let meshIndex = 0;

    for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {

        const tile = tilesList [tileIndex];
        const tileEntities = tile.entities;
        const numTileEntities = tileEntities.length;

        if (numTileEntities === 0) {
            continue;
        }

        data.eachTileEntitiesPortion[tileIndex] = entityIndex;

        const tileAABB = tile.aabb;

        for (let j = 0; j < numTileEntities; j++) {

            const entity = tileEntities[j];
            const entityMeshes = entity.meshes;
            const numEntityMeshes = entityMeshes.length;

            for (let k = 0; k < numEntityMeshes; k++) {

                const mesh = entityMeshes[k];
                const geometry = mesh.geometry;
                const geometryIndex = geometry.geometryIndex;

                data.eachMeshGeometriesPortion [countEntityMeshesPortion + k] = geometryIndex;

                if (mesh.geometry.numInstances > 1) {
                    data.matrices.set(mesh.matrix, matricesIndex);
                    data.eachMeshMatricesPortion [meshIndex] = matricesIndex;
                    matricesIndex += 16;
                }

                data.eachMeshTextureSet[meshIndex] = mesh.textureSet ? mesh.textureSet.textureSetIndex : -1;

                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[0] * 255); // Color RGB
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[1] * 255);
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.color[2] * 255);
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.opacity * 255); // Opacity
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.metallic * 255); // Metallic
                data.eachMeshMaterialAttributes[eachMeshMaterialAttributesIndex++] = (mesh.roughness * 255); // Roughness

                meshIndex++;
            }

            data.eachEntityId [entityIndex] = entity.entityId;
            data.eachEntityMeshesPortion[entityIndex] = countEntityMeshesPortion; // <<<<<<<<<<<<<<<<<<<< Error here? Order/value of countEntityMeshesPortion correct?

            entityIndex++;
            countEntityMeshesPortion += numEntityMeshes;
        }

        const tileAABBIndex = tileIndex * 6;

        data.eachTileAABB.set(tileAABB, tileAABBIndex);
    }

    return data;
}

function deflateData(data, metaModelJSON, options) {

    function deflate(buffer) {
        return (options.zip !== false) ? deflate_1(buffer) : buffer;
    }

    let metaModelBytes;
    if (metaModelJSON) {
        const deflatedJSON = deflateJSON(metaModelJSON);
        metaModelBytes = deflate(deflatedJSON);
    } else {
        const deflatedJSON = deflateJSON(data.metadata);
        metaModelBytes = deflate(deflatedJSON);
    }

    return {
        metadata: metaModelBytes,
        textureData: deflate(data.textureData.buffer),
        eachTextureDataPortion: deflate(data.eachTextureDataPortion.buffer),
        eachTextureAttributes: deflate(data.eachTextureAttributes.buffer),
        positions: deflate(data.positions.buffer),
        normals: deflate(data.normals.buffer),
        colors: deflate(data.colors.buffer),
        uvs: deflate(data.uvs.buffer),
        indices: deflate(data.indices.buffer),
        edgeIndices: deflate(data.edgeIndices.buffer),
        eachTextureSetTextures: deflate(data.eachTextureSetTextures.buffer),
        matrices: deflate(data.matrices.buffer),
        reusedGeometriesDecodeMatrix: deflate(data.reusedGeometriesDecodeMatrix.buffer),
        eachGeometryPrimitiveType: deflate(data.eachGeometryPrimitiveType.buffer),
        eachGeometryPositionsPortion: deflate(data.eachGeometryPositionsPortion.buffer),
        eachGeometryNormalsPortion: deflate(data.eachGeometryNormalsPortion.buffer),
        eachGeometryColorsPortion: deflate(data.eachGeometryColorsPortion.buffer),
        eachGeometryUVsPortion: deflate(data.eachGeometryUVsPortion.buffer),
        eachGeometryIndicesPortion: deflate(data.eachGeometryIndicesPortion.buffer),
        eachGeometryEdgeIndicesPortion: deflate(data.eachGeometryEdgeIndicesPortion.buffer),
        eachMeshGeometriesPortion: deflate(data.eachMeshGeometriesPortion.buffer),
        eachMeshMatricesPortion: deflate(data.eachMeshMatricesPortion.buffer),
        eachMeshTextureSet: deflate(data.eachMeshTextureSet.buffer),
        eachMeshMaterialAttributes: deflate(data.eachMeshMaterialAttributes.buffer),
        eachEntityId: deflate(JSON.stringify(data.eachEntityId)
            .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
            })),
        eachEntityMeshesPortion: deflate(data.eachEntityMeshesPortion.buffer),
        eachTileAABB: deflate(data.eachTileAABB.buffer),
        eachTileEntitiesPortion: deflate(data.eachTileEntitiesPortion.buffer)
    };
}

function deflateJSON(strings) {
    return JSON.stringify(strings)
        .replace(/[\u007F-\uFFFF]/g, function (chr) { // Produce only ASCII-chars, so that the data can be inflated later
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
}

function createArrayBuffer(deflatedData) {
    return toArrayBuffer$1([
        deflatedData.metadata,
        deflatedData.textureData,
        deflatedData.eachTextureDataPortion,
        deflatedData.eachTextureAttributes,
        deflatedData.positions,
        deflatedData.normals,
        deflatedData.colors,
        deflatedData.uvs,
        deflatedData.indices,
        deflatedData.edgeIndices,
        deflatedData.eachTextureSetTextures,
        deflatedData.matrices,
        deflatedData.reusedGeometriesDecodeMatrix,
        deflatedData.eachGeometryPrimitiveType,
        deflatedData.eachGeometryPositionsPortion,
        deflatedData.eachGeometryNormalsPortion,
        deflatedData.eachGeometryColorsPortion,
        deflatedData.eachGeometryUVsPortion,
        deflatedData.eachGeometryIndicesPortion,
        deflatedData.eachGeometryEdgeIndicesPortion,
        deflatedData.eachMeshGeometriesPortion,
        deflatedData.eachMeshMatricesPortion,
        deflatedData.eachMeshTextureSet,
        deflatedData.eachMeshMaterialAttributes,
        deflatedData.eachEntityId,
        deflatedData.eachEntityMeshesPortion,
        deflatedData.eachTileAABB,
        deflatedData.eachTileEntitiesPortion
    ]);
}

function toArrayBuffer$1(elements) {
    const indexData = new Uint32Array(elements.length + 2);
    indexData[0] = XKT_VERSION;
    indexData [1] = elements.length;  // Stored Data 1.1: number of stored elements
    let dataLen = 0;    // Stored Data 1.2: length of stored elements
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const elementsize = element.length;
        indexData[i + 2] = elementsize;
        dataLen += elementsize;
    }
    const indexBuf = new Uint8Array(indexData.buffer);
    const dataArray = new Uint8Array(indexBuf.length + dataLen);
    dataArray.set(indexBuf);
    let offset = indexBuf.length;
    for (let i = 0, len = elements.length; i < len; i++) {     // Stored Data 2: the elements themselves
        const element = elements[i];
        dataArray.set(element, offset);
        offset += element.length;
    }
    return dataArray.buffer;
}

/**
 * @private
 * @param buf
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

/**
 * Converts model files into xeokit's native XKT format.
 *
 * Supported source formats are: IFC, CityJSON, glTF, LAZ and LAS.
 *
 * **Only bundled in xeokit-convert.cjs.js.**
 *
 * ## Usage
 *
 ````
 * @param {Object} params Conversion parameters.
 * @param {Object} params.WebIFC The WebIFC library. We pass this in as an external dependency, in order to give the
 * caller the choice of whether to use the Browser or NodeJS version.
 * @param {*} [params.configs] Configurations.
 * @param {ArrayBuffer|JSON} [params.sourceData] Source file data. Alternative to ````source````.
 * @param {Function} [params.outputXKTModel] Callback to collect the ````XKTModel```` that is internally build by this method.
 * @param {Function} [params.outputXKT] Callback to collect XKT file data.
 * @param {String[]} [params.includeTypes] Option to only convert objects of these types.
 * @param {String[]} [params.excludeTypes] Option to never convert objects of these types.
 * @param {Object} [stats] Collects conversion statistics. Statistics are attached to this object if provided.
 * @param {Function} [params.outputStats] Callback to collect statistics.
 * @param {Boolean} [params.rotateX=false] Whether to rotate the model 90 degrees about the X axis to make the Y axis "up", if necessary. Applies to CityJSON and LAS/LAZ models.
 * @param {Boolean} [params.reuseGeometries=true] When true, will enable geometry reuse within the XKT. When false,
 * will automatically "expand" all reused geometries into duplicate copies. This has the drawback of increasing the XKT
 * file size (~10-30% for typical models), but can make the model more responsive in the xeokit Viewer, especially if the model
 * has excessive geometry reuse. An example of excessive geometry reuse would be when a model (eg. glTF) has 4000 geometries that are
 * shared amongst 2000 objects, ie. a large number of geometries with a low amount of reuse, which can present a
 * pathological performance case for xeokit's underlying graphics APIs (WebGL, WebGPU etc).
 * @param {Boolean} [params.includeTextures=true] Whether to convert textures. Only works for ````glTF```` models.
 * @param {Boolean} [params.includeNormals=true] Whether to convert normals. When false, the parser will ignore
 * geometry normals, and the modelwill rely on the xeokit ````Viewer```` to automatically generate them. This has
 * the limitation that the normals will be face-aligned, and therefore the ````Viewer```` will only be able to render
 * a flat-shaded non-PBR representation of the model.
 * @param {Number} [params.minTileSize=200] Minimum RTC coordinate tile size. Set this to a value between 100 and 10000,
 * depending on how far from the coordinate origin the model's vertex positions are; specify larger tile sizes when close
 * to the origin, and smaller sizes when distant.  This compensates for decreasing precision as floats get bigger.
 * @param {Function} [params.log] Logging callback.
 * @return {Promise<number>}
 */
function convert2xkt({
                         configs = {},
                         sourceData,
                         modelAABB,
                         outputXKTModel,
                         outputXKT,
                         includeTypes,
                         excludeTypes,
                         reuseGeometries = true,
                         minTileSize = 200,
                         stats = {},
                         rotateX = false,
                         includeTextures = true,
                         includeNormals = true,
                         log = function (msg) {
                         }
                     }) {

    stats.schemaVersion = "";
    stats.title = "";
    stats.author = "";
    stats.created = "";
    stats.numMetaObjects = 0;
    stats.numPropertySets = 0;
    stats.numTriangles = 0;
    stats.numVertices = 0;
    stats.numNormals = 0;
    stats.numUVs = 0;
    stats.numTextures = 0;
    stats.numTextureSets = 0;
    stats.numObjects = 0;
    stats.numGeometries = 0;
    stats.sourceSize = 0;
    stats.xktSize = 0;
    stats.texturesSize = 0;
    stats.xktVersion = "";
    stats.compressionRatio = 0;
    stats.conversionTime = 0;
    stats.aabb = null;

    return new Promise(function (resolve, reject) {
        const _log = log;
        log = (msg) => {
            _log(`[convert2xkt] ${msg}`);
        };

        if (!sourceData) {
            reject("Argument expected: source or sourceData");
            return;
        }

        if (!outputXKTModel && !outputXKT) {
            reject("Argument expected: output, outputXKTModel or outputXKT");
            return;
        }

        const sourceConfigs = configs.sourceConfigs || {};
        const ext = 'glb';

        log(`Input file extension: "${ext}"`);

        let fileTypeConfigs = sourceConfigs[ext];

        if (!fileTypeConfigs) {
            log(`[WARNING] Could not find configs sourceConfigs entry for source format "${ext}". This is derived from the source file name extension. Will use internal default configs.`);
            fileTypeConfigs = {};
        }

        function overrideOption(option1, option2) {
            if (option1 !== undefined) {
                return option1;
            }
            return option2;
        }


        const sourceFileSizeBytes = sourceData.byteLength;

        log("Input file size: " + (sourceFileSizeBytes / 1000).toFixed(2) + " kB");



        minTileSize = overrideOption(fileTypeConfigs.minTileSize, minTileSize);
        rotateX = overrideOption(fileTypeConfigs.rotateX, rotateX);
        reuseGeometries = overrideOption(fileTypeConfigs.reuseGeometries, reuseGeometries);
        includeTextures = overrideOption(fileTypeConfigs.includeTextures, includeTextures);
        includeNormals = overrideOption(fileTypeConfigs.includeNormals, includeNormals);
        includeTypes = overrideOption(fileTypeConfigs.includeTypes, includeTypes);
        excludeTypes = overrideOption(fileTypeConfigs.excludeTypes, excludeTypes);

        if (reuseGeometries === false) {
            log("Geometry reuse is disabled");
        }

        const xktModel = new XKTModel({
            minTileSize,
            modelAABB
        });



        sourceData = toArrayBuffer(sourceData);
        convert(parseGLTFIntoXKTModel, {
            data: sourceData,
            reuseGeometries,
            includeTextures: true,
            includeNormals,
            xktModel,
            stats,
            log
        });


        function convert(parser, converterParams) {

            parser(converterParams).then(() => {


                log("Input file parsed OK. Building XKT document...");

                xktModel.finalize().then(() => {

                    log("XKT document built OK. Writing to XKT file...");

                    const xktArrayBuffer = writeXKTModelToArrayBuffer(xktModel, null, stats, {zip: true});

                    const xktContent = Buffer.from(xktArrayBuffer);


                    if (outputXKT) {
                        outputXKT(xktContent);
                    }

                    resolve();
                });
            }, (err) => {
                reject(err);
            });
        }
    });
}

exports.convert2xkt = convert2xkt;
