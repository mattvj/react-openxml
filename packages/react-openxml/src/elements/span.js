import {openXml, ltxml} from 'openxml';
import Base from './base';

const W = openXml.W;

const XElement = ltxml.XElement;

class Span extends Base {
  constructor(root, props, type) {
    super(root, props, type);
    this.textRun = new XElement(W.r);
  }

  getDocument() {
    return this.textRun;
  }

  getProperties() {
    return W.rPr;
  }

  allowsStrings() {
    return true;
  }

  canAdd(element) {
    return typeof element === 'string';
  }
}

export default Span;
