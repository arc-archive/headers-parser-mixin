/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import * as HeadersParser from './HeadersParser.js';

/* eslint-disable class-methods-use-this */

/**
 * @typedef {import('./HeadersParser.js').Header} Header
 */

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class HeadersParserMixinImpl extends base {
    static get properties() {
      return {
        /**
         * Set to true when the request can carry a payload.
         * It's required for calculating headers errors.
         */
        isPayload: { type: Boolean },
      };
    }

    constructor() {
      super();
      this.isPayload = false;
    }

    /**
     * Filter array of headers and return not duplicated array of the same headers.
     * Duplicated headers should be appended to already found one using coma separator.
     *
     * @param {Header[]} headers Headers list to filter.
     * @return {Header[]} An array of filtered headers.
     */
    filterHeaders(headers) {
      return HeadersParser.filter(headers);
    }

    /**
     * Parse headers array to Raw HTTP headers string.
     *
     * @param {Header[]|String|Headers} headersArray List of `Header`s
     * @return {string} A HTTP representation of the headers.
     */
    headersToString(headersArray) {
      return HeadersParser.toString(headersArray);
    }

    /**
     * Transforms a header model item to a string.
     * Array values are supported.
     *
     * @param {Header} header Object with name and value.
     * @return {string} Generated headers line
     */
    headerItemToString(header) {
      return HeadersParser.itemToString(header);
    }

    /**
     * Parse HTTP headers input from string to array of objects containing `name` and `value`
     * properties.
     *
     * @param {String|Headers} headers Raw HTTP headers input or Headers object
     * @return {Header[]} List of parsed headers
     */
    headersToJSON(headers) {
      return HeadersParser.toJSON(headers);
    }

    /**
     * Get the Content-Type value from the headers.
     *
     * @param {Header[]|String} headers Either HTTP headers string or list of headers.
     * @return {String|null} A content-type header value or null if not found
     */
    getContentType(headers) {
      return HeadersParser.contentType(headers);
    }

    /**
     * Replace value for given header in the headers list.
     *
     * @param {Headers|Header[]|string} headers A headers to process. Can be string,
     * array of internall definition of headers or an instance of the Headers object.
     * @param {string} name Header name to be replaced.
     * @param {string} value Header value to be repleced.
     * @return {Headers|Header[]|string} Updated headers.
     */
    replaceHeaderValue(headers, name, value) {
      return HeadersParser.replace(headers, name, value);
    }

    /**
     * Get error message for given header string.
     * @param {Headers|Header[]|string} input A headers to check.
     * @return {String|null} An error message or null if the headers are valid.
     */
    getHeaderError(input) {
      return HeadersParser.getError(input, this.isPayload);
    }
  }
  return HeadersParserMixinImpl;
};
/**
 * Headers parser mixin to be impplemented with elements that needs to parse headers data.
 *
 * In most cases function defined in this behavior can work with the headers defined as a string,
 * array of objects (name, value keys) or as Header object.
 *
 * To calculate errors properly, set `isPayload` property when current request can carry a
 * payload.
 *
 * @mixin
 * @deprecated Please, use `HeadersParser` module instead.
 */
export const HeadersParserMixin = dedupeMixin(mxFunction);
