/**
 * @typedef {Object} Header
 * @property {string} name
 * @property {string|string[]} value
 */

/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

/**
 * Filter array of headers and return not duplicated array of the same headers.
 * Duplicated headers should be appended to already found one using coma separator.
 *
 * @param {Array<Header>} input Headers list to filter.
 * @return {Array<Header>} An array of filtered headers.
 */
export function filter(input) {
  const _tmp = {};
  input.forEach(header => {
    if (header.name in _tmp) {
      if (header.value) {
        _tmp[header.name] += `, ${header.value}`;
      }
    } else {
      _tmp[header.name] = header.value;
    }
  });
  const result = [];
  Object.keys(_tmp).forEach(key => {
    result[result.length] = {
      name: key,
      value: _tmp[key],
    };
  });
  return result;
}

/**
 * Parse headers string to array of objects.
 * See `#toJSON` for more info.
 *
 * @param {String} headerString Headers string to process.
 * @return {Array<Header>} List of parsed headers
 */
function stringToJSON(headerString) {
  const result = [];
  if (!headerString) {
    return result;
  }
  if (typeof headerString !== 'string') {
    throw new Error('The headerString argument must be a String.');
  }
  if (headerString.trim() === '') {
    return result;
  }
  const headers = headerString.split(/\n(?=[^ \t]+)/gim);

  for (let i = 0, len = headers.length; i < len; i++) {
    const line = headers[i].trim();
    if (line === '') {
      continue;
    }
    const sepPosition = line.indexOf(':');
    if (sepPosition === -1) {
      result[result.length] = {
        name: line,
        value: '',
      };
      continue;
    }
    const name = line.substr(0, sepPosition);
    const value = line.substr(sepPosition + 1).trim();
    const obj = {
      name,
      value,
    };
    result.push(obj);
  }
  return result;
}

/**
 * Parse Headers object to array of objects.
 * See `#toJSON` for more info.
 *
 * @param {Headers|Object} input
 * @return {Array<Header>}
 */
function hedersToJSON(input) {
  const result = [];
  if (!input) {
    return result;
  }
  const headers = new Headers(input);
  const _tmp = {};
  headers.forEach((value, name) => {
    if (_tmp[name]) {
      _tmp[name] += `, ${value}`;
    } else {
      _tmp[name] = value;
    }
  });
  return Object.keys(_tmp).map(key => {
    let value = _tmp[key];
    if (value && value.indexOf(',') !== -1) {
      value = value
        .split(',')
        .map(part => part.trim())
        .join(', ');
    }
    return {
      name: key,
      value,
    };
  });
}

/**
 * Transforms a header model item to a string.
 * Array values are supported.
 *
 * @param {Header} header Object with name and value.
 * @return {string} Generated headers line
 */
export function itemToString(header) {
  const key = header.name;
  let value;
  if (Array.isArray(header.value)) {
    value = header.value.join(',');
  } else {
    value = header.value;
  }
  let result = '';
  if (key && key.trim() !== '') {
    result += `${key}: `;
    if (value) {
      result += value;
    }
  }
  return result;
}

/**
 * Parse HTTP headers input from string to array of objects containing `name` and `value`
 * properties.
 *
 * @param {string|Headers|Header[]|Object} headers Raw HTTP headers input or Headers object
 * @return {Header[]} List of parsed headers
 */
export function toJSON(headers) {
  if (typeof headers === 'string') {
    return stringToJSON(headers);
  }
  return hedersToJSON(headers);
}

/**
 * Parse headers array to Raw HTTP headers string.
 *
 * @param {Array<Header>|String|Headers} input List of `Header`s
 * @return {string} A HTTP representation of the headers.
 */
export function toString(input) {
  if (typeof input === 'string') {
    return input;
  }
  let heeaders = input;
  if (!Array.isArray(heeaders)) {
    heeaders = toJSON(heeaders);
  }
  if (heeaders.length === 0) {
    return '';
  }
  heeaders = filter(heeaders);
  return heeaders.map(header => itemToString(header)).join('\n');
}

/**
 * finds and returns the value of the Content-Type value header.
 *
 * @param {Header[]|Headers|string} input Either HTTP headers string or list of headers.
 * @return {string|null} A content-type header value or null if not found
 */
export function contentType(input) {
  let headers = input;
  if (typeof headers !== 'string') {
    headers = toString(headers);
  }
  headers = headers.trim();
  if (headers === '') {
    return null;
  }
  const re = /^content-type:\s?(.*)$/im;
  const match = headers.match(re);
  if (!match) {
    return null;
  }
  let ct = match[1].trim();
  if (ct.indexOf('multipart') === -1) {
    const index = ct.indexOf('; ');
    if (index > 0) {
      ct = ct.substr(0, index);
    }
  }
  return ct;
}

/**
 * Replace value for given header in the headers list.
 *
 * @param {Headers|Header[]|string} input A headers to process. Can be string,
 * array of internall definition of headers or an instance of the Headers object.
 * @param {string} name Header name to be replaced.
 * @param {string} value Header value to be repleced.
 * @return {Headers|Header[]|string} Updated headers.
 */
export function replace(input, name, value) {
  let headers = /** @type Header[] */ (input);
  let origType = 'headers';
  if (Array.isArray(headers)) {
    origType = 'array';
  } else if (typeof headers === 'string') {
    origType = 'string';
  }
  if (origType !== 'array') {
    headers = toJSON(headers);
  }
  const _name = name.toLowerCase();
  let found = false;
  headers.forEach(header => {
    if (header.name.toLowerCase() === _name) {
      header.value = value;
      found = true;
    }
  });
  if (!found) {
    headers.push({
      name,
      value,
    });
  }
  if (origType === 'array') {
    return headers;
  }
  if (origType === 'string') {
    return toString(headers);
  }
  const obj = {};
  headers.forEach(header => {
    obj[header.name] = header.value;
  });
  // @ts-ignore
  return new Headers(obj);
}

const ERROR_MESSAGES = {
  CONTENT_TYPE_MISSING: 'Content-Type header is not defined',
  HEADER_NAME_EMPTY: "Header name can't be empty",
  HEADER_NAME_WHITESPACES: 'Header name should not contain whitespaces',
  HEADER_VALUE_EMPTY: 'Header value should not be empty',
};

/**
 * Get error message for given header string.
 * @param {Headers|Header[]|string} input A headers to check.
 * @param {boolean} [isPayload=false] Whether current request can have payload message.
 * @return {String|null} An error message or null if the headers are valid.
 */
export function getError(input, isPayload = false) {
  if (!input) {
    if (isPayload) {
      return ERROR_MESSAGES.CONTENT_TYPE_MISSING;
    }
    return null;
  }
  if (!(input instanceof Array)) {
    input = toJSON(input);
  }
  const msg = [];
  let hasContentType = false;
  for (let i = 0, len = input.length; i < len; i++) {
    const { name, value } = input[i];
    if (name.toLowerCase() === 'content-type') {
      hasContentType = true;
    }
    if (!name || !name.trim()) {
      msg[msg.length] = ERROR_MESSAGES.HEADER_NAME_EMPTY;
    } else if (/\s/.test(name)) {
      msg[msg.length] = ERROR_MESSAGES.HEADER_NAME_WHITESPACES;
    }
    if (!value || !String(value).trim()) {
      msg[msg.length] = ERROR_MESSAGES.HEADER_VALUE_EMPTY;
    }
  }
  if (isPayload && !hasContentType) {
    msg[msg.length] = ERROR_MESSAGES.CONTENT_TYPE_MISSING;
  }
  if (msg.length > 0) {
    return msg.join('\n');
  }
  return null;
}
