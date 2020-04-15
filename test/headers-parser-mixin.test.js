import { fixture, assert } from '@open-wc/testing';
import { ParsableObject } from './ParsableObject.js';
import './test-element.js';

describe('headers-parser-mixin', function() {
  describe('in a HTML element', () => {
    async function basicFixture() {
      return (await fixture(`<test-element></test-element>`));
    }

    describe('_headersStringToJSON()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns empty array when no input', () => {
        const result = element._headersStringToJSON();
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 0);
      });

      it('Returns empty array when empty input', () => {
        const result = element._headersStringToJSON('');
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 0);
      });

      it('Returns empty array when empty input after trim', () => {
        const result = element._headersStringToJSON('   ');
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 0);
      });

      it('Throws error when argument is not a string', () => {
        assert.throws(() => {
          element._headersStringToJSON({});
        });
      });

      it('Parses single header', () => {
        const inp = 'content-type: application/json';
        const result = element._headersStringToJSON(inp);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'content-type');
        assert.equal(result[0].value, 'application/json');
      });

      it('Parses multiple headers', () => {
        let inp = 'content-type: application/json\n';
        inp += 'accept: */*\n';
        inp += 'dnt: 1';
        const result = element._headersStringToJSON(inp);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 3);
        assert.equal(result[0].name, 'content-type');
        assert.equal(result[0].value, 'application/json');

        assert.equal(result[1].name, 'accept');
        assert.equal(result[1].value, '*/*');

        assert.equal(result[2].name, 'dnt');
        assert.equal(result[2].value, '1');
      });

      it('Ignores empty lines', () => {
        let inp = 'content-type: application/json\n';
        inp += '\n';
        inp += 'dnt: 1';
        const result = element._headersStringToJSON(inp);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 2);
      });

      it('Accepts empty values', () => {
        let inp = 'content-type:\n';
        inp += '\n';
        inp += 'dnt: 1';
        const result = element._headersStringToJSON(inp);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 2);
        assert.equal(result[0].value, '');
      });

      it('Accepts values with colon', () => {
        const inp = 'content-type: {"test": "value"}';
        const result = element._headersStringToJSON(inp);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].value, '{"test": "value"}');
      });
    });

    describe('_hedersToJSON()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Creates array with values', function() {
        const headers = new Headers();
        headers.append('x-test', 'value 1, value 2');
        headers.append('Content-Type', 'application/json');
        headers.append('x-test-2', 'v1');
        headers.append('x-test-2', 'v2');

        const ref = [{
          name: 'x-test',
          value: 'value 1, value 2'
        }, {
          name: 'content-type',
          value: 'application/json'
        }, {
          name: 'x-test-2',
          value: 'v1, v2'
        }];

        function findInRef(key) {
          return ref.find(function(item) {
            return item.name === key;
          });
        }

        const parsed = element._hedersToJSON(headers);
        for (let i = 0, len = parsed.length; i < len; i++) {
          const _ref = findInRef(parsed[i].name);
          assert.equal(parsed[i].value, _ref.value, 'Contains value for ' + _ref.name + ' header');
        }
      });

      it('Returns empty array when no input', () => {
        const result = element._hedersToJSON();
        assert.deepEqual(result, []);
      });
    });

    describe('headersToJSON()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Parses string to array', function() {
        const headers = 'x-test: value';
        const result = element.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Pareses Headers to array', function() {
        const headers = new Headers();
        headers.append('x-test', 'value');

        const result = element.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Pareses Object to array', function() {
        const headers = {
          'x-test': 'value'
        };
        const result = element.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Should process multiline headers per rfc2616 sec4', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'x-test-2: v1\n\tv2\n';
        headers += 'x-test-2: v3';

        const parsed = element.headersToJSON(headers);
        assert.lengthOf(parsed, 3, 'Result has 3 headers');
        assert.equal(parsed[1].value, 'v1\n\tv2');
      });
    });

    describe('getContentType()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Finds the Content-Type header', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: application/json\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const ct = element.getContentType(headers);
        assert.equal(ct, 'application/json');
      });

      it('Returns null when no header', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const ct = element.getContentType(headers);
        assert.equal(ct, null);
      });

      it('Finds the multipart Content-Type header', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: multipart/mixed; boundary=gc0p4Jq0M2Yt08jU534c0p\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const ct = element.getContentType(headers);
        assert.equal(ct, 'multipart/mixed; boundary=gc0p4Jq0M2Yt08jU534c0p');
      });

      it('Finds the Content-Type header with extension', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: text/html; charset=ISO-8859-4\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const ct = element.getContentType(headers);
        assert.equal(ct, 'text/html');
      });

      it('Finds the Content-Type header in an array', function() {
        const headers = [
          {
            name: 'x-test',
            value: 'value 1, value 2'
          },
          {
            name: 'content-type',
            value: 'text/html; charset=ISO-8859-4'
          },
          {
            name: 'x-test-2',
            value: 'v1'
          }
        ];
        const ct = element.getContentType(headers);
        assert.equal(ct, 'text/html');
      });

      it('Returns null for empty array array', function() {
        const headers = [];
        const ct = element.getContentType(headers);
        assert.equal(ct, null);
      });
    });

    describe('replaceHeaderValue()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Replaces header value', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: text/html; charset=ISO-8859-4\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        headers = element.replaceHeaderValue(headers, 'content-type', 'application/json');
        const match = headers.match(/^content-type: (.*)$/im);
        assert.notEqual(match, null);
        assert.equal(match[1], 'application/json');
      });

      it('Replaces header value in Headers object', function() {
        const headers = new Headers();
        headers.append('x-test', 'value');
        const result = element.replaceHeaderValue(headers, 'x-test', 'replaced');
        const newValue = result.get('x-test');
        assert.equal(newValue, 'replaced');
      });

      it('Replaces header value in array', function() {
        const headers = [{
          name: 'x-test',
          value: 'value'
        }];
        const result = element.replaceHeaderValue(headers, 'x-test', 'replaced');
        const newValue = result[0].value;
        assert.equal(newValue, 'replaced');
      });
    });

    describe('filterHeaders()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Should filter headers', function() {
        const headers = [{
          name: 'x-test',
          value: 'value 1'
        }, {
          name: 'x-test',
          value: 'value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];
        const ref = [{
          name: 'x-test',
          value: 'value 1, value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];
        const filtered = element.filterHeaders(headers);
        assert.deepEqual(filtered, ref);
      });
    });

    describe('headersToString()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Should parse headers array to string', function() {
        const headers = [{
          name: 'x-test',
          value: 'value 1'
        }, {
          name: 'x-test',
          value: 'value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];
        let ref = 'x-test: value 1, value 2\n';
        ref += 'Content-Type: application/json';
        const parsed = element.headersToString(headers);
        assert.equal(parsed, ref);
      });

      it('Should parse Headers object to string', function() {
        const headers = new Headers();
        headers.append('x-test', 'value 1');
        headers.append('x-test', 'value 2');
        headers.append('Content-Type', 'application/json');

        const parsed = element.headersToString(headers);
        assert.ok(parsed.match(/content-type:\s?application\/json/gim), 'Contains content type');
        assert.ok(parsed.match(/x-test:\s?value 1,\s?value 2/gim), 'Contains concatenated headers');
      });

      it('Should parse string to string', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: application/json';

        let ref = 'x-test: value 1, value 2\n';
        ref += 'content-type: application/json';
        const parsed = element.headersToString(headers);
        assert.equal(parsed, ref);
      });
    });

    describe('getHeaderError()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Should not find error', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'content-type: text/html; charset=ISO-8859-4\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const valid = element.getHeaderError(headers);
        assert.equal(valid, null);
      });

      it('Should find empty value error', function() {
        let headers = 'x-test: \n';
        headers += 'content-type: text/html; charset=ISO-8859-4\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        const valid = element.getHeaderError(headers);
        assert.equal(valid, 'Header value should not be empty');
      });

      it('finds error in an array', function() {
        const headers = [{
          name: 'x-test',
          value: ''
        }, {
          name: 'x-test',
          value: 'value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];

        const valid = element.getHeaderError(headers);
        assert.equal(valid, 'Header value should not be empty');
      });

      it('Should find no Content-Type error', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'x-test-2: v1\n';
        headers += 'x-test-2: v2';

        element.isPayload = true;
        const valid = element.getHeaderError(headers);
        assert.equal(valid, 'Content-Type header is not defined');
      });

      it('Should find no Content-Type error when no input', function() {
        element.isPayload = true;
        const valid = element.getHeaderError('');
        assert.equal(valid, 'Content-Type header is not defined');
      });

      it('finds no header name error', function() {
        const headers = [{
          name: '',
          value: 'value'
        }, {
          name: 'x-test',
          value: 'value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];
        const valid = element.getHeaderError(headers);
        assert.equal(valid, 'Header name can\'t be empty');
      });

      it('finds whitespaces in name error', function() {
        const headers = [{
          name: 'my header',
          value: 'value'
        }, {
          name: 'x-test',
          value: 'value 2'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }];
        const valid = element.getHeaderError(headers);
        assert.equal(valid, 'Header name should not contain whitespaces');
      });

      it('returns null when no input', function() {
        const valid = element.getHeaderError('');
        assert.equal(valid, null);
      });
    });

    describe('_oldCombine()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('throws when argument is not an array', () => {
        assert.throws(() => {
          element._oldCombine('test');
        });
      });

      it('adds content type for encoding', () => {
        const headers = [];
        element._oldCombine(headers, 'application/json');
        assert.deepEqual(headers, [{
          name: 'Content-Type',
          value: 'application/json'
        }]);
      });

      it('returns true when added', () => {
        const headers = [{
          name: 'abc',
          value: 'test'
        }];
        const result = element._oldCombine(headers, 'application/json');
        assert.isTrue(result);
      });

      it('won\'t change the array if content type is already defined', () => {
        const headers = [{
          name: 'content-type',
          value: 'test'
        }];
        element._oldCombine(headers, 'application/json');
        assert.deepEqual(headers, [{
          name: 'content-type',
          value: 'test'
        }]);
      });

      it('returns false when array not changed', () => {
        const headers = [{
          name: 'content-type',
          value: 'test'
        }];
        const result = element._oldCombine(headers, 'application/json');
        assert.isFalse(result);
      });
    });
  });

  describe('in a plain class', () => {
    describe('headersToJSON()', () => {
      let instance;
      beforeEach(() => {
        instance = new ParsableObject();
      });

      it('Parses string to array', function() {
        const headers = 'x-test: value';
        const result = instance.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Pareses Headers to array', function() {
        const headers = new Headers();
        headers.append('x-test', 'value');

        const result = instance.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Pareses Object to array', function() {
        const headers = {
          'x-test': 'value'
        };
        const result = instance.headersToJSON(headers);
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 1);
        assert.equal(result[0].name, 'x-test');
        assert.equal(result[0].value, 'value');
      });

      it('Should process multiline headers per rfc2616 sec4', function() {
        let headers = 'x-test: value 1, value 2\n';
        headers += 'x-test-2: v1\n\tv2\n';
        headers += 'x-test-2: v3';

        const parsed = instance.headersToJSON(headers);
        assert.lengthOf(parsed, 3, 'Result has 3 headers');
        assert.equal(parsed[1].value, 'v1\n\tv2');
      });
    });
  });
});
