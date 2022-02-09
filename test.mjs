import test from 'ava';
import { render } from './hats.mjs';

test('hide if data-show-if is false', t => {
  const template = `
  <div data-show-if="undef"></div>
  <div data-content="last"></div>
  `;
  const expected = `
  <div data-content="last">Stahl</div>
  `;
  const result = render(template, { last: 'Stahl' });
  t.is(result.trim(), expected.trim());
});

test('render show-if and then content', t => {
  const template = `
  <div data-show-if="first" data-content="first"></div>
  <div data-content="last"></div>
  `;
  const expected = `
  <div data-show-if="first" data-content="first">Mark</div>
  <div data-content="last">Stahl</div>
  `;
  const result = render(template, { first: 'Mark', last: 'Stahl' });
  t.is(result.trim(), expected.trim());
});

test('show data-hide-if if false', t => {
  const template = `
  <div data-hide-if="undef"></div>
  <div data-content="last"></div>
  `;
  const expected = `
  <div data-hide-if="undef"></div>
  <div data-content="last">Stahl</div>
  `;
  const result = render(template, { last: 'Stahl' });
  t.is(result.trim(), expected.trim());
});

test('remove data-hide-if if true', t => {
  const template = `
  <div data-hide-if="last"></div>
  <div data-content="last"></div>
  `;
  const expected = `
  <div data-content="last">Stahl</div>
  `;
  const result = render(template, { last: 'Stahl' });
  t.is(result.trim(), expected.trim());
});

test('render data-content', t => {
  const template = `
  <div data-content="first"></div>
  <div data-content="last"></div>
  `;
  const expected = `
  <div data-content="first">Mark</div>
  <div data-content="last">Stahl</div>
  `;
  const result = render(template, { first: 'Mark', last: 'Stahl' });
  t.is(result.trim(), expected.trim());
});

test('format not found', t => {
  const template = `
  <div data-content="first" data-content-format="uppercase"></div>
  `;
  const expected = `
  <div data-content="first" data-content-format="uppercase">Mark</div>
  `;

  const result = render(template, { first: 'Mark'})
  t.is(result.trim(), expected.trim());
});

test('single content format', t => {
  const template = `
  <div data-content="first" data-content-format="lowercase"></div>
  `;
  const expected = `
  <div data-content="first" data-content-format="lowercase">mark</div>
  `;

  const env = {
    formats: {
      lowercase: (val) => val.toLowerCase()
    }
  };
  const result = render(template, { first: 'Mark'}, env)
  t.is(result.trim(), expected.trim());
});

test('more than one content format', t => {
  const template = `
  <div data-content="first" data-content-format="uppercase explode"></div>
  `;
  const expected = `
  <div data-content="first" data-content-format="uppercase explode">M A R K</div>
  `;

  const env = {
    formats: {
      uppercase: (val) => val.toUpperCase(),
      explode: (val) => val.split('').join(' ')
    }
  };
  const result = render(template, { first: 'Mark'}, env)
  t.is(result.trim(), expected.trim());
});