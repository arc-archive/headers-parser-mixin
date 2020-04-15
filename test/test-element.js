import { LitElement } from 'lit-element';
import { HeadersParserMixin } from '../headers-parser-mixin.js';

class TestElement extends HeadersParserMixin(LitElement) {}
window.customElements.define('test-element', TestElement);
