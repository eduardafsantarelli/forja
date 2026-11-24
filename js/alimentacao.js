'use strict';

// Alimentação: busca na tabela TACO ao cadastrar alimentos e lista de compras do cardápio.
(() => {
  const CATEGORY_LABELS = {
    carboidrato: 'Grãos, pães e tubérculos', leguminosa: 'Leguminosas', proteina: 'Proteínas', laticinio: 'Laticínios',
    fruta: 'Frutas', vegetal: 'Verduras e legumes', gordura: 'Oleaginosas e gorduras', outros: 'Outros',
  }
  const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS)
  const taco = () => window.FORJA_TACO?.alimentos || []

  // ---------- Cadastro de alimento com a TACO ----------
  function enhanceFoodForm() {
    const nameInput = document.querySelector('#modal-form #f-name[list="food-suggestions"]')
    if (!nameInput || nameInput.dataset.taco) return
    nameInput.dataset.taco = 'true'
    const list = document.querySelector('#food-suggestions')
    list.insertAdjacentHTML('beforeend', taco().map(([name]) => '<option value="' + esc(name) + '"></option>').join(''))
    nameInput.insertAdjacentHTML('afterend', '<small class="field-hint">Busque entre ' + num(list.children.length) + ' alimentos, incluindo a tabela TACO (UNICAMP).</small>')
    nameInput.addEventListener('input', () => {
      const match = taco().find(([name]) => name.toLowerCase() === nameInput.value.trim().toLowerCase())
      if (!match) return
      const [, kcal, protein, carbs, fat] = match
      document.querySelector('#f-calories').value = kcal
      document.querySelector('#f-protein').value = protein
      document.querySelector('#f-carbs').value = carbs
      document.querySelector('#f-fat').value = fat
    })
  }
  new MutationObserver(enhanceFoodForm).observe(document.querySelector('#modal-form'), { childList: true })

  // ---------- Lista de compras ----------
  const checkedKey = () => ForjaHooks.scopedKey('forja-compras')

  function shoppingItems(plan) {
    const totals = new Map()
    plan.plano.forEach((dia) => dia.refeicoes.forEach((refeicao) => refeicao.alimentos.forEach((alimento) => {
      const grams = Number(alimento.porcao) || getFoodMacroMeta(alimento.nome).portion || 100
      const key = normalizeName(alimento.nome)
      const current = totals.get(key) || { nome: alimento.nome, gramas: 0, categoria: alimento.categoria || 'outros' }
      current.gramas += grams
      totals.set(key, current)
    })))
    return [...totals.values()].sort((first, second) => first.nome.localeCompare(second.nome, 'pt-BR'))
  }

  function amountLabel(item) {
    const unit = MEAL_UNITS[normalizeName(item.nome)]
    const weight = item.gramas >= 1000 ? num(Math.round(item.gramas / 100) / 10) + ' kg' : num(Math.round(item.gramas / 10) * 10) + ' g'
    if (!unit) return weight
    const count = Math.ceil(item.gramas / unit[0])
    return count + ' ' + (count === 1 ? unit[1] : unit[2]) + ' (' + weight + ')'
  }

  function shoppingPanel(plan) {
    const items = shoppingItems(plan)
    const checked = new Set(ForjaStorage.readJSON(checkedKey()) || [])
    const groups = CATEGORY_ORDER.map((category) => [category, items.filter((item) => (CATEGORY_LABELS[item.categoria] ? item.categoria : 'outros') === category)]).filter(([, list]) => list.length)
    return '<section class="panel shopping-list" aria-labelledby="shopping-title">'
      + '<div class="panel-head"><div><p class="eyebrow orange">PRATICIDADE</p><h3 id="shopping-title">Lista de compras da semana</h3></div><span class="tag">' + items.length + ' ITENS</span></div>'
      + '<p class="help">Quantidades somadas dos 7 dias do cardápio, já com as porções ajustadas. Arredonde para as embalagens que você encontra.</p>'
      + '<div class="shopping-groups">' + groups.map(([category, list]) => '<div class="shopping-group"><h4>' + CATEGORY_LABELS[category] + '</h4><ul>'
        + list.map((item) => { const key = normalizeName(item.nome); return '<li><label><input type="checkbox" data-shopping-item="' + esc(key) + '"' + (checked.has(key) ? ' checked' : '') + '> <span>' + esc(item.nome) + '</span> <small>' + amountLabel(item) + '</small></label></li>' }).join('')
        + '</ul></div>').join('') + '</div>'
      + '<div class="actions"><button class="button secondary small" type="button" data-shopping-copy>Copiar lista</button><button class="button secondary small" type="button" data-shopping-print>Imprimir</button><button class="delete" type="button" data-shopping-clear>Desmarcar tudo</button></div>'
      + '</section>'
  }

  function shoppingText() {
    const plan = state.nutritionPlan
    return 'Lista de compras FORJA\n\n' + shoppingItems(plan).map((item) => '- ' + item.nome + ': ' + amountLabel(item)).join('\n')
  }

  function decorate() {
    const planPanel = document.querySelector('.nutrition-plan')
    if (!planPanel || document.querySelector('.shopping-list') || state.nutritionPlan?.versao !== 2) return
    planPanel.insertAdjacentHTML('afterend', shoppingPanel(state.nutritionPlan))
  }

  document.addEventListener('change', (event) => {
    const box = event.target.closest('[data-shopping-item]')
    if (!box) return
    const checked = new Set(ForjaStorage.readJSON(checkedKey()) || [])
    if (box.checked) checked.add(box.dataset.shoppingItem)
    else checked.delete(box.dataset.shoppingItem)
    ForjaStorage.writeJSON(checkedKey(), [...checked])
  })

  document.addEventListener('click', async (event) => {
    if (event.target.closest('[data-shopping-copy]')) {
      try {
        await navigator.clipboard.writeText(shoppingText())
        toast('Lista copiada. Cole no seu app de notas ou mensagens.')
      } catch {
        toast('Não foi possível copiar automaticamente neste navegador.')
      }
      return
    }
    if (event.target.closest('[data-shopping-print]')) {
      document.body.classList.add('printing-shopping')
      window.print()
      setTimeout(() => document.body.classList.remove('printing-shopping'), 500)
      return
    }
    if (event.target.closest('[data-shopping-clear]')) {
      ForjaStorage.writeJSON(checkedKey(), [])
      document.querySelectorAll('[data-shopping-item]').forEach((box) => { box.checked = false })
    }
    // Um cardápio novo começa com a lista desmarcada.
    if (event.target.closest('[data-action="generate-nutrition-plan"], [data-action="clear-nutrition-plan"]')) ForjaStorage.writeJSON(checkedKey(), [])
  })

  ForjaHooks.afterRender(decorate)
})()
