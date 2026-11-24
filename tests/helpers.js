'use strict'

// Carrega os scripts do navegador em um contexto isolado do Node (vm),
// com versões mínimas de document, localStorage e window.
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { webcrypto } = require('node:crypto')

const ROOT = path.join(__dirname, '..')

function fakeElement() {
  return {
    style: {}, dataset: {}, children: [], textContent: '', innerHTML: '', value: '',
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {}, setAttribute() {}, removeAttribute() {},
    appendChild() {}, insertAdjacentHTML() {}, querySelector: () => fakeElement(), querySelectorAll: () => [],
  }
}

function memoryStorage() {
  const data = new Map()
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  }
}

function loadScripts(files) {
  const context = {
    console, Intl, Math, Date, JSON, Number, String, Array, Object, Set, Map, Promise, RegExp, Error,
    setTimeout, clearTimeout, setInterval, clearInterval, structuredClone, crypto: webcrypto,
    localStorage: memoryStorage(), sessionStorage: memoryStorage(),
    navigator: {}, location: { hash: '#inicio', pathname: '/', search: '' },
    matchMedia: () => ({ matches: false }), requestAnimationFrame: () => 0, addEventListener() {},
    MutationObserver: class { observe() {} },
    history: { replaceState() {} }, scrollTo() {},
  }
  context.document = {
    querySelector: () => fakeElement(), querySelectorAll: () => [], addEventListener() {},
    createElement: () => fakeElement(), documentElement: { dataset: {} },
    body: { classList: { add() {}, remove() {}, contains: () => false }, appendChild() {} },
  }
  context.window = context
  vm.createContext(context)
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file })
  }
  context.run = (code) => vm.runInContext(code, context)
  return context
}

module.exports = { loadScripts }
