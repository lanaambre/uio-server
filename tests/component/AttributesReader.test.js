import assert from 'assert';

import AttributesReader from '../../lib/component/AttributesReader.mjs';

describe('AttributesReader', function () {
  describe('.process()', function () {
    it('should only keep apple$red, banana$green, coconut$green, apple', function () {
      const attributesReader = new AttributesReader({
        allowedAttributes: ['apple', 'banana', 'coconut'],
        allowedExtensions: ['red', 'green'],
      });

      const attributes = attributesReader.process({
        apple$red: 1,
        'banana,coconut$green': 2,
        'apple$red,green': 3,
        lime$green: 4,
        apple$purple: 5,
        green: 6,
      });

      assert.equal(attributes, {
        apple$red: 1,
        banana$green: 2,
        coconut$green: 2,
      });
    });
  });
});
