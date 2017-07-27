import {openXml, ltxml} from 'openxml';
import Base from './base';

const W = openXml.W;

const XElement = ltxml.XElement;

class P extends Base {
  constructor(root, props, type) {
    super(root, props, type);
    this.paragraph = new XElement(W.p);
  }

  getDocument() {
    return this.paragraph;
  }
  
  getProperties() {
    return W.pPr;
  }

  canAdd(element) {
    if(typeof element === 'string') {
      return false;
    }

    const foundBase = ['div', 'span', 'title', 'h1', 'h2'].find(node => node === element.constructor.name.toLowerCase());
    if(foundBase && element.getProperties() === W.pPr) {
      return false;
    }

    return foundBase;
  }
}

export default P;
