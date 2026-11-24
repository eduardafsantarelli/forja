'use strict';

// Tour de boas-vindas: três passos curtos, exibido uma vez por conta
// depois que o perfil é completado.
(() => {
  const SEEN = 'forja-tour-visto'
  const STEPS = [
    ['💪', 'Treinos', 'Monte seus treinos em Treinos e toque em <strong>Iniciar treino</strong> para registrar série por série, com cronômetro de descanso.'],
    ['🥗', 'Alimentação', 'Cadastre alimentos com a busca da tabela TACO, gere o cardápio da semana e use a <strong>lista de compras</strong> pronta.'],
    ['📈', 'Evolução', 'Registre peso e medidas, acompanhe sua <strong>sequência de dias ativos</strong> e gere o resumo do mês para compartilhar.'],
  ]
  let step = 0

  function draw(dialog) {
    const [icon, title, text] = STEPS[step]
    dialog.innerHTML = '<div class="modal-top"><p class="eyebrow orange">BOAS-VINDAS · ' + (step + 1) + ' DE ' + STEPS.length + '</p><button class="icon-button" type="button" data-tour-close aria-label="Fechar">×</button></div>'
      + '<p class="tour-icon" aria-hidden="true">' + icon + '</p><h2 id="tour-title">' + title + '</h2><p class="tour-text">' + text + '</p>'
      + '<div class="tour-dots" aria-hidden="true">' + STEPS.map((_, index) => '<i' + (index === step ? ' class="active"' : '') + '></i>').join('') + '</div>'
      + '<div class="actions">' + (step < STEPS.length - 1 ? '<button class="button" type="button" data-tour-next>Próximo</button><button class="button secondary" type="button" data-tour-close>Pular</button>' : '<button class="button" type="button" data-tour-close>Começar</button>') + '</div>'
  }

  function open() {
    let dialog = document.querySelector('#tour')
    if (!dialog) {
      dialog = document.createElement('dialog')
      dialog.id = 'tour'
      dialog.className = 'tour'
      dialog.setAttribute('aria-labelledby', 'tour-title')
      document.body.appendChild(dialog)
      dialog.addEventListener('close', () => ForjaStorage.write(ForjaHooks.scopedKey(SEEN), 'sim'))
      dialog.addEventListener('click', (event) => {
        if (event.target.closest('[data-tour-next]')) {
          step++
          draw(dialog)
        } else if (event.target.closest('[data-tour-close]')) dialog.close()
      })
    }
    step = 0
    draw(dialog)
    dialog.showModal()
  }

  ForjaHooks.afterRender(() => {
    if (!ForjaHooks.isSignedIn() || location.hash.replace('#', '') !== 'inicio' || state.demo) return
    if (!state.profile.name || !Number(state.profile.age) || document.querySelector('dialog[open]')) return
    if (ForjaStorage.read(ForjaHooks.scopedKey(SEEN)) === 'sim') return
    setTimeout(() => { if (!document.querySelector('dialog[open]')) open() }, 400)
  })
})()
