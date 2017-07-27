import {openXml, ltxml} from 'openxml';
import Base from './base';

const W = openXml.W;

const XElement = ltxml.XElement;
const XAttribute = ltxml.XAttribute;

class Section extends Base {
  doneInitializing() {
    this.propertyType = W.pPr;

    const parentChildren = this.parent && this.parent.children || [];

    let sectionDocument;
    if(parentChildren.length && parentChildren.length === (this.parent.childCount - 1)) {
      this.document = sectionDocument = new XElement(W.sectPr);
    } else {
      this.document = new XElement(W.p);
      const properties = new XElement(W.pPr);
      sectionDocument = new XElement(W.sectPr);
      properties.add(sectionDocument);
      this.document.add(properties);
    }

    if(sectionDocument) {
      sectionDocument.add(new XElement(W.pgSz,
        new XAttribute(W._w, +this.props.width * 20 || '12240'),
        new XAttribute(W.h, +this.props.height * 20 || '14240'),
        new XAttribute(W.orient, this.props.orientation || 'portrait')));

      sectionDocument.add(new XElement(W.pgMar,
        new XAttribute(W.top, +this.props.topMargin * 20 || '1440'),
        new XAttribute(W.right, +this.props.rightMargin * 20 || '1440'),
        new XAttribute(W.bottom, +this.props.bottomMargin * 20 || '1440'),
        new XAttribute(W.left, +this.props.leftMargin * 20 || '1440'),
        new XAttribute(W.header, +this.props.headerHeight * 20 || '720'),
        new XAttribute(W.footer, +this.props.footerHeight * 20 || '720')));
    }
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

    const document = this.getDocument();
    if(document) {
      if(this.parent && document) {
        this.parent.add(document);
      }
    }
  }

  canAdd(element) {
    if(typeof element === 'string') {
      return false;
    }

    const foundBase = ['div', 'page', 'p', 'title', 'h1', 'h2'].find(node => node === element.constructor.name.toLowerCase());
    if(foundBase && foundBase !== 'page' && element.getProperties() && element.getProperties() !== W.pPr) {
      return false;
    }

    return foundBase;
  }
}

export default Section;
