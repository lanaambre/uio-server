import forEach from '../utils/forEach.mjs';
import isPlainObject from '../utils/isPlainObject.mjs';

class AttributesReader {
  allowedAttributes = [];

  allowedExtensions = [];

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
        attributes.push(attribute);
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
