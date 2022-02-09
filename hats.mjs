import { parseHTML } from 'linkedom';

// Define the known attributes in an array to maintain
// the order of evaluation
const ATTRS = [
  // Template is a special as it does not rely on data
  // values, it only relies on the templates passed into
  // the environment.
  // 'data-template',

  // Show, Hide should be rendered after templates but
  // before each or content since they may include other
  // attributes that require processing
  'data-hide-if',
  'data-show-if',

  'data-each',
  'data-content'

  // We won't include content-format as it is a special
  // case of content and we shouldn't mutate the DOM
  // until the final (formatted) value is computed
  // 'data-content-format'
];

const CALLBACKS = {
  'data-template': template,
  'data-hide-if': hideIf,
  'data-show-if': showIf,
  'data-each': each,
  'data-content': content
}

// 'data-template="<value> [<value>]*"' will take the template
// named <value> from the environment and add <value>'s contents
// as a child of the Element.
//
// Multiple templates can be provided as space-seperated names
// and they will be appended in the order they are specified.
//
function template(selected, { templates }) {
  if (!templates) return;
  selected.forEach(s => {
    const template = s.dataset['template'].trim();
    const children = template.split(' ').map(t => templates[t]);
    s.innerHTML = children.join('');
  });
}

// 'data-hide-if="<value>"' will remove the element if <value>
// is truthy and show the element if <value> is falsey.
//
function hideIf(selected, data) {
  selected.forEach(s => {
    // Trim any preceding or trailing whitespace before lookup
    const hideIf = s.dataset['hideIf'].trim();
    const value = data[hideIf];
    if (value) s.remove();
  });
}

// 'data-show-if="<value>"' will render the element if <value>
// is truthy and remove the element if <value> is falsey.
//
function showIf(selected, data) {
  selected.forEach(s => {
    // Trim any preceding or trailing whitespace before lookup
    const showIf = s.dataset['showIf'].trim();
    const value = data[showIf];
    if (!value) s.remove();
  });
}

// 'data-each="<value>"' will use the children of the Element
// as a template to render each iteration. Both objects and
// arrays can be iterated over with data-each.
//
// The key (index for an array) and value be accessed by
// 'data-content' using the values 'key' and 'val'.
//
function each(selected, data, env) {
  selected.forEach(s => {
    const each = s.dataset['each'].trim();
    const value = data[each];

    // store the child nodes to reset the children
    // call apply and take remove the mutated child nodes,
    // replacing them with the stored child nodes
    s.innerHTML = result;
  });
}

// 'data-content[="<value>" | ""]' will look for <value> in
// the data object provided to the template.
//
// If <value> is an object, any 'data-content' attributes on
// the children of the Element will access the properties of
// <value>.
//
// In the context of 'data-each' element, 'data-content' can
// be without a value and that reference the current element
// of the array.
//
function content(selected, data, { formats }) {
  selected.forEach(s => {
    // Trim any preceding or trailing whitespace before lookup
    const content = s.dataset['content'].trim();
    const value = data[content];
    // We don't want 'undefined' (unless it is the string "undefined")
    // to be stringified in the DOM
    if (value !== undefined) {
      const format = s.dataset['contentFormat'];
      if (format === undefined || format === '') {
        s.innerHTML = value;
        return;
      }
      // Trim any preceding or trailing whitespace and then split.
      // Just like classes, multiple space-seperated formats can
      // be specified. The space in this instance is like a pipe,
      // and the formats will be applied in the order they are
      // specified
      const formattedValue = format.trim().split(' ').reduce((v, f) => {
        const formatter = formats && formats[f];
        return (formatter) ? formatter(v) : v;
      }, value);
      s.innerHTML = formattedValue;
    }
  });
}

function apply(document, data, environment) {
  ATTRS.forEach(a => {
    CALLBACKS[a](document.querySelectorAll(`[${a}]`), data, environment)
  });
  return document.toString();
}

export function compile(template, environment = {}) {
  let { document } = parseHTML(template);
  // Process all data-template attributes first as it only
  // requires the environment (not any data)
  CALLBACKS['data-template'](document.querySelectorAll('[data-template]'), environment);
  return (data = {}) => apply(document, data, environment);
}

export function render(html, data, env) {
  return compile(html, env)(data);
}

export default {
  compile,
  render,
}