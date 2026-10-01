'use strict';

var KEY = 'upclick:v1';
var PALETTE = ['#3346F0', '#D98A00', '#1F8A5B', '#C62F3D', '#8A3FFC', '#0F8FB5', '#D6336C', '#6B7BA8'];
var HEX = /^#[0-9a-fA-F]{6}$/;
var SORTS = ['deadline', 'created-new', 'created-old', 'status', 'alpha'];

function $(s, r) { return (r || document).querySelector(s); }
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }
function firstLine(s) { return String(s).split('\n')[0]; }
function short(s, n) { s = firstLine(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

function el(tag, attrs) {
  var n = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.style.cssText = v;
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled') n[k] = v;
      else n.setAttribute(k, v === true ? '' : v);
    });
  }
  var kids = Array.prototype.slice.call(arguments, 2);
  (function add(list) {
    list.forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) add(c);
      else n.append(c instanceof Node ? c : document.createTextNode(String(c)));
    });
  })(kids);
  return n;
}
function svg(html) {
  var t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}
var ICON_CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';
var ICON_CHEV = '<svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>';
var ICON_PERSON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="5.5" r="2.6"/><path d="M2.8 13.5c.6-2.6 2.6-3.9 5.2-3.9s4.6 1.3 5.2 3.9"/></svg>';
var ICON_LINK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="3.5" cy="12.5" r="1.8"/><circle cx="12.5" cy="3.5" r="1.8"/><path d="M4.9 11.1l6.2-6.2"/></svg>';

