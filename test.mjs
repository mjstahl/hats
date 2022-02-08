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