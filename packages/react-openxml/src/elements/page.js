import {openXml, ltxml} from 'openxml';
import Base from './base';

const W = openXml.W;

const XElement = ltxml.XElement;
const XAttribute = ltxml.XAttribute;

class Page extends Base {
  doneInitializing() {
    this.propertyType = W.rPr;
  }

  getDocument() {
    return this.document;
  }

  getProperties() {
    return this.propertyType;
  }

  add(element) {
    this.parentBuffer = this.parentBuffer || [];
    this.parentBuffer.push(element);
  }

  async render() {

    this.parentBuffer.forEach(child => {
      this.parent.add(child);
    });

    let currentParent = this.parent;
    let lastParent = null;
    while(currentParent && currentParent.childCount < 2) {
      lastParent = currentParent;
      currentParent = currentParent.parent;
    }

    if(currentParent) {
      const checkElement = lastParent || this;
      if(checkElement && (currentParent.children[currentParent.children.length - 1] !== checkElement)) {
        this.children[this.children.length - 1].add(new XElement(W.r, new XElement(W.br, new XAttribute(W.type, 'page'))));
      }
    }
  }

  canAdd(element) {
    if(typeof element === 'string') {
      return false;
    }

    const foundBase = ['div', 'p', 'title', 'h1', 'h2'].find(node => node === element.constructor.name.toLowerCase());
    if(foundBase && element.getProperties() && element.getProperties() !== W.pPr) {
      return false;
    }

    return foundBase;
  }
}

export default Page;

//<w:p>
//  <w:pPr>
//    <w:sectPr>
//      <w:pgSz w:w="12240" w:h="15840"/>
//    </w:sectPr>
//  </w:pPr>
//</w:p>
