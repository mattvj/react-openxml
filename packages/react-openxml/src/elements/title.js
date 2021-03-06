import {openXml, ltxml} from 'openxml';
import Base from './base';
import Styles from '../util/styles';

const W = openXml.W;
const XElement = ltxml.XElement;

class Title extends Base {

  doneInitializing() {
    console.log('Children', this.children.length, this.children[0]);
    if(this.children.length === 1 && typeof this.children[0] === 'string') {
      this.propertyType = W.rPr;
    } else {
      this.propertyType = W.pPr;
    }

    this.document = new XElement(this.propertyType === W.rPr ? W.r : W.p);
    Styles.addStyle(this.document, this.propertyType, { 'text-style': this.propertyType === W.rPr ? 'TitleChar' : 'Title'});
  }

  getDocument() {
    return this.document;
  }

  getProperties() {
    return this.propertyType;
  }

  allowsStrings() {
    return true;
  }

  canAdd(element) {
    if(typeof element === 'string') {
      return true;
    }

    const foundBase = ['div', 'span'].find(node => node === element.constructor.name.toLowerCase());
    if(foundBase && element.getProperties() === W.pPr) {
      return false;
    }

    return foundBase;
  }
}

export default Title;
