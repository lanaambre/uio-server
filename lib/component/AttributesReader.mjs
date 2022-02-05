import forEach from 'lodash.foreach';
import isPlainObject from 'lodash.isplainobject';

class AttributesReader {
  allowedAttributes = [];

  allowedExtensions = [];

  transformAttribute;

  constructor(config) {
    if (!isPlainObject(config)) {
      return;
    }

    if (Array.isArray(config.allowedAttributes)) {
      this.allowedAttributes = config.allowedAttributes;
    }

    if (Array.isArray(config.allowedExtensions)) {
      this.allowedExtensions = config.allowedExtensions;
    }

    if (typeof config.transformAttribute === 'function') {
      this.transformAttribute = config.transformAttribute;
    } else {
      this.transformAttribute = (value) => value;
    }
  }

  process(rawData) {
    if (!isPlainObject(rawData)) {
      return rawData;
    }

    const data = {};

    forEach(rawData, (value, attributeToCheck) => {
      const { attributes, extension } = this.readAttribute(attributeToCheck);

      attributes.forEach((attribute) => {
        data[`${attribute}${extension ? `$${extension}` : ''}`] = value;
      });
    });

    return data;
  }

  readAttribute(toCheck) {
    if (typeof toCheck !== 'string') {
      return toCheck;
    }

    const sections = toCheck.split('$');

    const [rawAttributes, ...extensions] = sections;

    const attributes = [];

    rawAttributes.split(',').forEach((attribute) => {
      if (typeof attribute !== 'string') {
        return;
      }

      if (attribute && this.allowedAttributes.includes(attribute)) {
        attributes.push(this.transformAttribute(attribute));
      }
    });

    return {
      attributes,
      extension: this.allowedExtensions.includes(extensions[0])
        ? extensions[0]
        : '',
    };
  }
}

export default AttributesReader;
