/**
 * An internal representation of an header.
 */
interface Header {
  /**
   * Header name
   */
  name: string;
  /**
   * Header value. It can be a string that represents multiple
   * headers with the same name.
   */
  value: string|string[];
}

/**
 * Filter array of headers and return not duplicated array of the same headers.
 * Duplicated headers should be appended to already found one using coma separator.
 *
 * @param input Headers list to filter.
 * @returns An array of filtered headers.
 */
export declare function filter(input: Array<Header>): Array<Header>;

/**
 * Parse headers string to array of objects.
 * See `#toJSON` for more info.
 *
 * @param headerString Headers string to process.
 * @returns List of parsed headers
 */
export declare function stringToJSON(headerString: string): Header[];

/**
 * Parse Headers object to array of objects.
 * See `#toJSON` for more info.
 */
declare function hedersToJSON(input: Headers|object): Header[]

/**
 * Transforms a header model item to a string.
 * Array values are supported.
 *
 * @param header Object with name and value.
 * @return Generated headers line
 */
export declare function itemToString(header: Header): string;

/**
 * Parse HTTP headers input from string to array of objects containing `name` and `value`
 * properties.
 *
 * @param headers Raw HTTP headers input or Headers object
 * @return List of parsed headers
 */
export declare function toJSON(headers: string|Headers|Header[]|Object): Header[];

/**
 * Parse headers array to Raw HTTP headers string.
 *
 * @param input List of `Header`s
 * @return A HTTP representation of the headers.
 */
export declare function toString(input: Array<Header>|String|Headers): string;

/**
 * finds and returns the value of the Content-Type value header.
 *
 * @param input Either HTTP headers string or list of headers.
 * @return A content-type header value or null if not found
 */
export declare function contentType(input: Header[]|Headers|string): string;

/**
 * Replace value for given header in the headers list.
 *
 * @param input A headers to process. Can be string,
 * array of internall definition of headers or an instance of the Headers object.
 * @param name Header name to be replaced.
 * @param value Header value to be repleced.
 * @returns Updated headers.
 */
export declare function replace(input: Headers|Header[]|string, name: string, value: string): Headers|Header[]|string;
/**
 * Get error message for given header string.
 * @param input A headers to check.
 * @param isPayload Whether current request can have payload message.
 * @returns An error message or null if the headers are valid.
 */
export declare function getError(input: Headers|Header[]|string, isPayload?: boolean): string|null;
