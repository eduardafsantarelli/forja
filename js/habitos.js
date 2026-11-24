'use strict';

// Hábitos e motivação: hidratação, sequência de dias ativos, conquistas,
// medidas corporais e resumo mensal em imagem.
(() => {
  const MEASURES = [['waist', 'Cintura'], ['hip', 'Quadril'], ['chest', 'Peito'], ['arm', 'Braço'], ['thigh', 'Coxa']]
  const DEFAULT_WATER_GOAL = 2000
  const day = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return ForjaHooks.dateKey(date)
  }
  const hydration = () => (state.hydration && typeof state.hydration === 'object' ? state.hydration : {})
  const waterGoal = () => Number(state.profile.waterGoal) || DEFAULT_WATER_GOAL
  const measures = () => (Array.isArray(state.measures) ? state.measures : [])

  // ---------- Dias ativos e sequência ----------
  function activeDays() {
    const days = new Set()
    state.executions.forEach((entry) => days.add(entry.date))
    state.meals.forEach((entry) => days.add(entry.date))
    Object.entries(state.dailyGoals || {}).forEach(([date, goals]) => { if (Object.values(goals || {}).some(Boolean)) days.add(date) })
    Object.entries(hydration()).forEach(([date, ml]) => { if (ml >= waterGoal()) days.add(date) })
    return days
  }

  function streaks() {
    const days = activeDays()
    let current = 0
    for (let offset = days.has(day()) ? 0 : -1; days.has(day(offset)); offset--) current++
    const sorted = [...days].sort()
    let best = 0
    let run = 0
    let previous = null
    sorted.forEach((date) => {
      const diff = previous ? Math.round((new Date(date + 'T12:00:00') - new Date(previous + 'T12:00:00')) / 86400000) : 0
      run = diff === 1 ? run + 1 : 1
      best = Math.max(best, run)
      previous = date
    })
    return { current, best, total: days.size }
  }

  function achievements() {
    const trainingDays = new Set(state.executions.map((entry) => entry.date)).size
    const mealDays = new Set(state.meals.map((entry) => entry.date)).size
    const hydratedDays = Object.values(hydration()).filter((ml) => ml >= waterGoal()).length
    const { best } = streaks()
    const lastWeight = state.weights.slice().sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.weight
    const target = Number(state.profile.target)
    return [
      ['🏋️', 'Primeiro treino', 'Registre o primeiro treino.', trainingDays >= 1],
      ['🔟', '10 dias de treino', 'Treine em 10 dias diferentes.', trainingDays >= 10],
      ['🏆', '30 dias de treino', 'Treine em 30 dias diferentes.', trainingDays >= 30],
      ['🔥', 'Semana firme', '7 dias ativos seguidos.', best >= 7],
      ['⭐', 'Mês firme', '30 dias ativos seguidos.', best >= 30],
      ['🥗', 'Primeira refeição', 'Registre uma refeição.', mealDays >= 1],
      ['📒', 'Diário alimentar', 'Registre refeições em 7 dias.', mealDays >= 7],
      ['💧', 'Bem hidratado', 'Bata a meta de água em 7 dias.', hydratedDays >= 7],
      ['📏', 'Medidas em dia', 'Registre suas medidas.', measures().length >= 1],
      ['🎯', 'Meta de peso', 'Chegue a até 0,5 kg da meta.', Boolean(lastWeight && target && Math.abs(lastWeight - target) <= 0.5)],
    ]
  }

  // ---------- Painéis do início ----------
  function hydrationPanel() {
    const ml = hydration()[day()] || 0
    const goal = waterGoal()
    const percent = Math.min(100, Math.round((ml / goal) * 100))
    return '<section class="panel habit-panel hydration-panel" aria-labelledby="hydration-title">'
      + '<div class="panel-head"><div><p class="eyebrow orange">HIDRATAÇÃO</p><h3 id="hydration-title">Água de hoje</h3></div><span class="tag">' + percent + '%</span></div>'
      + '<p class="habit-number"><strong>' + num(ml) + '</strong> de ' + num(goal) + ' ml</p>'
      + '<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="' + goal + '" aria-valuenow="' + ml + '" aria-label="Água consumida hoje"><i style="width:' + percent + '%"></i></div>'
      + '<div class="actions habit-actions"><button class="button small" type="button" data-water="200">+ Copo (200 ml)</button><button class="button secondary small" type="button" data-water="500">+ Garrafa (500 ml)</button><button class="delete" type="button" data-water="-200"' + (ml ? '' : ' disabled') + '>Desfazer copo</button></div>'
      + '<form class="water-goal" data-water-goal><label for="water-goal-input">Meta diária (ml)</label><input id="water-goal-input" name="goal" type="number" min="500" max="6000" step="50" value="' + goal + '"><button class="delete" type="submit">Salvar meta</button></form>'
      + '</section>'
  }

  function streakPanel() {
    const { current, best, total } = streaks()
    const list = achievements()
    const earned = list.filter((item) => item[3]).length
    return '<section class="panel habit-panel streak-panel" aria-labelledby="streak-title">'
      + '<div class="panel-head"><div><p class="eyebrow orange">CONSTÂNCIA</p><h3 id="streak-title">Sua sequência</h3></div><span class="tag">' + earned + '/' + list.length + ' CONQUISTAS</span></div>'
      + '<div class="streak-numbers"><p><strong>' + current + '</strong><span>' + (current === 1 ? 'dia seguido' : 'dias seguidos') + '</span></p><p><strong>' + best + '</strong><span>melhor sequência</span></p><p><strong>' + total + '</strong><span>dias ativos</span></p></div>'
      + '<p class="help">Conta como ativo o dia com treino, refeição registrada, meta do dia concluída ou meta de água batida.</p>'
      + '<ul class="badges">' + list.map(([icon, name, hint, done]) => '<li class="badge' + (done ? ' is-earned' : '') + '" title="' + esc(hint) + '"><span aria-hidden="true">' + icon + '</span><strong>' + esc(name) + '</strong><small>' + (done ? 'Conquistada' : esc(hint)) + '</small></li>').join('') + '</ul>'
      + '<div class="actions"><button class="button secondary small" type="button" data-month-summary>Gerar resumo do mês</button></div>'
      + '</section>'
  }

  // ---------- Medidas corporais (Evolução) ----------
  function measuresPanel() {
    const list = measures().slice().sort((a, b) => a.date.localeCompare(b.date))
    const first = list[0]
    const last = list.at(-1)
    const diff = (key) => {
      if (!first || !last || first === last || !first[key] || !last[key]) return ''
      const delta = last[key] - first[key]
      return ' <small class="' + (delta < 0 ? 'delta-down' : delta > 0 ? 'delta-up' : '') + '">' + (delta > 0 ? '+' : '') + num(delta) + ' cm</small>'
    }
    const waistSeries = list.filter((entry) => entry.waist).slice(-10)
    return '<section class="panel measures-panel" aria-labelledby="measures-title">'
      + '<div class="panel-head"><div><p class="eyebrow orange">MEDIDAS CORPORAIS</p><h3 id="measures-title">Além da balança</h3></div><span class="tag">CM</span></div>'
      + (last ? '<div class="measure-grid">' + MEASURES.map(([key, label]) => '<p><span>' + label + '</span><strong>' + (last[key] ? num(last[key]) + ' cm' : '—') + '</strong>' + diff(key) + '</p>').join('') + '</div>' : '')
      + (waistSeries.length > 1 ? '<p class="eyebrow">CINTURA</p>' + chart([{ values: waistSeries.map((entry) => entry.waist) }], waistSeries.map((entry) => fmtDate(entry.date)), { unit: 'cm', fit: true }) : '')
      + '<form class="measure-form" data-measure-form><div class="form-grid">'
      + MEASURES.map(([key, label]) => '<div class="field"><label for="m-' + key + '">' + label + ' (cm)</label><input id="m-' + key + '" name="' + key + '" type="number" min="10" max="250" step="any" inputmode="decimal"></div>').join('')
      + '<div class="field"><label for="m-date">Data</label><input id="m-date" name="date" type="date" max="' + day() + '" value="' + day() + '" required></div>'
      + '</div><p class="error" id="measure-error" role="alert"></p><button class="button small" type="submit">Salvar medidas</button></form>'
      + (list.length ? '<div class="rows measure-history">' + list.slice().reverse().slice(0, 6).map((entry) => '<div class="row"><div><strong>' + fmtDate(entry.date) + '</strong><small>' + MEASURES.filter(([key]) => entry[key]).map(([key, label]) => label + ' ' + num(entry[key])).join(' · ') + '</small></div><button class="delete" type="button" data-measure-remove="' + entry.id + '">Excluir</button></div>').join('') + '</div>' : '')
      + '</section>'
  }

  function decorate() {
    const highlights = document.querySelector('.dashboard-highlights')
    if (highlights && !document.querySelector('.hydration-panel')) {
      highlights.insertAdjacentHTML('afterend', '<div class="habit-grid">' + hydrationPanel() + streakPanel() + '</div>')
    }
    const evolutionColumns = document.querySelector('#app .columns')
    if (location.hash === '#evolucao' && evolutionColumns && !document.querySelector('.measures-panel')) {
      evolutionColumns.insertAdjacentHTML('afterend', measuresPanel())
    }
  }

  function refresh() {
    document.querySelector('.habit-grid')?.remove()
    document.querySelector('.measures-panel')?.remove()
    decorate()
  }

  // ---------- Resumo mensal em imagem ----------
  async function monthSummary() {
    const now = new Date()
    const prefix = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
    const inMonth = (entry) => entry.date.startsWith(prefix)
    const executions = state.executions.filter(inMonth)
    const volume = executions.filter((entry) => entry.type === 'strength').reduce((sum, entry) => sum + entry.sets * entry.reps * entry.load, 0)
    const weights = state.weights.filter(inMonth).sort((a, b) => a.date.localeCompare(b.date))
    const weightDelta = weights.length > 1 ? weights.at(-1).weight - weights[0].weight : null
    const days = [...activeDays()].filter((date) => date.startsWith(prefix)).length
    const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const stats = [
      ['Dias ativos', String(days)],
      ['Treinos registrados', String(new Set(executions.map((entry) => entry.date)).size)],
      ['Volume de força', num(Math.round(volume)) + ' kg'],
      ['Refeições registradas', String(state.meals.filter(inMonth).length)],
      ['Melhor sequência', streaks().best + (streaks().best === 1 ? ' dia' : ' dias')],
      ['Variação de peso', weightDelta === null ? '—' : (weightDelta > 0 ? '+' : '') + num(weightDelta) + ' kg'],
    ]
    await document.fonts?.ready
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1350
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0b0b0b'
    ctx.fillRect(0, 0, 1080, 1350)
    ctx.fillStyle = '#e52436'
    ctx.fillRect(0, 0, 1080, 14)
    ctx.fillRect(80, 96, 64, 64)
    ctx.fillStyle = '#0b0b0b'
    ctx.font = '800 54px "Barlow Condensed", sans-serif'
    ctx.fillText('F', 98, 148)
    ctx.fillStyle = '#f5f3ed'
    ctx.fillText('FORJA', 164, 148)
    ctx.fillStyle = '#ff5c6b'
    ctx.font = '600 30px "DM Sans", sans-serif'
    ctx.fillText('RESUMO DE ' + monthName.toUpperCase(), 80, 250)
    ctx.fillStyle = '#f5f3ed'
    ctx.font = '800 96px "Barlow Condensed", sans-serif'
    ctx.fillText((state.profile.name || 'Seu mês').toUpperCase().slice(0, 18), 80, 350)
    stats.forEach(([label, value], index) => {
      const x = 80 + (index % 2) * 470
      const y = 470 + Math.floor(index / 2) * 250
      ctx.fillStyle = '#1b1b1a'
      ctx.fillRect(x, y, 440, 210)
      ctx.fillStyle = '#e52436'
      ctx.fillRect(x, y, 8, 210)
      ctx.fillStyle = '#c4c4be'
      ctx.font = '500 30px "DM Sans", sans-serif'
      ctx.fillText(label, x + 40, y + 70)
      ctx.fillStyle = '#f5f3ed'
      ctx.font = '800 76px "Barlow Condensed", sans-serif'
      ctx.fillText(value, x + 40, y + 160)
    })
    ctx.fillStyle = '#a8a8a4'
    ctx.font = '500 28px "DM Sans", sans-serif'
    ctx.fillText('Uma repetição. Uma escolha. Um dia de cada vez.', 80, 1270)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    const file = new File([blob], 'forja-resumo-' + prefix + '.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Meu mês no FORJA' })
        return
      } catch { /* se o compartilhamento for cancelado, baixa a imagem */ }
    }
    const url = URL.createObjectURL(blob)
    const link = Object.assign(document.createElement('a'), { href: url, download: file.name })
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast('Resumo do mês gerado.')
  }

  // ---------- Eventos ----------
  document.addEventListener('click', (event) => {
    const water = event.target.closest('[data-water]')
    if (water) {
      const date = day()
      state.hydration = { ...hydration(), [date]: Math.max(0, (hydration()[date] || 0) + Number(water.dataset.water)) }
      if (save()) refresh()
      return
    }
    if (event.target.closest('[data-month-summary]')) {
      monthSummary().catch(() => toast('Não foi possível gerar a imagem do resumo.'))
      return
    }
    const removeMeasure = event.target.closest('[data-measure-remove]')
    if (removeMeasure && confirm('Excluir este registro de medidas?')) {
      state.measures = measures().filter((entry) => entry.id !== removeMeasure.dataset.measureRemove)
      if (save()) {
        refresh()
        toast('Medidas excluídas.')
      }
    }
  })

  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-water-goal]')) {
      event.preventDefault()
      const goal = Number(new FormData(event.target).get('goal'))
      if (!(goal >= 500 && goal <= 6000)) return toast('Escolha uma meta de água entre 500 e 6.000 ml.')
      state.profile.waterGoal = Math.round(goal)
      if (save()) {
        refresh()
        toast('Meta de água atualizada.')
      }
      return
    }
    if (event.target.matches('[data-measure-form]')) {
      event.preventDefault()
      const data = new FormData(event.target)
      const entry = { id: uid(), date: String(data.get('date') || day()) }
      MEASURES.forEach(([key]) => {
        const value = Number(String(data.get(key) || '').replace(',', '.'))
        if (value) entry[key] = value
      })
      const error = document.querySelector('#measure-error')
      if (!MEASURES.some(([key]) => entry[key])) return (error.textContent = 'Preencha pelo menos uma medida.')
      if (MEASURES.some(([key]) => entry[key] && (entry[key] < 10 || entry[key] > 250))) return (error.textContent = 'Use valores entre 10 e 250 cm.')
      if (entry.date > day()) return (error.textContent = 'A data não pode estar no futuro.')
      state.measures = [...measures().filter((item) => item.date !== entry.date), entry]
      if (save()) {
        refresh()
        toast('Medidas salvas.')
      }
    }
  })

  ForjaHooks.afterRender(decorate)
  window.ForjaHabitos = Object.freeze({ streaks, achievements })
})()
