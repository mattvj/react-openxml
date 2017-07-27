'use strict';

import { OpenXMLRenderer, createElement } from './renderer'

const openxml = input => {
  async function parse(input) {
    const document = await input.document;

    await document.render();

    if (document.props.onRender) {
      document.props.onRender();
    }

    return input;
  }

  async function toBlob() {
    await parse(input);

    return input.saveToBlob();
  }

  async function toBuffer() {
    return await parse(input);
  }

  async function toString() {
    await parse(input);
    return await input.saveToBase64();
  }

  return {
    toBuffer,
    toBlob,
    toString,
  };
};

export {
  OpenXMLRenderer,
  createElement,
  openxml
};
