function isPlainObject(value) {

  return  typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';

}

module.exports = isPlainObject;
