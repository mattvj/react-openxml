import { OpenXMLRenderer, createElement, openxml } from '../src';

export default async document => {
  const container = await createElement('ROOT');
  const node = OpenXMLRenderer.createContainer(container);

  OpenXMLRenderer.updateContainer(document, node, null);

  return openxml(container).toString();
};