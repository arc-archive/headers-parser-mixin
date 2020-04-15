export {HeadersParserMixin};

/**
 * Headers parser behavior to be impplemented with elements that needs to parse headers data.
 *
 * In most cases function defined in this behavior can work with the headers defined as a string,
 * array of objects (name, value keys) or as Header object.
 *
 * To calculate errors properly, set `isPayload` property when current request can carry a
 * payload.
 */
declare function HeadersParserMixin<T extends new (...args: any[]) => {}>(base: T): T & HeadersParserMixinConstructor;

interface HeadersParserMixinConstructor {
  new(...args: any[]): HeadersParserMixin;
}

export {HeadersParserMixinConstructor};

interface HeadersParserMixin {

  /**
   * Set to true when the request can carry a payload.
   * It's required for calculating headers errors.
   */
  isPayload: boolean|null|undefined;

  /**
   * Filter array of headers and return not duplicated array of the same headers.
   * Duplicated headers should be appended to already found one using coma separator.
   *
   * @param headers Headers array to filter. All objects in headers array must have "name"
   *                and "value" keys.
   * @returns An array of filtered headers.
   */
  filterHeaders(headers: any[]|null): any[]|null;

  /**
   * Parse headers array to Raw HTTP headers string.
   *
   * @param headersArray List of objects with "name" and "value"
   * properties.
   * @returns A HTTP representation of the headers.
   */
  headersToString(headersArray: any[]|String|Headers|null): String|null;

  /**
   * Transforms a header model item to a string.
   * Array values are supported.
   *
   * @param header Object with name and value.
   * @returns Generated headers line
   */
  headerItemToString(header: object|null): String|null;

  /**
   * Parse HTTP headers input from string to array of objects containing `name` and `value`
   * properties.
   *
   * @param headers Raw HTTP headers input or Headers object
   * @returns The array of objects where properties are `name` as a header
   * name and `value` as a header content.
   */
  headersToJSON(headers: String|Headers|null): Array<object|null>|null;

  /**
   * Parse headers string to array of objects.
   * See `#toJSON` for more info.
   */
  _headersStringToJSON(headersString: String|null): Array<object|null>|null;

  /**
   * Parse Headers object to array of objects.
   * See `#toJSON` for more info.
   */
  _hedersToJSON(headers: Headers|object|null): Array<object|null>|null;

  /**
   * Helper method for old system: combine headers list with encoding value.
   * Note that this function will update the original array.
   *
   * @param headers An array of headers
   * @param encoding An encoding string from the old request.
   * @returns True if encoding has been added to the array.
   */
  _oldCombine(headers: any[]|null, encoding: String|null): Boolean|null;

  /**
   * Get the Content-Type value from the headers.
   *
   * @param headers Either HTTP headers string or list of headers.
   * @returns A content-type header value or null if not found
   */
  getContentType(headers: any[]|String|null): String|null;

  /**
   * Replace value for given header in the headers list.
   *
   * @param headers A headers object. Can be string, array of objects or
   * Headers object.
   * @param name Header name to be replaced.
   * @param value Header value to be repleced.
   * @returns Updated headers.
   */
  replaceHeaderValue(headers: any[]|String|object|null, name: String|null, value: String|null): any[]|null;

  /**
   * Get error message for given header string.
   *
   * @param input A headers to check.
   * @returns An error message or null if the headers are valid.
   */
  getHeaderError(input: Header|any[]|String|null): String|null;
}
