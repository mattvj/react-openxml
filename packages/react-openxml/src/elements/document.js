import {openXml, ltxml} from 'openxml';
import Base from './base';

const W = openXml.W;
const wNs = openXml.wNs;

const XElement = ltxml.XElement;
const XAttribute = ltxml.XAttribute;
const XNamespace = ltxml.XNamespace;

class Document extends Base {
  constructor(root, props, type) {
    super(root, props, type);
    this.body = new XElement(W.body);
    this.mainDocument = new XElement(W.document,
      new XAttribute(XNamespace.xmlns + 'w', wNs.namespaceName),
      this.body);
  }

  async render() {
    const xd = this.root.mainDocumentPart().getXDocument();
    xd.root.replaceWith(this.mainDocument);
    
    console.log('Done', this.mainDocument.toString());
  }

  getDocument() {
    return this.body;
  }

  canAdd(element) {
    if(typeof element === 'string') {
      return false;
    }

    const foundBase = ['div', 'section', 'p', 'title', 'h1'].find(node => node === element.constructor.name.toLowerCase());
    if(foundBase && element.getProperties() === W.rPr) {
      return false;
    }

    return foundBase;
  }
}

export default Document;
