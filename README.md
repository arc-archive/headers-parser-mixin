[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/headers-parser-mixin.svg)](https://www.npmjs.com/package/@advanced-rest-client/headers-parser-mixin)

[![Build Status](https://travis-ci.com/advanced-rest-client/headers-parser-mixin.svg)](https://travis-ci.com/advanced-rest-client/headers-parser-mixin)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/headers-parser-mixin)

## headers-parser-mixin

Headers parser mixin function to be implemented with elements that parses HTTP headers.

## Mixin deprecation notice

The mixing is being deprecated and implementation should move to use `HeadersParser` module instead.

## Usage

### Installation
```
npm install --save @advanced-rest-client/headers-parser-mixin
```

### As ES module

```js
import * as HeadersParser from '@advanced-rest-client/headers-parser-mixin';
const errorMessage = HeadersParser.getError('Whitespace Name: x-true');
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import { HeadersParserMixin } from '@advanced-rest-client/headers-parser-mixin';

class SampleElement extends HeadersParserMixin(LitElement) {
  render() {
    const validation = this.getHeaderError('Whitespace Name: x-true');
    return html`
    ${validation ? html`<p>${validation}<p>` : html`<p>Headers are valid</p>`}
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Development

```sh
git clone https://github.com/advanced-rest-client/headers-parser-mixin
cd headers-parser-mixin
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
