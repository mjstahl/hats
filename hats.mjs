import { JSDOM } from 'jsdom';

// Define the known attributes in an array to maintain
// the order of evaluation
const ATTRS = [
  // Show, Hide, and Templates should be rendered first
  // since they may include other directives that require
  // processing
  'data-hide-if',
  'data-show-if',

  'data-content'
];

const CALLBACKS = {
  'data-hide-if': hideIf,
  'data-show-if': showIf,
  'data-content': content
}

// Assume we are dealing with DocumentFragments first
// and because of that we need a way to serialize them
// which requires a valid document
const document = (new JSDOM('<html></html>')).window.document;

function hideIf(selected, data) {
  selected.forEach(selected => {
    const value = data[selected.dataset['hideIf']];
    if (value) selected.remove();
  });
}

function showIf(selected, data) {
  selected.forEach(selected => {
    const value = data[selected.dataset['showIf']];
    if (!value) selected.remove();
  });
}

function content(selected, data) {
  selected.forEach(selected => {
    const value = data[selected.dataset['content']];
    // We don't want 'undefined' to be stringified in the DOM
    // for an undefined property
    if (value != undefined) {
      selected.innerHTML = value;
    }
  });
}

export function compile(template, environment = {}) {
  let fragment = JSDOM.fragment(template);
  return function(data) {
    ATTRS.forEach(a => CALLBACKS[a](fragment.querySelectorAll(`[${a}]`), data));
    const div = document.createElement('div');
    div.appendChild(fragment.cloneNode(true));
    return div.innerHTML.trim();
  }
}

export function render(html, data, env) {
  return compile(html, env)(data);
}

export default {
  compile,
  render,
}