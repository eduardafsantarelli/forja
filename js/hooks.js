'use strict';

// Ponto de extensão dos módulos extras do FORJA.
// Cada módulo registra uma função que roda depois de cada renderização da tela,
// sem precisar alterar app.js ou experience.js.
(() => {
  const listeners = []

  function runListeners() {
    listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error('[FORJA] erro em módulo extra:', error)
      }
    })
  }

  function wrapRender() {
    if (typeof render !== 'function' || render.forjaHooked) return
    const baseRender = render
    const hookedRender = function (...args) {
      const result = baseRender.apply(this, args)
      runListeners()
      return result
    }
    hookedRender.forjaHooked = true
    render = hookedRender
  }

  window.ForjaHooks = Object.freeze({
    afterRender(listener) {
      listeners.push(listener)
      wrapRender()
      if (document.querySelector('#app')?.children.length) listener()
    },
    // Chave de armazenamento separada por conta (KEY já inclui o ID do usuário).
    scopedKey(name) {
      return name + ':' + KEY
    },
    dateKey(date = new Date()) {
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
    },
    isSignedIn() {
      return !document.body.classList.contains('auth-required') && Boolean(document.querySelector('#app')?.children.length)
    },
  })
})()
