import Styles from '../util/styles';

class Base {
  constructor(root, props, type) {
    this.root = root;
    this.props = props;
    this.type = type;
  }

  doneInitializing() {
  }

  async render() {
    const document = this.getDocument();
    if(document) {
      Styles.addStyles(this, document, this.getProperties());

      if(this.parent && document) {
        this.parent.add(document);
      }
    }
  }

  getDocument() {
  }

  getProperties() {
  }

  allowsStrings() {
    return false;
  }

  add(element) {
    const document = this.getDocument();
    if(document) {
      document.add(element);
    }
  }

  canAdd(element) {
    return true;
  }
}

export default Base;
