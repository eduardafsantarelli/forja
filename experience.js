'use strict';

(() => {
  let PREFERENCES_KEY = ForjaStorage.keys.preferences
  const DAYS = [
    ['segunda', 'Segunda'],
    ['terca', 'Terça'],
    ['quarta', 'Quarta'],
    ['quinta', 'Quinta'],
    ['sexta', 'Sexta'],
    ['sabado', 'Sábado'],
    ['domingo', 'Domingo'],
  ]
  const REST_DAY = 'rest'
  const DEFAULT_PLAN = Object.fromEntries(DAYS.map(([key]) => [key, REST_DAY]))
  const WEEKDAYS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  const DAILY_GOALS = [
    ['movement', 'Fazer o treino ou atividade planejada'],
    ['nutrition', 'Registrar as refeições do dia'],
    ['recovery', 'Reservar um tempo para recuperação'],
  ]

  let preferences = loadPreferences()
  let authMode = 'login'
  let firebaseUser = null
  let authReady = false
  let authLoadError = ''
  let activeUid = null

  state.dailyGoals = state.dailyGoals || {}
  applyTheme()
  let muscleView = 'front'
  let selectedMuscle = 'peito'

  function trackFirebaseEvent(eventName) {
    if (typeof window.forjaTrackAnalytics === 'function') {
      window.forjaTrackAnalytics(eventName)
      return
    }

    window.forjaAnalyticsQueue = window.forjaAnalyticsQueue || []
    window.forjaAnalyticsQueue.push(eventName)
  }

  function loadPreferences() {
    try {
      const stored = ForjaStorage.readJSON(PREFERENCES_KEY)
      const savedPlan = stored?.weekPlan || {}
      return {
        avatar: typeof stored?.avatar === 'string' && stored.avatar.startsWith('data:image/jpegbase64,')
          ? stored.avatar
          : '',
        theme: stored?.theme === 'light' ? 'light' : 'dark',
        weekPlan: Object.fromEntries(DAYS.map(([day]) => {
          const workoutId = savedPlan[day]
          const isSavedWorkout = state.workouts.some((workout) => workout.id === workoutId)
          return [day, workoutId === REST_DAY || isSavedWorkout ? workoutId : REST_DAY]
        })),
      }
    } catch {
      return { avatar: '', theme: 'dark', weekPlan: { ...DEFAULT_PLAN } }
    }
  }

  function applyTheme() {
    document.documentElement.dataset.theme = preferences.theme
    const toggle = $('[data-theme-toggle]')
    if (toggle) {
      const light = preferences.theme === 'light'
      toggle.setAttribute('aria-pressed', String(light))
      toggle.setAttribute('aria-label', `Alternar para o modo ${light ? 'escuro' : 'claro'}`)
      toggle.title = `Alternar para o modo ${light ? 'escuro' : 'claro'}`
    }
  }

  function bmiFor(profile) {
    const weight = Number(profile.weight)
    const height = Number(profile.height) / 100
    if (!(weight > 0) || !(height > 0)) return null
    const value = weight / (height * height)
    const classification = value < 18.5
      ? 'Abaixo do peso'
      : value < 25
        ? 'Peso normal'
        : value < 30
          ? 'Sobrepeso'
          : 'Obesidade'
    return { value: Math.round(value * 10) / 10, classification }
  }

  function profileIsComplete(profile = state.profile) {
    return Boolean(
      String(profile.name || '').trim()
      && Number(profile.weight) > 0
      && Number(profile.height) > 0
      && Number(profile.age) > 0
      && profile.activityLevel,
    )
  }

  function dailyGoalsMarkup() {
    const completedGoals = state.dailyGoals[today()] || {}
    const completedCount = DAILY_GOALS.filter(([id]) => completedGoals[id]).length
    return `<section class="panel daily-goals" aria-labelledby="daily-goals-title">
      <div class="panel-head"><div><p class="eyebrow orange">PEQUENOS PASSOS</p><h3 id="daily-goals-title">Metas de hoje</h3></div><span class="tag">${completedCount}/${DAILY_GOALS.length} CONCLUÍDAS</span></div>
      <div class="daily-goal-list">${DAILY_GOALS.map(([id, label]) => {
        const completed = Boolean(completedGoals[id])
        return `<button class="daily-goal ${completed ? 'is-complete' : ''}" type="button" role="checkbox" aria-checked="${completed}" data-daily-goal="${id}"><span class="daily-goal-check" aria-hidden="true">${completed ? '✓' : ''}</span><span>${label}</span></button>`
      }).join('')}</div>
    </section>`
  }

  function bmiCard() {
    const bmi = bmiFor(state.profile)
    return `<article class="stat bmi-stat reveal"><span class="label">ÍNDICE DE MASSA CORPORAL</span><strong>${bmi ? bmi.value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—'} <span>IMC</span></strong><small>${bmi ? bmi.classification : 'Complete peso e altura no perfil'}</small><div class="bmi-disclaimer">Referência informativa, não é diagnóstico clínico.</div></article>`
  }

  function savePreferences() {
    try {
      if (ForjaStorage.writeJSON(PREFERENCES_KEY, preferences)) return true
      toast('Não foi possível salvar essa alteração neste navegador.')
      return false
    } catch {
      toast('Não foi possível salvar essa alteração neste navegador.')
      return false
    }
  }

  function currentAccount() {
    return firebaseUser
  }

  function isSignedIn() {
    return authReady && Boolean(firebaseUser)
  }

  function activateAccount(user) {
    const userId = user?.uid || null
    firebaseUser = user
    authReady = true
    if (activeUid === userId) return

    activeUid = userId
    window.forjaSetUserScope(userId)
    PREFERENCES_KEY = userId
      ? `${ForjaStorage.keys.preferences}:${userId}`
      : ForjaStorage.keys.preferences
    preferences = loadPreferences()
    state.dailyGoals = state.dailyGoals || {}

    if (user && !state.profile.name) {
      state.profile.name = user.displayName || user.email?.split('@')[0] || ''
      if (state.profile.name) save()
    }

    applyTheme()
  }

  function updateAccountButton() {
    const trigger = $('#auth-trigger')
    const avatar = $('#header-avatar')
    const account = currentAccount()

    if (trigger) {
      trigger.textContent = !authReady ? 'Conectando...' : isSignedIn() ? 'Sair da conta' : 'Entrar / criar conta'
      trigger.setAttribute('aria-label', trigger.textContent)
      trigger.disabled = !authReady
    }

    if (avatar) {
      if (preferences.avatar) {
        avatar.innerHTML = `<img src="${preferences.avatar}" alt="">`
      } else {
        avatar.textContent = (state.profile.name || account?.displayName || account?.email || 'F').trim().charAt(0).toUpperCase()
      }
    }
  }

  function weekPlan() {
    return `<section class="panel week-plan" aria-labelledby="week-plan-title">
      <div class="panel-head">
        <div><p class="eyebrow orange">ORGANIZE SUA ROTINA</p><h2 id="week-plan-title">Minha agenda semanal</h2></div>
        <span class="tag">PLANO EDITÁVEL</span>
      </div>
      <p class="help">Escolha em quais dias fazer cada treino cadastrado por você. A sugestão automática é criada separadamente no gerador abaixo.</p>
      ${!state.workouts.length ? `<div class="week-plan-empty"><p>Para montar sua semana, comece cadastrando exercícios e depois crie um treino.</p><div class="actions"><button class="button secondary small" type="button" data-action="exercise">+ Exercício</button><button class="button small" type="button" data-action="workout">+ Treino</button></div></div>` : ''}
      <div class="week-plan-grid">${DAYS.map(([key, label]) => {
        const workoutId = preferences.weekPlan[key] || REST_DAY
        const selectedWorkout = state.workouts.find((workout) => workout.id === workoutId)
        const plannedExercises = selectedWorkout
          ? selectedWorkout.exerciseIds.map((id) => state.exercises.find((exercise) => exercise.id === id)).filter(Boolean)
          : []

        return `<div class="week-plan-day">
          <label for="plan-${key}">${label}</label>
          <select id="plan-${key}" data-plan-day="${key}" aria-label="Treino de ${label}">
            <option value="${REST_DAY}" ${workoutId === REST_DAY || !selectedWorkout ? 'selected' : ''}>Descanso</option>
            ${state.workouts.map((workout) => `<option value="${workout.id}" ${workoutId === workout.id ? 'selected' : ''}>${esc(workout.name)}</option>`).join('')}
          </select>
          <div class="week-plan-assignment" aria-live="polite">
            ${selectedWorkout ? `<strong>${esc(selectedWorkout.name)}</strong><ul>${plannedExercises.map((exercise) => `<li>${esc(exercise.name)}</li>`).join('') || '<li>Nenhum exercício neste treino.</li>'}</ul>` : '<span>Dia livre</span>'}
          </div>
        </div>`
      }).join('')}</div>
    </section>`
  }

  function homePage() {
    const name = state.profile.name ? `, ${esc(state.profile.name)}` : ''

    return `<section class="hero reveal">
      <div class="hero-photo" role="img" aria-label="Pessoa se preparando para treinar em uma academia"></div>
      <div class="hero-content">
        <p class="eyebrow orange">UM PASSO DE CADA VEZ</p>
        <h1>SEU TREINO.<br>SUA ROTINA.<br><span class="orange">SEU RITMO.</span></h1>
        <p>Bem-vindo${name}. Acompanhe seus treinos, refeições e evolução em um só lugar.</p>
      </div>
    </section>
    <div class="section-head">
      <div><p class="eyebrow">SEU PONTO DE PARTIDA</p><h2>Resumo de hoje</h2></div>
      <span class="date-pill">${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</span>
    </div>
    ${stats()}
    <div class="dashboard-highlights">${bmiCard()}${dailyGoalsMarkup()}</div>
    <section class="panel beginner-guide">
      <p class="eyebrow orange">POR ONDE COMEÇAR</p>
      <h3>Três passos simples</h3>
      <ol><li>Preencha seu perfil e suas metas.</li><li>Cadastre exercícios e monte sua semana.</li><li>Registre refeições e peso para acompanhar tendências.</li></ol>
      <a class="button secondary" href="#perfil">Abrir meu perfil</a>
    </section>`
  }

  function renderTraining() {
    let generatorMarkup = training().replace(
      'Use os dados do perfil para montar uma rotina baseada em nível, objetivo, disponibilidade e fase do atleta, sem prescrever cargas perigosas.',
      'A sugestão usa seu nível, objetivo e dias disponíveis. Revise os exercícios antes de começar e peça orientação ao profissional da academia se tiver dúvidas.',
    ).replace(
      '<button class="button secondary" data-action="generate-plan">Gerar treino inteligente</button>',
      '',
    ).replace(
      '<div class="actions"><button class="button" data-action="generate-plan">Gerar treino</button></div>',
      `<div class="actions"><button class="button" type="button" data-action="generate-plan">Gerar plano de treino</button>${state.generatedPlan ? '<button class="button secondary" type="button" data-action="clear-smart-plan">Apagar plano de treino</button>' : ''}</div>`,
    )
    generatorMarkup = generatorMarkup.replace(
      /<section class="panel scroll-reveal"><div class="panel-head"><h3>Volume de força<\/h3>[\s\S]*?<\/section>/,
      '',
    )
    const exerciseCatalog = `<section class="panel exercise-catalog" id="training-exercises" aria-labelledby="exercise-catalog-title">
      <div class="panel-head"><div><p class="eyebrow orange">SUA BIBLIOTECA</p><h3 id="exercise-catalog-title">Exercícios</h3></div><div class="actions"><span class="tag">${state.exercises.length} ${state.exercises.length === 1 ? 'EXERCÍCIO' : 'EXERCÍCIOS'}</span><button class="button secondary small" type="button" data-action="exercise">+ Exercício</button></div></div>
      <div class="exercise-list">${state.exercises.map((exercise) => `<article class="exercise-entry">
        <div><strong>${esc(exercise.name)}</strong><small>${esc(exercise.group)} · ${exercise.type === 'cardio' ? 'Cardio' : 'Força'}</small></div>
        <button class="delete" data-remove="exercises:${exercise.id}">Excluir</button>
      </article>`).join('') || empty('Ainda não há exercícios cadastrados. Use “+ Exercício” para adicionar o primeiro.')}</div>
    </section>`
    generatorMarkup = generatorMarkup
      .replace(
        '<div class="section-head"><h2>Seus treinos</h2></div>',
        '<div class="section-head" id="training-routines"><div><p class="eyebrow orange">SUA ROTINA</p><h2>Treinos montados por você</h2></div><button class="button small" type="button" data-action="workout">+ Treino</button></div>',
      )
      .replace(
        '<section class="panel generator-panel">',
        `${muscleExplorer()}${weekPlan()}<section class="panel generator-panel">`,
      )
      .replace(
        '<div class="columns"><section class="panel scroll-reveal"><div class="panel-head"><h3>Volume de força</h3>',
        `${exerciseCatalog}<div class="columns"><section class="panel scroll-reveal"><div class="panel-head"><h3>Volume de força</h3>`,
      )
    const profileIsIncomplete = !state.profile.name || !Number(state.profile.age) || !Number(state.profile.height) || !Number(state.profile.daysAvailable)
    const profileReminder = profileIsIncomplete
      ? `<section class="notice training-profile-reminder"><span>Para gerar o treino, complete no perfil seu nome, idade, altura e dias disponíveis por semana.</span><a href="#perfil">Completar perfil</a></section>`
      : ''

    return profileReminder + `<div class="training-page">${generatorMarkup}</div>`
  }

  const MUSCLE_LABELS = {
    peito: 'Peito', ombros: 'Ombros', biceps: 'Bíceps', triceps: 'Tríceps',
    costas: 'Costas', core: 'Abdômen', gluteos: 'Glúteos', quadriceps: 'Quadríceps',
    posteriores: 'Posteriores de coxa', panturrilhas: 'Panturrilhas',
  }

  function muscleRegion(group, paths) {
    return `<g class="muscle-region ${selectedMuscle === group ? 'is-selected' : ''}" data-muscle="${group}" role="button" tabindex="0" aria-label="Selecionar ${MUSCLE_LABELS[group]}" aria-pressed="${selectedMuscle === group}">${paths.map((path) => `<path d="${path}"/>`).join('')}</g>`
  }

  function muscleFigure(view) {
    const body = `<circle class="body-base" cx="180" cy="46" r="25"/><path class="body-base" d="M163 76 Q180 69 197 76 L202 99 Q225 102 239 119 L229 232 Q216 254 202 263 L158 263 Q144 254 131 232 L121 119 Q135 102 158 99Z M124 111 Q109 110 103 128 L78 225 Q74 239 84 243 Q94 246 100 232 L135 151Z M236 111 Q251 110 257 128 L282 225 Q286 239 276 243 Q266 246 260 232 L225 151Z M158 254 Q180 264 202 254 L208 283 L152 283Z M153 278 Q138 290 139 313 L144 405 Q147 423 160 421 Q171 419 169 401 L174 319 L180 290 L186 319 L191 401 Q189 419 200 421 Q213 423 216 405 L221 313 Q222 290 207 278Z M145 411 Q137 426 139 449 L145 523 Q148 538 158 535 Q168 533 166 517 L166 452 L174 420Z M194 420 L202 452 L202 517 Q200 533 210 535 Q220 538 223 523 L229 449 Q231 426 215 411Z M145 531 L166 531 L166 550 Q158 559 139 556 Q133 554 138 546Z M202 531 L223 531 L230 546 Q235 554 229 556 Q210 559 202 550Z"/>`
    const regions = view === 'front'
      ? muscleRegion('ombros', ['M126 107 Q138 97 153 108 L150 130 Q139 142 126 130Z', 'M234 107 Q222 97 207 108 L210 130 Q221 142 234 130Z'])
        + muscleRegion('peito', ['M151 119 Q164 111 178 119 L178 157 Q164 160 150 149Z', 'M182 119 Q196 111 210 119 L211 149 Q197 160 182 157Z'])
        + muscleRegion('biceps', ['M105 137 Q112 124 124 130 L113 179 Q108 188 101 182Z', 'M255 137 Q248 124 236 130 L247 179 Q252 188 259 182Z'])
        + muscleRegion('triceps', ['M89 183 Q95 182 101 188 L94 222 Q89 231 83 225Z', 'M271 183 Q265 182 259 188 L266 222 Q271 231 277 225Z'])
        + muscleRegion('core', ['M158 163 Q180 168 202 163 L199 235 Q180 244 161 235Z'])
        + muscleRegion('quadriceps', ['M147 292 Q160 287 174 297 L168 388 Q160 400 148 394Z', 'M186 297 Q200 287 213 292 L212 394 Q200 400 192 388Z'])
        + muscleRegion('panturrilhas', ['M148 427 Q157 421 169 428 L163 510 Q156 520 148 510Z', 'M191 428 Q203 421 212 427 L212 510 Q204 520 197 510Z'])
      : muscleRegion('ombros', ['M126 107 Q138 97 153 108 L150 130 Q139 142 126 130Z', 'M234 107 Q222 97 207 108 L210 130 Q221 142 234 130Z'])
        + muscleRegion('triceps', ['M105 137 Q112 124 124 130 L113 179 Q108 188 101 182Z', 'M255 137 Q248 124 236 130 L247 179 Q252 188 259 182Z'])
        + muscleRegion('costas', ['M151 116 Q165 107 178 115 L176 205 Q164 213 151 201Z', 'M182 115 Q195 107 209 116 L209 201 Q196 213 184 205Z', 'M160 205 Q180 212 200 205 L198 245 Q180 253 162 245Z'])
        + muscleRegion('gluteos', ['M153 248 Q166 240 178 249 L177 280 Q165 287 151 275Z', 'M182 249 Q194 240 207 248 L209 275 Q195 287 183 280Z'])
        + muscleRegion('posteriores', ['M147 292 Q160 287 174 297 L168 388 Q160 400 148 394Z', 'M186 297 Q200 287 213 292 L212 394 Q200 400 192 388Z'])
        + muscleRegion('panturrilhas', ['M148 427 Q157 421 169 428 L163 510 Q156 520 148 510Z', 'M191 428 Q203 421 212 428 L212 510 Q204 520 197 510Z'])
    return `<svg class="muscle-figure" viewBox="0 0 360 570" role="group" aria-label="Corpo humano interativo, vista ${view === 'front' ? 'frontal' : 'posterior'}">${body}${regions}</svg>`
  }

  function normalizedMuscleGroup(value) {
    const group = String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const aliases = {
      peito: 'peito', peitoral: 'peito', ombro: 'ombros', ombros: 'ombros',
      biceps: 'biceps', triceps: 'triceps', costas: 'costas', core: 'core', abdomen: 'core',
      gluteos: 'gluteos', quadriceps: 'quadriceps', pernas: 'quadriceps',
      posteriores: 'posteriores', panturrilha: 'panturrilhas', panturrilhas: 'panturrilhas',
    }
    if (aliases[group]) return aliases[group]
    if (group.includes('posterior') || group.includes('isquiotib')) return 'posteriores'
    if (group.includes('panturr')) return 'panturrilhas'
    if (group.includes('glute')) return 'gluteos'
    if (group.includes('quadr') || group.includes('perna')) return 'quadriceps'
    if (group.includes('abdomen') || group.includes('abdominal')) return 'core'
    if (group.includes('ombro') || group.includes('deltoide')) return 'ombros'
    if (group.includes('peito') || group.includes('peitoral')) return 'peito'
    if (group.includes('costas') || group.includes('dorsal')) return 'costas'
    if (group.includes('biceps')) return 'biceps'
    if (group.includes('triceps')) return 'triceps'
    return ''
  }

  function muscleExercises(group) {
    const curated = EXERCISE_LIBRARY.filter((exercise) => exercise.grupo === group).map((exercise) => ({
      name: exercise.nome, group, type: 'strength', instructions: exercise.instrucoes,
      equipment: exercise.equipamento, level: exercise.nivel, source: 'library',
    }))
    const saved = state.exercises.filter((exercise) => normalizedMuscleGroup(exercise.group) === group).map((exercise) => ({
      name: exercise.name, group, type: exercise.type, source: 'saved',
    }))
    const unique = new Map()
    ;[...curated, ...saved].forEach((exercise) => unique.set(exercise.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(), exercise))
    return [...unique.values()]
  }

  function muscleExplorer() {
    const exercises = muscleExercises(selectedMuscle)
    return `<section class="muscle-explorer" aria-labelledby="muscle-explorer-title">
      <div class="muscle-explorer-heading"><div><p class="eyebrow orange">EXPLORAÇÃO MUSCULAR</p><h2 id="muscle-explorer-title">Encontre seu próximo exercício<span class="orange">.</span></h2><p>Selecione uma região para explorar os movimentos relacionados.</p></div><span class="muscle-map-index">01 / 10</span></div>
      <div class="muscle-explorer-layout">
        <section class="muscle-map-panel" aria-label="Mapa muscular">
          <div class="muscle-map-toolbar"><span class="eyebrow">MAPA MUSCULAR</span><div class="muscle-view-toggle" role="group" aria-label="Vista do corpo"><button type="button" data-muscle-view="front" aria-pressed="${muscleView === 'front'}" class="${muscleView === 'front' ? 'active' : ''}">Frente</button><button type="button" data-muscle-view="back" aria-pressed="${muscleView === 'back'}" class="${muscleView === 'back' ? 'active' : ''}">Costas</button></div></div>
          <div class="muscle-figure-wrap">${muscleFigure(muscleView)}</div>
          <div class="muscle-map-caption"><span class="muscle-dot"></span><strong>${muscleView === 'front' ? 'VISTA FRONTAL' : 'VISTA POSTERIOR'}</strong><span>TOQUE EM UMA REGIÃO</span></div>
        </section>
        <section class="muscle-exercise-panel" aria-labelledby="muscle-exercises-title" aria-live="polite">
          <div class="muscle-exercise-heading"><div><p class="eyebrow orange">MÚSCULO SELECIONADO</p><h3 id="muscle-exercises-title">Exercícios para ${MUSCLE_LABELS[selectedMuscle]}</h3></div><span class="tag">${exercises.length} MOVIMENTOS</span></div>
          <div class="muscle-exercise-list">${exercises.map((exercise, index) => `<article class="muscle-exercise-row"><span class="muscle-exercise-number">${String(index + 1).padStart(2, '0')}</span><div class="muscle-exercise-info"><strong>${esc(exercise.name)}</strong><small>${esc(exercise.equipment || (exercise.type === 'cardio' ? 'Cardio' : 'Força'))}${exercise.level ? ` · ${esc(exercise.level)}` : ''}</small></div><button class="button secondary small" type="button" data-muscle-exercise="${esc(exercise.name)}">Ver execução</button></article>`).join('') || '<p class="muscle-empty">Ainda não há exercícios ligados a esta região.</p>'}</div>
          <p class="muscle-catalog-note">Catálogo de movimentos e exercícios cadastrados na sua conta.</p>
        </section>
      </div>
      <dialog class="muscle-detail-dialog" data-muscle-detail aria-labelledby="muscle-detail-title"><div class="modal-top"><p class="eyebrow orange">GUIA DE MOVIMENTO</p><button class="icon-button" type="button" data-close-muscle-detail aria-label="Fechar">×</button></div><div data-muscle-detail-content></div></dialog>
    </section>`
  }

  function showMuscleExercise(name) {
    const curated = EXERCISE_LIBRARY.find((exercise) => exercise.nome === name)
    const saved = state.exercises.find((exercise) => exercise.name === name)
    const type = saved?.type === 'cardio' ? 'Cardio' : 'Força'
    const group = MUSCLE_LABELS[normalizedMuscleGroup(saved?.group) || curated?.grupo] || 'Treino'
    const instructions = curated?.instrucoes || 'Consulte um profissional de educação física para ajustar a execução à sua experiência e às suas necessidades.'
    const detail = document.querySelector('[data-muscle-detail]')
    const content = detail?.querySelector('[data-muscle-detail-content]')
    if (!detail || !content) return
    content.innerHTML = `<h2 id="muscle-detail-title">${esc(name)}</h2><p class="muscle-detail-meta">${esc(group)} · ${type}${curated?.equipamento ? ` · ${esc(curated.equipamento)}` : ''}</p><div class="muscle-detail-instructions"><p class="eyebrow">EXECUÇÃO</p><p>${esc(instructions)}</p></div>${curated?.video ? `<div class="muscle-video"><video controls playsinline src="${esc(curated.video)}" aria-label="Demonstração de ${esc(name)}"></video></div>` : '<p class="muscle-video-unavailable">Demonstração em vídeo indisponível para este exercício.</p>'}`
    detail.showModal()
  }

  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('[data-muscle-view]')
    const region = event.target.closest('[data-muscle]')
    const exerciseButton = event.target.closest('[data-muscle-exercise]')
    if (viewButton) {
      muscleView = viewButton.dataset.muscleView
      const visibleMuscles = muscleView === 'front'
        ? ['ombros', 'peito', 'biceps', 'triceps', 'core', 'quadriceps', 'panturrilhas']
        : ['ombros', 'triceps', 'costas', 'gluteos', 'posteriores', 'panturrilhas']
      if (!visibleMuscles.includes(selectedMuscle)) selectedMuscle = muscleView === 'front' ? 'peito' : 'costas'
      render()
    } else if (region) {
      selectedMuscle = region.dataset.muscle
      render()
    } else if (exerciseButton) {
      showMuscleExercise(exerciseButton.dataset.muscleExercise)
    } else if (event.target.closest('[data-close-muscle-detail]')) {
      event.target.closest('[data-muscle-detail]').close()
    }
  })

  document.addEventListener('keydown', (event) => {
    const region = event.target.closest?.('.muscle-region')
    if (region && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      selectedMuscle = region.dataset.muscle
      render()
    }
  })

  function mealAlerts() {
    // Missing meal logs are not treated as zero-calorie days.
    const days = dates(14).filter((day) => state.meals.some((meal) => meal.date === day))
    if (!days.length) {
      return empty('Quando você registrar refeições, vamos comparar os dias acima da meta com os dias sem treino.')
    }

    return `<div class="meal-alert-list">${days.reverse().map((day) => {
      const calories = nutrition(day).calories
      const dailyReference = state.profile.calories + expenditure(day)
      const overGoal = calories > dailyReference
      const hasWorkout = state.executions.some((execution) => execution.date === day)
      const alert = overGoal && !hasWorkout
      const status = alert
        ? 'Acima da referência e sem treino registrado'
        : overGoal
          ? 'Acima da referência treino registrado'
          : hasWorkout
            ? 'Dentro da referência treino registrado'
            : 'Dentro da referência sem treino registrado'

      return `<div class="meal-alert-row ${alert ? 'is-alert' : ''}">
        <span class="meal-alert-mark" aria-hidden="true">${alert ? '!' : '✓'}</span>
        <div><strong>${fmtDate(day)}</strong><small>${status}</small></div>
        <span class="meal-alert-calories">${num(calories)} kcal</span>
      </div>`
    }).join('')}</div>`
  }

  function renderDiet() {
    const day = today()
    const weekDays = dates(7)
    const calories = weekDays.map((date) =>
      state.meals.some((meal) => meal.date === date) ? nutrition(date).calories : null,
    )
    const meals = state.meals
      .filter((meal) => meal.date === day)
      .slice()
      .sort((first, second) => first.meal.localeCompare(second.meal))
    const history = state.meals
      .slice()
      .sort((first, second) => first.date.localeCompare(second.date))
    const trainingCalories = expenditure(day)
    const dailyReference = state.profile.calories + trainingCalories

    return title(
      'ALIMENTAÇÃO SEM COMPLICAÇÃO',
      'SEU DIÁRIO DE HOJE.',
      'Cadastre alimentos uma vez e use-os para registrar suas refeições.',
      button('+ Cadastrar alimento', 'food', 'secondary') + button('+ Adicionar refeição', 'meal'),
    ) + `<section class="panel generator-panel">
      <div class="panel-head"><div><p class="eyebrow orange">ORGANIZAÇÃO ALIMENTAR</p><h3>Plano semanal inteligente</h3></div><span class="tag">PRÁTICO</span></div>
      <p class="help">A proposta considera o perfil, preferências, alergias, intolerâncias, restrições e dias de treino para criar uma sugestão semanal que sirva como base educacional.</p>
      <div class="actions"><button class="button" type="button" data-action="generate-nutrition-plan">Gerar plano alimentar</button>${state.nutritionPlan ? '<button class="button secondary" type="button" data-action="clear-nutrition-plan">Apagar plano alimentar</button>' : ''}</div>
    </section>
    ${(state.nutritionPlan ? renderNutritionPlan(state.nutritionPlan) : empty('Preencha seu perfil e gere um plano alimentar semanal para visualizar a organização das refeições.'))}
    <section class="panel diet-guide" aria-label="Como registrar alimentação">
      <h3>Como começar</h3>
      <ol><li>Cadastre um alimento com os valores do rótulo por 100 g.</li><li>Adicione a refeição e informe a quantidade consumida.</li><li>Confira o total do dia e compare com sua referência.</li></ol>
    </section>
    <p class="help">Referência do dia = meta base (${num(state.profile.calories)} kcal) + treino estimado (${num(trainingCalories)} kcal). Saldo negativo significa consumo acima da referência. O gasto é estimado, não uma medição clínica.</p>
    <div class="columns">
      <section class="panel">
        <div class="panel-head"><h3>Refeições de hoje</h3>${button('Adicionar refeição', 'meal', 'secondary small')}</div>
        ${meals.length ? mealRows(meals) : empty('Nenhuma refeição registrada hoje. Use “Adicionar refeição” para começar.')}
      </section>
      <section class="panel">
        <div class="panel-head"><h3>Calorias nos últimos 7 dias</h3></div>
        <div class="chart-caption"><span><i></i>Consumo</span><span>– – Meta diária</span></div>
        ${chart([{ values: calories }], weekDays.map(fmtDate), { goal: state.profile.calories, unit: 'kcal' })}
      </section>
    </div>
    <section class="panel meal-alert-panel">
      <div class="panel-head"><div><p class="eyebrow orange">ACOMPANHAMENTO, SEM JULGAMENTO</p><h3>Meta calórica e dias de descanso</h3></div></div>
      <p class="help">A referência soma a meta diária e a estimativa do treino. Veja se dias acima dela também ficaram sem treino registrado isso descreve os dados, sem indicar causa.</p>
      ${mealAlerts()}
    </section>
    <div class="section-head"><div><p class="eyebrow">SEU CATÁLOGO</p><h2>Alimentos cadastrados</h2></div></div>
    <div class="catalog">${state.foods.map((food) => `<article class="panel">
      <p class="eyebrow orange">VALORES POR 100 G</p><h3>${esc(food.name)}</h3>
      <p><b>${num(food.calories)} kcal</b><br>${num(food.protein)} g proteína · ${num(food.carbs)} g carboidratos · ${num(food.fat)} g gorduras</p>
      <button class="delete" data-remove="foods:${food.id}">Excluir alimento</button>
    </article>`).join('') || empty('Seu catálogo está vazio. Cadastre alimentos para adicioná-los ao diário.')}</div>
    <section class="panel meal-history"><div class="panel-head"><h3>Histórico de refeições</h3></div>
      ${history.length ? mealRows(history) : empty('Seus registros anteriores aparecerão aqui.')}
    </section>`
  }

  function mondayOf(dateString) {
    const date = new Date(`${dateString}T12:00:00`)
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
    date.setHours(12, 0, 0, 0)
    return date
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  function weeklyTrainingAndWeight() {
    const currentMonday = mondayOf(today())
    const weeks = Array.from({ length: 8 }, (_, index) => {
      const start = new Date(currentMonday)
      start.setDate(start.getDate() - (7 * (7 - index)))
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      const startKey = dateKey(start)
      const endKey = dateKey(end)
      const executions = state.executions.filter(
        (execution) => execution.date >= startKey && execution.date <= endKey && execution.type === 'strength',
      )
      const weights = state.weights
        .filter((entry) => entry.date >= startKey && entry.date <= endKey)
        .sort((first, second) => first.date.localeCompare(second.date))
      // Compare weight only when at least two weigh-ins fall in the same week.
      const change = weights.length > 1 ? weights.at(-1).weight - weights[0].weight : null
      const totalVolume = executions.reduce((total, execution) => total + volume(execution), 0)

      return { start, end, executions, weights, change, totalVolume }
    })

    return `<section class="panel weekly-report">
      <div class="panel-head"><div><p class="eyebrow orange">ÚLTIMAS 8 SEMANAS</p><h3>Treino e variação de peso</h3></div></div>
      <p class="help">Volume considera exercícios de força (séries × repetições × carga). A variação compara a primeira e a última pesagem registrada na mesma semana coincidência não significa causa.</p>
      <div class="table-scroll"><table><thead><tr><th scope="col">Semana</th><th scope="col">Sessões de força</th><th scope="col">Volume</th><th scope="col">Variação de peso</th></tr></thead>
        <tbody>${weeks.map((week) => `<tr>
          <th scope="row">${fmtDate(dateKey(week.start))} – ${fmtDate(dateKey(week.end))}</th>
          <td>${week.executions.length}</td>
          <td>${num(week.totalVolume)} kg·rep</td>
          <td>${week.change === null ? 'Precisa de 2 pesagens' : `${week.change > 0 ? '+' : ''}${num(week.change)} kg`}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>`
  }

  function renderEvolution() {
    return title(
      'ACOMPANHE SEU PROGRESSO',
      'EVOLUÇÃO COM CONTEXTO.',
      'Registre o peso com regularidade tendências são mais úteis que um valor isolado.',
      button('+ Registrar peso', 'weight'),
    ) + `<div class="columns">
      <section class="panel"><div class="panel-head"><h3>Peso corporal</h3><span class="tag">KG</span></div>${weightChart()}</section>
      <section class="panel"><div class="panel-head"><h3>Pesagens recentes</h3></div>
        ${state.weights.slice().sort((first, second) => second.date.localeCompare(first.date)).slice(0, 10).map((entry) => `<div class="row"><div><strong>${num(entry.weight)} kg</strong><small>${fmtDate(entry.date)}</small></div><button class="delete" data-remove="weights:${entry.id}">Excluir</button></div>`).join('') || empty('Registre seu peso para começar o acompanhamento.')}
      </section>
    </div>${weeklyTrainingAndWeight()}
    <section class="insight"><p class="eyebrow">TREINO E ALIMENTAÇÃO</p><h3>O que seus registros mostram</h3><p>${insight()}</p></section>`
  }

  function renderProfile() {
    const profile = state.profile
    const avatar = preferences.avatar
    const initial = (profile.name || 'F').trim().charAt(0).toUpperCase()
    const experienceOptions = [
      ['iniciante', 'Iniciante'],
      ['intermediario', 'Intermediário'],
      ['avancado', 'Avançado'],
    ].map(([value, label]) => `<option value="${value}" ${profile.experience === value ? 'selected' : ''}>${label}</option>`).join('')
    const goalOptions = [
      ['hipertrofia', 'Ganhar massa muscular'],
      ['forca', 'Aumentar força'],
      ['resistencia muscular', 'Melhorar resistência'],
      ['geral', 'Condicionamento geral'],
    ].map(([value, label]) => `<option value="${value}" ${profile.goal === value ? 'selected' : ''}>${label}</option>`).join('')
    const daysOptions = Array.from({ length: 7 }, (_, index) => index + 1)
      .map((days) => `<option value="${days}" ${Number(profile.daysAvailable) === days ? 'selected' : ''}>${days} ${days === 1 ? 'dia' : 'dias'}</option>`)
      .join('')

    const onboarding = !profileIsComplete()
    const bmi = bmiFor(profile)
    return title(onboarding ? 'PRIMEIRO ACESSO' : 'SEU ESPAÇO', onboarding ? 'VAMOS COMEÇAR.' : 'MEU PERFIL.', onboarding ? 'Complete seus dados para personalizar seu acompanhamento.' : 'Defina suas metas e personalize a sugestão de treino.') +
      `<section class="panel profile-editor">
      ${onboarding ? '<p class="onboarding-note" role="status">Seu perfil precisa destas informações antes de acessar o painel.</p>' : ''}
        <div class="profile-photo-control">
          <div id="profile-preview" class="profile-photo-preview" role="img" aria-label="Prévia da foto de perfil">
            ${avatar ? `<img src="${avatar}" alt="">` : `<span aria-hidden="true">${esc(initial)}</span>`}
          </div>
          <div><h3>Foto de perfil</h3><p class="help">Opcional. Fica salva apenas neste navegador.</p>
            <label class="button secondary profile-photo-label">Escolher foto
              <input class="visually-hidden" type="file" id="profile-photo" accept="image/png,image/jpeg,image/webp">
            </label>
            <button class="delete" type="button" data-action="remove-avatar">Remover foto</button>
          </div>
        </div>
        <form id="profile-form">
          <p class="eyebrow orange">DADOS ESSENCIAIS</p>
          ${field('name', 'Como podemos chamar você?', 'text', profile.name, 'maxlength="60" autocomplete="name"')}
          <div class="form-grid">
            ${field('weight', 'Peso atual (kg)', 'number', profile.weight || '', 'min="20" max="500" step="any"')}
            ${field('target', 'Meta de peso (kg)', 'number', profile.target || '', positive)}
          </div>
          <div class="form-grid">
            ${field('age', 'Idade', 'number', profile.age || '', 'min="1" max="120" step="1"')}
            ${field('height', 'Altura (cm)', 'number', profile.height || '', 'min="80" max="250" step="any"')}
          </div>
          <div class="form-grid">
            ${selectField('activityLevel', 'Nível de atividade', `<option value="" ${profile.activityLevel ? '' : 'selected'} disabled>Selecione</option><option value="sedentario" ${profile.activityLevel === 'sedentario' ? 'selected' : ''}>Sedentário</option><option value="leve" ${profile.activityLevel === 'leve' ? 'selected' : ''}>Leve</option><option value="moderado" ${profile.activityLevel === 'moderado' ? 'selected' : ''}>Moderado</option><option value="intenso" ${profile.activityLevel === 'intenso' ? 'selected' : ''}>Intenso</option>`)}
            <div class="bmi-preview" aria-live="polite"><span class="label">IMC ATUAL</span><strong>${bmi ? `${bmi.value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · ${bmi.classification}` : 'Calculado ao salvar peso e altura'}</strong></div>
          </div>
          ${field('calories', 'Meta diária de calorias (kcal)', 'number', profile.calories, positive)}
          <p class="help">Use a meta indicada para você. O site não calcula nem recomenda metas de saúde.</p>
          <fieldset class="training-preferences">
            <legend>Para personalizar o treino sugerido</legend>
            <p class="help">Essas três escolhas ajustam os exercícios e a divisão da semana.</p>
            <div class="form-grid">
              ${selectField('experience', 'Seu nível', experienceOptions)}
              ${selectField('goal', 'Seu objetivo', goalOptions)}
            </div>
            ${selectField('daysAvailable', 'Quantos dias pode treinar por semana?', daysOptions)}
          </fieldset>
          <fieldset class="training-preferences">
            <legend>Preferências e cuidados alimentares</legend>
            <p class="help">Use estes campos para personalizar sugestões. Eles não substituem orientação de nutricionista.</p>
            <div class="form-grid">
              ${selectField('athlete', 'Você é atleta?', `<option value="false" ${profile.athlete ? '' : 'selected'}>Não</option><option value="true" ${profile.athlete ? 'selected' : ''}>Sim</option>`)}
              ${selectField('athletePhase', 'Fase de treino', `<option value="off-season" ${profile.athletePhase === 'off-season' ? 'selected' : ''}>Rotina regular</option><option value="bulking" ${profile.athletePhase === 'bulking' ? 'selected' : ''}>Ganho de massa</option><option value="pré-competição" ${profile.athletePhase === 'pré-competição' ? 'selected' : ''}>Pré-competição</option>`)}
            </div>
            ${selectField('refeicoesPorDia', 'Refeições por dia', [3, 4, 5, 6].map((count) => `<option value="${count}" ${Number(profile.refeicoesPorDia || 4) === count ? 'selected' : ''}>${count}</option>`).join(''))}
            <div class="form-grid">
              <div class="field"><label for="f-restrictions">Restrições ou observações de saúde</label><textarea id="f-restrictions" name="restrictions" rows="2" maxlength="220">${esc(profile.restrictions || '')}</textarea></div>
              <div class="field"><label for="f-restricoesAlimentares">Restrições alimentares</label><textarea id="f-restricoesAlimentares" name="restricoesAlimentares" rows="2" maxlength="220">${esc((profile.restricoesAlimentares || []).join(', '))}</textarea></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="f-gosta">Alimentos de que gosta</label><textarea id="f-gosta" name="gosta" rows="2" maxlength="220">${esc((profile.gosta || []).join(', '))}</textarea></div>
              <div class="field"><label for="f-naoGosta">Alimentos de que não gosta</label><textarea id="f-naoGosta" name="naoGosta" rows="2" maxlength="220">${esc((profile.naoGosta || []).join(', '))}</textarea></div>
            </div>
            <div class="form-grid">
              <div class="field"><label for="f-alergias">Alergias</label><textarea id="f-alergias" name="alergias" rows="2" maxlength="220">${esc((profile.alergias || []).join(', '))}</textarea></div>
              <div class="field"><label for="f-intolerancias">Intolerâncias</label><textarea id="f-intolerancias" name="intolerancias" rows="2" maxlength="220">${esc((profile.intolerancias || []).join(', '))}</textarea></div>
            </div>
            <div class="field"><label for="f-observacoes">Outras observações</label><textarea id="f-observacoes" name="observacoes" rows="2" maxlength="220">${esc(profile.observacoes || '')}</textarea></div>
          </fieldset>
          <p class="error" id="profile-error" role="alert"></p>
          <button class="button" type="submit">${onboarding ? 'Salvar perfil e continuar' : 'Salvar meu perfil'}</button>
        </form>
      </section>
      `
  }

  function renderAbout() {
    return title('SOBRE A FORJA', 'FITNESS MAIS SIMPLES.', 'Uma rotina saudável começa com passos possíveis, informação clara e consistência.') +
      `<section class="about-mission">
        <p class="eyebrow orange">NOSSA MISSÃO</p><h2>Simplificar a rotina fitness para iniciantes.</h2>
        <p>A FORJA reúne treino, alimentação e acompanhamento de peso em uma experiência direta. Sem exigir conhecimento técnico para começar: você registra, entende seus dados e escolhe o próximo passo.</p>
      </section>
      <section class="about-values" aria-label="Valores da FORJA">
        <article><span>01</span><h3>Clareza</h3><p>Explicamos cada referência com palavras simples.</p></article>
        <article><span>02</span><h3>Consistência</h3><p>Pequenos registros ajudam a enxergar tendências ao longo do tempo.</p></article>
        <article><span>03</span><h3>Respeito</h3><p>Cada pessoa tem seu ritmo. Os dados apoiam escolhas, não julgamentos.</p></article>
      </section>
      <section class="team-photo-section" aria-labelledby="team-photo-title">
        <div class="section-head"><div><p class="eyebrow">QUEM FAZ A FORJA</p><h2 id="team-photo-title">Nossa equipe</h2></div></div>
        <figure class="team-photo">
          <img src="img/nos.jpg" alt="Equipe da FORJA reunida em frente à academia" loading="lazy">
          <figcaption>Equipe FORJA</figcaption>
        </figure>
        <p class="help about-disclaimer">A plataforma ajuda a acompanhar treino, alimentação e evolução ela não substitui orientação profissional.</p>
      </section>`
  }

  function renderExperience() {
    state.dailyGoals = state.dailyGoals || {}
    const authModal = $('#auth-modal')

    if (!authReady) {
      document.body.classList.add('auth-required')
      $('#app').innerHTML = ''
      $('#auth-title').textContent = 'Conectando ao Firebase'
      $('#auth-intro').textContent = 'Verificando sua sessão segura.'
      updateAccountButton()
      if (!authModal.open) authModal.showModal()
      return
    }

    if (!isSignedIn()) {
      document.body.classList.add('auth-required')
      if (location.hash !== '#inicio') {
        history.replaceState(null, '', `${location.pathname}${location.search}#inicio`)
      }
      $('#app').innerHTML = ''
      updateAccountButton()

      if (!authModal.open) {
        setAuthMode(authMode)
        authModal.showModal()
      } else if (!$('#auth-form').children.length) {
        setAuthMode(authMode)
      }
      if (authLoadError) {
        $('#auth-intro').textContent = 'O serviço de autenticação está indisponível.'
        $('#auth-error').textContent = authLoadError
      }
      return
    }

    if (authModal.open) authModal.close()

    document.body.classList.remove('auth-required')
    const views = {
      inicio: homePage,
      treinos: renderTraining,
      dieta: renderDiet,
      evolucao: renderEvolution,
      perfil: renderProfile,
      sobre: renderAbout,
    }
    route = location.hash.slice(1) || 'inicio'
    if (!views[route]) route = 'inicio'
    if (!profileIsComplete()) {
      route = 'perfil'
      if (location.hash !== '#perfil') history.replaceState(null, '', `${location.pathname}${location.search}#perfil`)
    }

    $('#app').innerHTML = (state.demo
      ? '<div class="notice"><span>Você está explorando dados de demonstração.</span><button data-action="reset">Começar com meus dados</button></div>'
      : '') + views[route]()

    document.querySelectorAll('nav a').forEach((link) => {
      const active = link.hash === `#${route}`
      link.classList.toggle('active', active)
      if (active) link.setAttribute('aria-current', 'page')
      else link.removeAttribute('aria-current')
    })

    observe()
    updateAccountButton()
    applyTheme()
    bindProfileForm()
  }

  function hasReachedWeightTarget(previousWeight, currentWeight, target) {
    if (!(target > 0) || !(currentWeight > 0)) return false
    if (currentWeight === target) return true
    if (!(previousWeight > 0)) return false
    return (previousWeight < target && currentWeight > target)
      || (previousWeight > target && currentWeight < target)
  }

  function showNewWeightTargetPrompt(reachedTarget, currentWeight) {
    modalAction = 'update-weight-target'
    $('#modal-title').textContent = 'Meta de peso alcançada'
    $('#modal-form').innerHTML = `<p class="goal-reached-message" role="status">Você registrou ${num(currentWeight)} kg e atingiu sua meta de ${num(reachedTarget)} kg. Quer definir uma nova meta?</p>
      ${field('newTarget', 'Nova meta de peso (kg)', 'number', '', positive)}
      <p class="help">Você também pode manter a meta atual e alterá-la depois no Perfil.</p>
      <p class="error" id="form-error" role="alert"></p>
      <div class="actions"><button class="button" type="submit">Salvar nova meta</button><button class="button secondary" type="button" id="defer-weight-target">Manter meta atual</button></div>`
    $('#modal-form').onsubmit = null
    $('#defer-weight-target').onclick = () => {
      state.profile.goalPromptedFor = String(reachedTarget)
      if (save()) {
        $('#modal').close()
        toast('Meta mantida. Você pode definir outra no Perfil.')
      }
    }
    $('#modal').showModal()
  }

  function handleWeightAndTargetSubmit(event) {
    if (event.target.id !== 'modal-form' || !['weight', 'update-weight-target'].includes(modalAction)) return

    event.preventDefault()
    event.stopImmediatePropagation()
    const formData = new FormData(event.target)

    try {
      if (modalAction === 'update-weight-target') {
        const newTarget = readNum(formData, 'newTarget')
        if (newTarget === Number(state.profile.target)) throw Error('Informe uma meta diferente da que você acabou de atingir.')
        state.profile.target = newTarget
        state.profile.goalPromptedFor = ''
        if (save()) {
          trackFirebaseEvent('weight_goal_updated')
          $('#modal').close()
          render()
          toast('Nova meta de peso salva.')
        }
        return
      }

      const weight = readNum(formData, 'weight')
      const date = readDate(formData)
      const previousWeight = state.weights
        .filter((entry) => entry.date < date)
        .sort((first, second) => first.date.localeCompare(second.date))
        .at(-1)?.weight ?? (Number(state.profile.weight) || 0)
      const target = Number(state.profile.target) || 0
      const existingIndex = state.weights.findIndex((entry) => entry.date === date)
      const entry = {
        id: existingIndex >= 0 ? state.weights[existingIndex].id : uid(),
        weight,
        date,
      }

      if (existingIndex >= 0) state.weights[existingIndex] = entry
      else state.weights.push(entry)

      const latestEntry = state.weights
        .slice()
        .sort((first, second) => first.date.localeCompare(second.date))
        .at(-1)
      state.profile.weight = latestEntry?.weight ?? weight
      const bmi = bmiFor(state.profile)
      if (bmi) {
        state.profile.bmi = bmi.value
        state.profile.bmiClassification = bmi.classification
      }

      const crossedTarget = hasReachedWeightTarget(previousWeight, weight, target)
      const shouldPrompt = latestEntry?.date === date
        && crossedTarget
        && String(state.profile.goalPromptedFor || '') !== String(target)

      if (save()) {
        if (shouldPrompt) trackFirebaseEvent('weight_goal_reached')
        $('#modal').close()
        render()
        if (shouldPrompt) showNewWeightTargetPrompt(target, weight)
        else toast('Pesagem registrada e perfil atualizado.')
      }
    } catch (error) {
      $('#form-error').textContent = error.message
    }
  }

  function bindProfileForm() {
    const form = $('#profile-form')
    if (!form) return

    form.onsubmit = (event) => {
      event.preventDefault()
      const formData = new FormData(form)
      try {
        const wasOnboarding = !profileIsComplete()
        const previousProfileWeight = Number(state.profile.weight) || 0
        const previousTarget = Number(state.profile.target) || 0
        const profile = {
          ...state.profile,
          name: String(formData.get('name')).trim(),
          weight: readNum(formData, 'weight'),
          target: readNum(formData, 'target'),
          calories: readNum(formData, 'calories'),
          age: readNum(formData, 'age'),
          height: readNum(formData, 'height'),
          activityLevel: String(formData.get('activityLevel') || ''),
          experience: String(formData.get('experience') || 'iniciante'),
          goal: String(formData.get('goal') || 'hipertrofia'),
          daysAvailable: Number(formData.get('daysAvailable')),
          athlete: String(formData.get('athlete')) === 'true',
          athletePhase: String(formData.get('athletePhase') || 'off-season'),
          refeicoesPorDia: Number(formData.get('refeicoesPorDia')),
          restrictions: String(formData.get('restrictions') || '').trim(),
          gosta: String(formData.get('gosta') || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
          naoGosta: String(formData.get('naoGosta') || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
          alergias: String(formData.get('alergias') || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
          intolerancias: String(formData.get('intolerancias') || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
          restricoesAlimentares: String(formData.get('restricoesAlimentares') || '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
          observacoes: String(formData.get('observacoes') || '').trim(),
        }
        if (!profile.name) throw Error('Informe seu nome.')
        if (profile.weight < 20 || profile.weight > 500) throw Error('Informe um peso entre 20 e 500 kg.')
        if (profile.age <= 0) throw Error('Informe uma idade válida.')
        if (profile.age > 120) throw Error('Informe uma idade válida (até 120 anos).')
        if (profile.height < 80 || profile.height > 250) throw Error('Informe uma altura entre 80 e 250 cm.')
        if (!profile.activityLevel) throw Error('Selecione seu nível de atividade.')
        if (!profile.daysAvailable || profile.daysAvailable < 1 || profile.daysAvailable > 7) {
          throw Error('Escolha de 1 a 7 dias de treino por semana.')
        }
        const targetMarker = previousTarget === profile.target
          ? String(state.profile.goalPromptedFor || '')
          : ''
        const shouldPrompt = hasReachedWeightTarget(previousProfileWeight, profile.weight, profile.target)
          && targetMarker !== String(profile.target)
        profile.goalPromptedFor = targetMarker
        const bmi = bmiFor(profile)
        profile.bmi = bmi.value
        profile.bmiClassification = bmi.classification
        if (Number(state.profile.weight) !== profile.weight || !state.weights.length) {
          const todayIndex = state.weights.findIndex((entry) => entry.date === today())
          const currentWeight = { id: todayIndex >= 0 ? state.weights[todayIndex].id : uid(), date: today(), weight: profile.weight }
          if (todayIndex >= 0) state.weights[todayIndex] = currentWeight
          else state.weights.push(currentWeight)
        }
        state.profile = profile
        if (save()) {
          if (wasOnboarding) location.hash = '#inicio'
          render()
          if (shouldPrompt) showNewWeightTargetPrompt(profile.target, profile.weight)
          else toast('Perfil atualizado.')
        }
      } catch (error) {
        $('#profile-error').textContent = error.message
      }
    }
  }

  function imageToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(Error('Não foi possível abrir essa imagem.'))
      reader.onload = () => {
        const image = new Image()
        image.onerror = () => reject(Error('Escolha um arquivo de imagem válido.'))
        image.onload = () => {
          const scale = Math.min(1, 480 / Math.max(image.width, image.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.78))
        }
        image.src = String(reader.result)
      }
      reader.readAsDataURL(file)
    })
  }

  function authErrorMessage(error) {
    const messages = {
      'auth/email-already-in-use': 'Este e-mail já tem uma conta. Entre ou use a recuperação de senha.',
      'auth/invalid-credential': 'E-mail ou senha incorretos.',
      'auth/invalid-email': 'Informe um e-mail válido.',
      'auth/weak-password': 'Use uma senha mais forte, com pelo menos 8 caracteres.',
      'auth/user-disabled': 'Esta conta foi desativada. Fale com o suporte.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
      'auth/network-request-failed': 'Sem conexão com o Firebase. Verifique a internet e tente novamente.',
      'auth/configuration-not-found': 'Firebase Authentication ainda não foi inicializado neste projeto. Abra Authentication no Firebase Console e clique em Começar.',
      'auth/operation-not-allowed': 'Ative o provedor E-mail/senha em Authentication > Sign-in method no Firebase Console.',
      'auth/unauthorized-domain': 'Este domínio não está autorizado em Authentication > Settings no Firebase Console.',
    }
    return messages[error.code] || 'Não foi possível concluir a autenticação. Tente novamente.'
  }

  function setAuthMode(mode) {
    authMode = mode
    const registering = mode === 'register'
    $('#auth-title').textContent = registering ? 'Crie sua conta FORJA' : 'Entre na sua conta FORJA'
    $('#auth-intro').textContent = registering
      ? 'Informe seu nome, e-mail e senha para criar sua conta.'
      : 'Entre com o e-mail e a senha cadastrados.'
    document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
      const active = tab.dataset.authMode === mode
      tab.classList.toggle('active', active)
      tab.setAttribute('aria-selected', String(active))
    })

    const passwordAutocomplete = registering ? 'new-password' : 'current-password'
    $('#auth-form').innerHTML = `${registering ? field('name', 'Como podemos chamar você?', 'text', '', 'maxlength="60" autocomplete="name"') : ''}
      ${field('email', 'E-mail', 'email', '', 'autocomplete="email"')}
      ${field('password', 'Senha (mínimo de 8 caracteres)', 'password', '', `minlength="8" autocomplete="${passwordAutocomplete}"`)}
      <p class="error" id="auth-error" role="alert"></p>
      <button class="button" type="submit">${registering ? 'Criar conta' : 'Entrar'}</button>
      ${registering ? '' : '<button class="auth-recovery" type="button" data-action="forgot-access">Esqueci minha senha</button>'}`

    $('#auth-form').onsubmit = handleAuthSubmit
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email')).trim().toLowerCase()
    const password = String(formData.get('password'))
    const submit = event.currentTarget.querySelector('button[type="submit"]')
    submit.disabled = true

    try {
      if (password.length < 8) throw Error('Use uma senha com pelo menos 8 caracteres.')
      const api = await window.forjaAuthReady
      if (!api) throw Error(authErrorMessage(window.forjaAuthError || {}))

      let user
      if (authMode === 'register') {
        const name = String(formData.get('name')).trim()
        if (!name) throw Error('Informe seu nome para criar o acesso.')
        const credential = await api.createUserWithEmailAndPassword(api.auth, email, password)
        user = credential.user
        await api.updateProfile(user, { displayName: name })
      } else {
        const credential = await api.signInWithEmailAndPassword(api.auth, email, password)
        user = credential.user
      }

      activateAccount(user)
      if (!state.profile.name) state.profile.name = user.displayName || email.split('@')[0]
      if (!save()) throw Error('Não foi possível salvar o perfil neste dispositivo.')
      location.hash = profileIsComplete() ? '#inicio' : '#perfil'
      $('#auth-modal').close()
      render()
      updateAccountButton()
      toast(authMode === 'register' ? 'Conta criada com sucesso.' : 'Login realizado com sucesso.')
    } catch (authError) {
      const errorElement = $('#auth-error')
      if (errorElement) errorElement.textContent = authError.code ? authErrorMessage(authError) : authError.message
    } finally {
      const currentSubmit = $('#auth-form button[type="submit"]')
      if (currentSubmit) currentSubmit.disabled = false
    }
  }

  async function openAuth() {
    if (isSignedIn()) {
      try {
        const api = await window.forjaAuthReady
        await api.signOut(api.auth)
        toast('Sessão encerrada com sucesso.')
      } catch (error) {
        toast(authErrorMessage(error))
      }
      return
    }

    if (!authReady) return
    setAuthMode('login')
    if (!$('#auth-modal').open) $('#auth-modal').showModal()
  }

  async function sendPasswordReset() {
    const email = String($('#auth-form [name="email"]')?.value || '').trim().toLowerCase()
    const errorElement = $('#auth-error')
    if (!email) {
      errorElement.textContent = 'Informe seu e-mail para receber o link de recuperação.'
      return
    }

    try {
      const api = await window.forjaAuthReady
      if (!api) throw window.forjaAuthError || Error('Firebase indisponível.')
      await api.sendPasswordResetEmail(api.auth, email)
      toast('Se a conta existir, você receberá um e-mail para redefinir a senha.')
    } catch (error) {
      errorElement.textContent = authErrorMessage(error)
    }
  }

  function connectFirebaseAuth() {
    let started = false
    const start = async () => {
      if (started) return
      started = true
      const api = await window.forjaAuthReady
      if (!api) {
        authReady = true
        authLoadError = 'Não foi possível inicializar Firebase Authentication. Verifique a configuração do projeto.'
        render()
        return
      }

      api.onAuthStateChanged(api.auth, (user) => {
        authLoadError = ''
        activateAccount(user)
        render()
      }, (error) => {
        authLoadError = authErrorMessage(error)
        activateAccount(null)
        render()
      })
    }

    if (window.forjaAuthReady) start()
    else window.addEventListener('forja-auth-ready', start, { once: true })

    setTimeout(() => {
      if (authReady || window.forjaAuthReady) return
      authReady = true
      authLoadError = 'Firebase não respondeu. Verifique sua conexão e recarregue a página.'
      render()
    }, 10000)
  }

  function onDocumentClick(event) {
    const target = event.target
    const modeTab = target.closest('[data-auth-mode]')
    if (modeTab) {
      setAuthMode(modeTab.dataset.authMode)
      return
    }

    if (target.closest('#auth-trigger')) openAuth()

    if (target.closest('[data-theme-toggle]')) {
      preferences.theme = preferences.theme === 'light' ? 'dark' : 'light'
      if (savePreferences()) {
        applyTheme()
        toast(`Modo ${preferences.theme === 'light' ? 'claro' : 'escuro'} ativado.`)
      }
      return
    }

    const dailyGoal = target.closest('[data-daily-goal]')
    if (dailyGoal) {
      const date = today()
      const goals = state.dailyGoals[date] || {}
      const goalId = dailyGoal.dataset.dailyGoal
      goals[goalId] = !goals[goalId]
      state.dailyGoals[date] = goals
      if (save()) {
        render()
        if (goals[goalId]) toast('Meta do dia concluída.')
      }
      return
    }

    if (target.closest('[data-action="clear-smart-plan"]')) {
      if (!confirm('Apagar somente a sugestão de treino inteligente? Seus exercícios, rotinas e registros de execução serão mantidos.')) return
      state.generatedPlan = null
      if (save()) {
        render()
        toast('Sugestão de treino apagada.')
      }
      return
    }

    if (target.closest('[data-action="clear-nutrition-plan"]')) {
      if (!confirm('Apagar somente o plano alimentar sugerido? Seus alimentos e refeições registradas serão mantidos.')) return
      state.nutritionPlan = null
      if (save()) {
        render()
        toast('Plano alimentar apagado.')
      }
      return
    }

    if (target.closest('[data-action="forgot-access"]')) {
      sendPasswordReset()
      return
    }

    if (target.closest('[data-action="generate-nutrition-plan"]')) {
      try {
        const plan = gerarPlanoAlimentar(state.profile, state.generatedPlan || { semana: [] })
        state.nutritionPlan = plan
        if (save()) {
          render()
          toast('Plano alimentar gerado com sucesso.')
        }
      } catch (error) {
        toast(error.message || 'Não foi possível gerar o plano alimentar.')
      }
      return
    }

    if (target.closest('[data-action="remove-avatar"]')) {
      preferences.avatar = ''
      if (savePreferences()) render()
    }
  }

  function onResetAction(event) {
    const resetButton = event.target.closest('[data-action="reset"]')
    if (!resetButton) return

    event.preventDefault()
    event.stopImmediatePropagation()
    if (!confirm('Apagar seu perfil, registros e preferências deste dispositivo? Sua conta Firebase não será excluída. Essa ação não pode ser desfeita.')) return

    state = fresh()
    state.dailyGoals = {}
    preferences = { avatar: '', theme: 'dark', weekPlan: { ...DEFAULT_PLAN } }
    savePreferences()
    if (save()) {
      render()
      toast('Dados apagados. Você pode começar novamente.')
    }
  }

  function onDocumentChange(event) {
    if (event.target.id === 'f-meal') {
      const referenceTimes = {
        'Café da manhã': '07:00',
        Almoço: '12:00',
        Lanche: '15:30',
        Jantar: '19:00',
        Ceia: '21:00',
      }
      $('#f-time').value = referenceTimes[event.target.value] || '12:00'
      return
    }

    if (event.target.id === 'f-exerciseName' || event.target.id === 'f-exerciseGroup') {
      const isExerciseName = event.target.id === 'f-exerciseName'
      const selectedValue = event.target.value
      const wrapper = $(`#custom-${isExerciseName ? 'exercise-name' : 'exercise-group'}`)
      const input = $(`#f-custom${isExerciseName ? 'ExerciseName' : 'ExerciseGroup'}`)
      const isOther = selectedValue === '__other__'

      wrapper.hidden = !isOther
      input.disabled = !isOther
      input.required = isOther
      if (!isOther) input.value = ''

      if (isExerciseName) {
        const libraryExercise = EXERCISE_LIBRARY.find((exercise) => exercise.nome === selectedValue)
        if (libraryExercise) {
          $('#f-exerciseGroup').value = libraryExercise.grupo
          $('#f-type').value = libraryExercise.grupo === 'cardio' ? 'cardio' : 'strength'
          const groupWrapper = $('#custom-exercise-group')
          const customGroupInput = $('#f-customExerciseGroup')
          groupWrapper.hidden = true
          customGroupInput.disabled = true
          customGroupInput.required = false
          customGroupInput.value = ''
        }
      }
      return
    }

    const planSelect = event.target.closest('[data-plan-day]')
    if (planSelect) {
      preferences.weekPlan[planSelect.dataset.planDay] = planSelect.value
      if (savePreferences()) {
        render()
        toast('Agenda semanal atualizada.')
      }
      return
    }

    if (event.target.id === 'profile-photo') {
      const file = event.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        toast('Escolha um arquivo de imagem.')
        return
      }
      if (file.size > 8 * 1024 * 1024) {
        toast('A imagem deve ter até 8 MB.')
        return
      }
      imageToDataUrl(file)
        .then((avatar) => {
          preferences.avatar = avatar
          if (savePreferences()) {
            render()
            toast('Foto de perfil atualizada.')
          }
        })
        .catch((error) => toast(error.message))
    }
  }

  function install() {
    render = renderExperience
    document.addEventListener('submit', handleWeightAndTargetSubmit, true)
    document.addEventListener('click', onResetAction, true)
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('change', onDocumentChange)
    $('#close-auth').addEventListener('click', () => {
      if (isSignedIn()) $('#auth-modal').close()
    })
    $('#auth-modal').addEventListener('cancel', (event) => {
      if (!isSignedIn()) event.preventDefault()
    })
    $('#auth-modal').addEventListener('click', (event) => {
      if (isSignedIn() && event.target === $('#auth-modal')) $('#auth-modal').close()
    })
    connectFirebaseAuth()
    render()
  }

  install()
})()