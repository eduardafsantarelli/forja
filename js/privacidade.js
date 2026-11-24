'use strict';

// Consentimento da Política de Privacidade (LGPD): obrigatório ao criar conta
// e pedido uma única vez a quem já usava o app antes da política.
(() => {
  const PENDING = 'forja-consentimento-pendente'
  const POLICY_VERSION = '2026-11'
  const consentText = 'Li e concordo com a <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>, inclusive com o uso de dados de saúde que eu informar (como peso, alergias e intolerâncias) para personalizar o FORJA.'

  function enhanceAuthForm() {
    const form = document.querySelector('#auth-form')
    if (!form?.querySelector('#f-name') || form.querySelector('[name="consent"]')) return
    form.querySelector('#auth-error').insertAdjacentHTML('beforebegin', '<label class="consent"><input type="checkbox" name="consent" required> <span>' + consentText + '</span></label>')
  }
  new MutationObserver(enhanceAuthForm).observe(document.querySelector('#auth-form'), { childList: true })

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'auth-form' && event.target.querySelector('[name="consent"]')?.checked) ForjaStorage.writeSession(PENDING, POLICY_VERSION)
  }, true)

  function recordConsent() {
    state.consent = { version: POLICY_VERSION, acceptedAt: new Date().toISOString() }
    return save()
  }

  function decorate() {
    if (!ForjaHooks.isSignedIn()) return
    if (state.consent?.version === POLICY_VERSION) return document.querySelector('.consent-notice')?.remove()
    if (ForjaStorage.readSession(PENDING) === POLICY_VERSION) {
      ForjaStorage.removeSession(PENDING)
      recordConsent()
      return
    }
    if (document.querySelector('.consent-notice')) return
    document.querySelector('#app').insertAdjacentHTML('afterbegin', '<div class="notice consent-notice" role="region" aria-label="Política de Privacidade"><span>Publicamos a Política de Privacidade do FORJA. Para continuar guardando seus dados de saúde, confirme que concorda com ela.</span><span class="actions"><a class="button secondary small" href="privacidade.html" target="_blank" rel="noopener">Ler a política</a><button class="button small" type="button" data-consent-accept>Concordo</button></span></div>')
  }

  function decorateAbout() {
    const disclaimer = document.querySelector('.about-disclaimer')
    if (!disclaimer || document.querySelector('.about-privacy')) return
    disclaimer.insertAdjacentHTML('afterend', '<p class="help about-privacy">Privacidade e contato: leia a <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>. Para pedidos sobre seus dados, fale com a equipe pelo GitHub em <a href="https://github.com/eduardafsantarelli" rel="noopener">github.com/eduardafsantarelli</a>.</p>')
  }

  function decorateDataControls() {
    const actions = document.querySelector('.data-controls .actions')
    if (actions && !actions.querySelector('[href="privacidade.html"]')) {
      actions.insertAdjacentHTML('beforeend', '<a class="button secondary small" href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>')
    }
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-consent-accept]')) return
    if (recordConsent()) {
      document.querySelector('.consent-notice')?.remove()
      toast('Obrigado! Sua confirmação foi registrada.')
    }
  })

  ForjaHooks.afterRender(() => {
    decorate()
    decorateDataControls()
    decorateAbout()
  })
})()
