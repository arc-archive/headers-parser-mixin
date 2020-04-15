import { LitElement } from 'lit-element';
import { HeadersParserMixin } from '../index.js';

class TestElement extends HeadersParserMixin(LitElement) {}
window.customElements.define('test-element', TestElement);
