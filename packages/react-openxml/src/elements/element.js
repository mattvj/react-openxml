import {openXml, ltxml} from 'openxml';

import Document from './document';
import Div from './div';
import P from './p';
import Span from './span';
import Title from './title';
import H1 from './h1';
import H2 from './h2';
import Page from './page';
import Section from './section';

const W = openXml.W;
const XElement = ltxml.XElement;

class Element {

  constructor(root, props, type) {
    this.children = [];
    this.root = root;
    this.props = props;

    switch(type) {
      case 'document': this.element = new Document(root, props, type); break;
      case 'div': this.element = new Div(root, props, type); break;
      case 'p': this.element = new P(root, props, type); break;
      case 'span': this.element = new Span(root, props, type); break;
      case 'title': this.element = new Title(root, props, type); break;
      case 'h1': this.element = new H1(root, props, type); break;
      case 'h2': this.element = new H2(root, props, type); break;
      case 'page': this.element = new Page(root, props, type); break;
      case 'section': this.element = new Section(root, props, type); break;
      default: break;
    }

    this.allowsStrings = this.element.allowsStrings();

    this.element.parent = this.parent;
    this.element.children = [];
  }

  appendChild(child) {
    Promise.resolve(child).then(child => {
      if(typeof child !== 'string') {
        child.element.doneInitializing();
      }

      if(this.element.canAdd(typeof child !== 'string' ? child.element : child)) {
        if(typeof child !== 'string') {
          child.element.parent = this.element;
        }

        if(typeof child !== 'string') {
          this.element.children.push(child.element);
        } else {
          this.element.children.push(child);
        }
      } else {
        throw new Error('Cannot add child to node [' + this.element.type + '] [' + (typeof child !== 'string' ? child.element.type : child) + ']');
      }
    }).catch(err => {
      this.error = err;
    });

    this.children.push(child);
    this.element.childCount = this.element.childCount || 0;
    this.element.childCount++;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);

    child.element.parent = null;
    this.children.slice(index, 1);
    this.element.children.slice(index, 1);
    this.element.childCount--;
  }

  async renderChildren() {
    const promises = [];
    for (const child of this.children) {
      if(typeof child !== 'string') {
        promises.push(Promise.resolve(child).then(child => {
          child.element.parentStyles = Object.assign({}, this.element.parentStyles || {}, (this.props || {}).style || {});
          return child.render();
        }));
      } else {
        const document = this.element && this.element.getDocument();
        if(this.allowsStrings && document) {
          document.add(new XElement(W.t, child));
        }
      }
    }

    return await Promise.all(promises);
  }

  async render() {
    if(this.error) {
      throw this.error;
    }

    await this.renderChildren();
    await this.element.render();
  }
}

export default Element;
