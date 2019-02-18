import {PolymerElement} from '../../../@polymer/polymer/polymer-element.js';
import {HeadersParserMixin} from '../headers-parser-mixin.js';
import {html} from '../../../@polymer/polymer/lib/utils/html-tag.js';
class TestElement extends HeadersParserMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }
    </style>
`;
  }

  static get is() {
    return 'test-element';
  }
}
window.customElements.define(TestElement.is, TestElement);
