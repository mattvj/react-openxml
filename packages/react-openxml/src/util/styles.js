import {openXml, ltxml} from 'openxml';

const W = openXml.W;

const XElement = ltxml.XElement;
const XAttribute = ltxml.XAttribute;

class Styles {

  static addStyleToElement(element, styleElement) {
    if(styleElement) {
      element.add(styleElement);
    }
  }

  static addStyle(element, type, styles) {
    const styleElement = Styles.convertStyle(element, type, styles);
    Styles.addStyleToElement(element, styleElement);
  }

  static addStyles(obj, element, propertyType) {
    const styles = Object.assign({}, obj.parentStyles || {}, (obj.props || {}).style || {});
    if(Object.keys(styles).length) {
      Styles.addStyle(element, propertyType, styles);
    }
  }

  static convertStyle(element, type, styles) {

    const currentStyleElement = element.descendantsAndSelf(type).toArray()[0];

    return Object.entries(styles).reduce((styleElement, [style, value]) => {
      let attribute;
      const camelCased = style.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

      if(Styles[camelCased]) {
        attribute = Styles[camelCased](type, value, styles);
      }

      if(attribute) {
        if(!styleElement) {
          styleElement = new XElement(type);
        }
        styleElement.add(attribute);
      }

      return styleElement;
    }, currentStyleElement);
  }

  static determineColor(value) {
    switch (value.toLowerCase()) {
      case 'red': return 'FF0000';
      case 'green': return '00FF00';
      case 'blue': return '00FF00';
      default:
        if (value.startsWith('#')) {
          return value.substring(1).toUpperCase();
        }
        break;
    }
  }

  static color(type, value) {
    let attribute;
    if(type === W.rPr) {
      const colorCode = Styles.determineColor(value);

      if (colorCode) {
        attribute = new XElement(W.color, new XAttribute(W.val, colorCode));
      }
    }

    return attribute;
  }

  static textDecorationColor(type, value) {
    let attribute;
    if(value && (type === W.rPr)) {
      const colorCode = Styles.determineColor(value);

      if (colorCode) {
        attribute = new XAttribute(W.color, colorCode);
      }
    }

    return attribute;
  }

  static textDecorationLine(type, value, styles) {
    let attribute;
    if(type === W.rPr) {

      const colorAttribute = Styles.textDecorationColor(type, styles['text-docoration-color'], styles);

      switch (value.toLowerCase()) {
        case 'underline': {
          attribute = new XElement(W.u, new XAttribute(W.val, 'single'));
          break;
        }

        case 'line-through': {
          attribute = new XElement(W.strike, new XAttribute(W.val, 'true'));
          break;
        }
        default:
          break;
      }

      if(colorAttribute) {
        attribute.add(colorAttribute);
      }
    }

    return attribute;
  }

  static fontStyle(type, value) {
    let attribute;
    if(type === W.rPr) {

      switch (value.toLowerCase()) {
        case 'italics': {
          attribute = new XElement(W.i);
          break;
        }
        default:
          break;
      }
    }

    return attribute;
  }

  static fontWeight(type, value) {
    let attribute;
    if(type === W.rPr) {

      switch (value.toLowerCase()) {
        case 'bold': {
          attribute = new XElement(W.b);
          break;
        }
        default:
          break;
      }
    }

    return attribute;
  }

  static textTransform(type, value) {
    let attribute;
    if(type === W.rPr) {

      switch (value.toLowerCase()) {
        case 'uppercase': {
          attribute = new XElement(W.caps, new XAttribute(W.val, 'true'));
          break;
        }
        case 'lowercase': {
          attribute = new XElement(W.smallCaps, new XAttribute(W.val, 'true'));
          break;
        }
        default:
          break;
      }
    }

    return attribute;
  }

  static fontSize(type, value) {
    let attribute;
    if(type === W.rPr) {

      if(value.toLowerCase().endsWith('pt')) {
        attribute = new XElement(W.sz, new XAttribute(W.val, (+value.substring(0, value.length - 2) * 2).toString()));
      }
    }

    return attribute;
  }

  static textStyle(type, value) {
    let attribute;
    if(type === W.rPr || type === W.pPr) {

      attribute = new XElement(type === W.rPr ? W.rStyle : W.pStyle, new XAttribute(W.val, value));
    }

    return attribute;
  }
}

export default Styles;
