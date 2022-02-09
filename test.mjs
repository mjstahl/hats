import test from 'ava';
import { render } from './hats.mjs';

test('render data-template', t => {
  const headerTemplate = `<h1>Header</h1>`;
  const footerTemplate = `<footer>Footer</footer>`;
  const bodyTemplate = `
  <body>
    <div data-template="header"></div>
    <div data-template="footer"></div>
  </body>
  `;
  const expected = `
  <body>
    <div data-template="header"><h1>Header</h1></div>
    <div data-template="footer"><footer>Footer</footer></div>
  </body>
  `;
  const env = {
    templates: {
      header: headerTemplate,
      footer: footerTemplate
    }
  };
  const result = render(bodyTemplate, {}, env);
  t.is(result.trim(), expected.trim());
});

test('render multiple templates for single element', t => {
  const headerTemplate = `<h1>Header</h1>`;
  const footerTemplate = `<footer>Footer</footer>`;
  const bodyTemplate = `
  <body>
    <div data-template="header footer"></div>
  </body>
  `;
  const expected = `
  <body>
    <div data-template="header footer"><h1>Header</h1><footer>Footer</footer></div>
  </body>
  `;
  const env = {
    templates: {
      header: headerTemplate,
      footer: footerTemplate
    }
  };
  const result = render(bodyTemplate, {}, env);
  t.is(result.trim(), expected.trim());
});

test('render template with content', t => {
  const nameTemplate = `First Name: <span data-content="first"></span>`
  const bodyTemplate = `
  <body>
    <div data-template="name"></div>
  </body>
  `
  const expected = `
  <body>
    <div data-template="name">First Name: <span data-content="first">Mark</span></div>
  </body>
  `;
  const env = {
    templates: {
      name: nameTemplate
    }
  };
  const result = render(bodyTemplate, { first: 'Mark' }, env);
  t.is(result.trim(), expected.trim());
});

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

test.skip('render data-each', t => {
  const template = `
  <div data-each="numbers">
  <p>Number<p>
  </div>
  `;
  const expected = `
  <div data-each="numbers">
  <p>Number<p>
  <p>Number</p>
  </div>
  `
});

test.skip('render data-each with data-content', t => {
  t.pass();
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