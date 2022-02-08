import { parseHTML } from 'linkedom';

// Define the known attributes in an array to maintain
// the order of evaluation
const ATTRS = [
  // Show, Hide, and Templates should be rendered first
  // since they may include other attributes that require
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

function hideIf(selected, data, env) {
  selected.forEach(selected => {
    const value = data[selected.dataset['hideIf']];
    if (value) selected.remove();
  });
}

function showIf(selected, data, env) {
  selected.forEach(selected => {
    const value = data[selected.dataset['showIf']];
    if (!value) selected.remove();
  });
}

function content(selected, data, env) {
  selected.forEach(selected => {
    const value = data[selected.dataset['content']];
    // We don't want 'undefined' (unless it is the string "undefined")
    // to be stringified in the DOM
    if (value != undefined) {
      selected.innerHTML = value;
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