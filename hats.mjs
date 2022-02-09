import { parseHTML } from 'linkedom';

// Define the known attributes in an array to maintain
// the order of evaluation
const ATTRS = [
  // Show, Hide, and Templates should be rendered first
  // since they may include other attributes that require
  // processing
  // TODO 'data-template',
  'data-hide-if',
  'data-show-if',

  // TODO 'data-each',
  'data-content'

  // We won't include content-format as it is a special
  // case of content and we shouldn't mutate the DOM
  // until the final (formatted) value is computed
  // data-content-format
];

const CALLBACKS = {
  'data-hide-if': hideIf,
  'data-show-if': showIf,
  'data-content': content
}

// 'data-hide-if="<value>"' will remove the element if <value>
// is truthy and show the element if <value> is falsey.
function hideIf(selected, data, env) {
  selected.forEach(selected => {
    // Trim any preceding or trailing whitespace before lookup
    const hideIf = selected.dataset['hideIf'].trim();
    const value = data[hideIf];
    if (value) selected.remove();
  });
}

// 'data-show-if="<value>"' will render the element if <value>
// is truthy and remove the element if <value> is falsey.
function showIf(selected, data, env) {
  selected.forEach(selected => {
    // Trim any preceding or trailing whitespace before lookup
    const showIf = selected.dataset['showIf'].trim();
    const value = data[showIf];
    if (!value) selected.remove();
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
function content(selected, data, { formats }) {
  selected.forEach(selected => {
    // Trim any preceding or trailing whitespace before lookup
    const content = selected.dataset['content'].trim();
    const value = data[content];
    // We don't want 'undefined' (unless it is the string "undefined")
    // to be stringified in the DOM
    if (value !== undefined) {
      const format = selected.dataset['contentFormat'];
      if (format === undefined || format === '') {
        selected.innerHTML = value;
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
      selected.innerHTML = formattedValue;
    }
  });
}

export function compile(template, environment = {}) {
  let { document } = parseHTML(template);
  return function(data = {}) {
    ATTRS.forEach(a => {
      CALLBACKS[a](document.querySelectorAll(`[${a}]`), data, environment)
    });
    return document.toString();
  }
}

export function render(html, data, env) {
  return compile(html, env)(data);
}

export default {
  compile,
  render,
}