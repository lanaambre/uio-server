import assert from 'assert';

import AttributesReader from '../../lib/component/AttributesReader.mjs';

describe('AttributesReader', function () {
  describe('.process()', function () {
    it('should only keep allowed attributes with a maximum of 1 allowed extension on each', function () {
      const attributesReader = new AttributesReader({
        allowedAttributes: ['apple', 'banana', 'coconut'],
        allowedExtensions: ['red', 'green'],
      });

      const attributes = attributesReader.process({
        apple$red: 1,
        'banana,coconut$green': 2,
        'apple$red,green': 3,
        lime$green: 4,
        green: 6,
      });

      assert.equal(attributes, {
        apple$red: 1,
        banana$green: 2,
        coconut$green: 2,
      });
    });

    it('the reader must remove attributes with multiple extensions', function () {
      const attributesReader = new AttributesReader({
        allowedAttributes: ['apple', 'banana', 'coconut'],
        allowedExtensions: ['red', 'green'],
      });

      const attributes = attributesReader.process({
        'apple$red,green': 1,
      });

      assert.equal(attributes, {});
    });

    it('the reader must remove attributes with a non-allowed extension', function () {
      const attributesReader = new AttributesReader({
        allowedAttributes: ['apple', 'banana', 'coconut'],
        allowedExtensions: ['red', 'green'],
      });

      const attributes = attributesReader.process({
        apple$purple: 5,
      });

      assert.equal(attributes, {});
    });
  });
});
