/**
 * @param {string} dto dtoModel
 * @param {object} data 需要校验的入参
 */
const checkDto = (dto, data) => {
    check(dto, data)
    return data;
}

const check = (dto, data) => {
    Object.keys(dto).forEach(k => {
        const M = dto[k];
        let T = data[k];
        // 缺少必须参数
        if (M.required && T === undefined) throw new Error(`missing required field '${k}'`)
        // 没有参数， 跳过
        if (!M.required && T === undefined) return;
        // 判断string 
        if (M.type.toLowerCase() === 'string') T = checkStr(M, T, k);
        // 判断number
        if (M.type.toLowerCase() === 'number') T = checkNumber(M, T, k);
        // 判断 boolean
        if (M.type.toLowerCase() === 'boolean' || M.type.toLowerCase() === 'bool') T = checkBoolean(M, T, k);
        // 判断数组
        if (M.type.toLowerCase() === 'array') T = checkArray(M, T, k);
        // 判断对象
        if (M.type.toLowerCase() === 'object') T = checkObject(M, T, k);
        // 判断枚举
        if (M.type.toLowerCase() === 'enum') T = checkEnum(M, T, k)
        data[k] = T;
    })
    return data;
}

/***
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */
const checkStr = (M, T, key) => {
    try {
        if (typeof T !== 'string') {
            if (typeof T === 'object') { T = JSON.stringify(T); }
            else { T = T.toString(); }
        }
        if (M.allowNull !== undefined && M.allowNull === false && T.toLowerCase() === 'null') throw new Error(`field '${key}' can not be null`);
        if (M.allowEmpty !== undefined && M.allowEmpty === false && T.length === 0) throw new Error(`field '${key}' can not be an empty string`);
        if (M.maxLength !== undefined && T && T.length > M.maxLength) throw new Error(`field '${key}' should shorter than maxLength(${M.maxLength})`);
        if (M.minLength !== undefined && T && T.length < M.minLength) throw new Error(`field '${key}' should longer than minLength(${M.minLength})`);
        if (M.regexp !== undefined && T && !M.regexp.test(T)) throw new Error(`field '${key}' regexp verification failed`);
        if (M.enums !== undefined && M.enums.length > 0 && T && !M.enums.includes(T)) throw new Error(`field '${key}' values must be ${M.enums}`);
        return T
    } catch (e) {
        throw e
    }
} 

/***
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */
const checkNumber = (M, T, key) => {
    try {
        if (M.allowNull !== undefined && !M.allowNull && T === null) throw new Error(`field '${key}' can not be null`);
        if (typeof T !== 'number') {
            T = Number(T);
            if (T.toString() === 'NaN') throw new Error(`field '${key}' must be a number`);
        }
        if (M.max !== undefined && T && T > M.max) throw new Error(`field '${key}' should smaller than max(${M.max})`);
        if (M.min !== undefined && T && T < M.min) throw new Error(`field '${key}' should bigger than min(${M.min})`);
        if (M.enums !== undefined && M.enums.length > 0 && T && !M.enums.includes(T)) throw new Error(`field '${key}' values must be ${M.enums}`);
        return T
    } catch (e) {
        throw e
    }
}

/***
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */
const checkBoolean = (M, T, key) => {
    if (T === undefined) return;
    try {
        if (typeof T !== 'boolean') {
            if (T !== 'true' && T !== 'false') throw new Error(`field '${key}' must be a boolean`);
        }
        if (M.enums !== undefined &&  M.enums.length > 0 && !M.enums.includes(T)) throw new Error(`field '${key}' values must be ${M.enums}`);
        return (T === 'true' || T === true) ? true : false
    } catch (e) {
        throw e
    }
}

/***
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */
const checkArray = (M, T, key) => {
    try {
        if (!Array.isArray(T)) {
            throw new Error(`field '${key}' must be a array`);
        }
        if (M.allowEmpty !== undefined && M.allowEmpty === false && T.length === 0) throw new Error(`field '${key}' can not be an empty array`);
        if (M.maxLength !== undefined && T.length > 0 && T.length > M.maxLength) throw new Error(`field '${key}' should shorter than maxLength(${M.maxLength})`);
        if (M.minLength !== undefined && T.length > 0 && T.length < M.minLength) throw new Error(`field '${key}' should longer than minLength(${M.minLength})`);
        return T
    } catch (e) {
        throw e
    }
}

/***
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */

const checkObject = (M, T, key) => {
    try {
        if (Object.prototype.toString.call(T) !== '[object Object]') {
            throw new Error(`field '${key}' must be an object`);
        }
        if (M.allowEmpty !== undefined && M.allowEmpty !== false && JSON.stringify(T) === '{}') throw new Error(`field '${key}' can not be an empty object`);
        if (M.value) {
            return check(M.value, T)
        }
    } catch (e) {
        throw e
    }
}

/**
 * @param {Object} M 校验用的model
 * @param {any} T 待校验的字段
 * @param {string} key 该字段的名称
 */

const checkEnum = (M, T, key) => {
    try {
        if (M.allowEmpty !== undefined && M.allowEmpty !== false && (T === '')) throw new Error(`field '${key}' can not be empty`);
        if (M.allowNull !== undefined && M.allowNull === false && T.toLowerCase() === 'null') throw new Error(`field '${key}' can not be null`);
        if (M.values == undefined) M.values = [];
        if (T && !M.values.includes(T)) throw new Error(`field '${key}' must be a value in (${M.values})`);
        return T
    } catch (e) {
        throw e
    }
}

module.exports = checkDto