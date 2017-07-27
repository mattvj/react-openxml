import MockDate from 'mockdate';
import render from './testRenderer';


describe('<Text />', () => {
  beforeEach(() => {
    MockDate.set(1434319925275);
  });

  const matchSnapshot = async (doc, done) => {
    let result;
    try {
      result = await render(<document>{doc}</document>);
      expect(result).toMatchSnapshot();
      done();
    } catch(err) {
      done.fail(err);
    }

  };

  test('Should render just a text', done => {
    matchSnapshot(
      <p><span>this is some text</span></p>,
      done,
    );
  });

  test('Should render two texts', done => {
    matchSnapshot(
      <p><span>this is some text</span><span>this is some other text</span></p>,
      done,
    );
  });

  test('Should render two pages', done => {
    matchSnapshot(
      <div><page><p><span>this is some text</span></p></page><page><p><span>this is some other text</span></p></page></div>,
      done,
    );
  });

  test('Should render two pages in section', done => {
    matchSnapshot(
      <div><section><title><span>funny</span></title><page><p><span>this is some text</span></p></page><page><p><span>this is some other text</span></p></page></section></div>,
      done,
    );
  });
});
