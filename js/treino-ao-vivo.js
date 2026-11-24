'use strict';

// Modo treino ao vivo: abre um treino montado, registra série por série
// e controla o descanso com cronômetro, som e vibração.
(() => {
  const SESSION_NAME = 'forja-treino-ao-vivo'
  const REST_OPTIONS = [45, 60, 90, 120, 180]
  let session = null
  let restTimer = null
  let clockTimer = null
  let audioContext = null

  const storageKey = () => ForjaHooks.scopedKey(SESSION_NAME)
  const persist = () => (session ? ForjaStorage.writeJSON(storageKey(), session) : ForjaStorage.remove(storageKey()))
  const loadSaved = () => ForjaStorage.readJSON(storageKey())

  function lastExecution(exerciseId) {
    return state.executions
      .filter((entry) => entry.exerciseId === exerciseId)
      .sort((first, second) => second.date.localeCompare(first.date) || second.created - first.created)[0]
  }

  function buildSession(workout) {
    const exercises = workout.exerciseIds
      .map((id) => state.exercises.find((exercise) => exercise.id === id))
      .filter(Boolean)
      .map((exercise) => {
        const last = lastExecution(exercise.id)
        if (exercise.type === 'cardio') {
          return { id: exercise.id, name: exercise.name, type: 'cardio', distance: last?.distance || '', minutes: last?.minutes || '', done: false }
        }
        const count = Math.min(Math.max(Number(last?.sets) || 3, 1), 8)
        return {
          id: exercise.id,
          name: exercise.name,
          type: 'strength',
          sets: Array.from({ length: count }, () => ({ reps: last?.reps || 10, load: last?.load ?? '', done: false })),
        }
      })
    return { workoutId: workout.id, workoutName: workout.name, startedAt: Date.now(), rest: 90, restEndsAt: 0, exercises }
  }

  function ensureDialog() {
    let dialog = document.querySelector('#live-workout')
    if (dialog) return dialog
    dialog = document.createElement('dialog')
    dialog.id = 'live-workout'
    dialog.className = 'live-workout'
    dialog.setAttribute('aria-labelledby', 'live-workout-title')
    document.body.appendChild(dialog)
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault()
      minimize()
    })
    dialog.addEventListener('click', onDialogClick)
    dialog.addEventListener('change', onDialogInput)
    return dialog
  }

  function elapsedLabel() {
    const seconds = Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000))
    const minutes = Math.floor(seconds / 60)
    return String(minutes).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
  }

  function restRemaining() {
    return Math.max(0, Math.ceil((session.restEndsAt - Date.now()) / 1000))
  }

  function exerciseMarkup(exercise, index) {
    if (exercise.type === 'cardio') {
      return '<section class="live-exercise' + (exercise.done ? ' is-done' : '') + '"><h3>' + esc(exercise.name) + '</h3>'
        + '<div class="live-cardio">'
        + '<label>Distância (km)<input type="number" min="0.1" max="200" step="any" inputmode="decimal" data-live-field="distance" data-exercise="' + index + '" value="' + esc(exercise.distance) + '"></label>'
        + '<label>Minutos<input type="number" min="1" max="600" step="1" inputmode="numeric" data-live-field="minutes" data-exercise="' + index + '" value="' + esc(exercise.minutes) + '"></label>'
        + '<button class="live-check" type="button" data-live-cardio="' + index + '" aria-pressed="' + exercise.done + '" aria-label="Marcar ' + esc(exercise.name) + ' como concluído">' + (exercise.done ? '✓' : '') + '</button>'
        + '</div></section>'
    }
    const doneCount = exercise.sets.filter((set) => set.done).length
    return '<section class="live-exercise' + (doneCount === exercise.sets.length ? ' is-done' : '') + '">'
      + '<div class="live-exercise-head"><h3>' + esc(exercise.name) + '</h3><span class="tag">' + doneCount + '/' + exercise.sets.length + ' SÉRIES</span></div>'
      + '<div class="live-sets" role="table" aria-label="Séries de ' + esc(exercise.name) + '">'
      + '<div class="live-set live-set-head" role="row"><span role="columnheader">Série</span><span role="columnheader">Reps</span><span role="columnheader">Carga (kg)</span><span role="columnheader">Feita</span></div>'
      + exercise.sets.map((set, setIndex) => '<div class="live-set' + (set.done ? ' is-done' : '') + '" role="row">'
        + '<span role="cell">' + (setIndex + 1) + '</span>'
        + '<span role="cell"><input type="number" min="1" max="100" step="1" inputmode="numeric" aria-label="Repetições da série ' + (setIndex + 1) + '" data-live-field="reps" data-exercise="' + index + '" data-set="' + setIndex + '" value="' + esc(set.reps) + '"></span>'
        + '<span role="cell"><input type="number" min="0" max="1000" step="any" inputmode="decimal" aria-label="Carga da série ' + (setIndex + 1) + '" data-live-field="load" data-exercise="' + index + '" data-set="' + setIndex + '" value="' + esc(set.load) + '"></span>'
        + '<span role="cell"><button class="live-check" type="button" data-live-set="' + index + ':' + setIndex + '" aria-pressed="' + set.done + '" aria-label="Concluir série ' + (setIndex + 1) + '">' + (set.done ? '✓' : '') + '</button></span>'
        + '</div>').join('')
      + '</div><button class="delete live-add-set" type="button" data-live-add-set="' + index + '">+ Série</button></section>'
  }

  function draw() {
    const dialog = ensureDialog()
    const rest = restRemaining()
    dialog.innerHTML = '<div class="modal-top"><p class="eyebrow orange">TREINO AO VIVO</p><button class="icon-button" type="button" data-live-minimize aria-label="Minimizar treino">–</button></div>'
      + '<h2 id="live-workout-title">' + esc(session.workoutName) + '</h2>'
      + '<div class="live-status"><span>Tempo de treino <strong data-live-clock>' + elapsedLabel() + '</strong></span>'
      + '<label>Descanso <select data-live-rest>' + REST_OPTIONS.map((seconds) => '<option value="' + seconds + '"' + (seconds === session.rest ? ' selected' : '') + '>' + (seconds < 60 ? seconds + ' s' : (seconds / 60).toLocaleString('pt-BR') + ' min') + '</option>').join('') + '</select></label></div>'
      + '<div class="live-rest' + (rest ? ' is-active' : '') + '" role="timer" aria-live="polite"><span>Descanso</span><strong data-live-rest-left>' + rest + ' s</strong><button class="button secondary small" type="button" data-live-rest-add>+15 s</button><button class="button secondary small" type="button" data-live-rest-skip>Pular</button></div>'
      + session.exercises.map(exerciseMarkup).join('')
      + '<p class="error" id="live-error" role="alert"></p>'
      + '<div class="actions"><button class="button" type="button" data-live-finish>Finalizar e salvar</button><button class="button secondary" type="button" data-live-cancel>Descartar treino</button></div>'
    if (!dialog.open) dialog.showModal()
  }

  function tick() {
    if (!session) return
    const clock = document.querySelector('[data-live-clock]')
    if (clock) clock.textContent = elapsedLabel()
    const banner = document.querySelector('[data-live-banner-clock]')
    if (banner) banner.textContent = elapsedLabel()
    const left = restRemaining()
    const restBox = document.querySelector('.live-rest')
    if (restBox) {
      restBox.classList.toggle('is-active', left > 0)
      restBox.querySelector('[data-live-rest-left]').textContent = left + ' s'
    }
    if (session.restEndsAt && left === 0) {
      session.restEndsAt = 0
      persist()
      alertRestOver()
    }
  }

  function alertRestOver() {
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.frequency.value = 880
      gain.gain.setValueAtTime(0.18, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6)
      oscillator.connect(gain).connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.6)
    } catch { /* som indisponível */ }
    if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    toast('Descanso concluído. Próxima série!')
  }

  function startClock() {
    clearInterval(clockTimer)
    clockTimer = setInterval(tick, 500)
  }

  function start(workoutId) {
    const saved = loadSaved()
    if (saved && saved.workoutId !== workoutId && !confirm('Já existe um treino em andamento. Descartar e começar este?')) return resume()
    const workout = state.workouts.find((item) => item.id === workoutId)
    if (!workout) return
    session = saved && saved.workoutId === workoutId ? saved : buildSession(workout)
    if (!session.exercises.length) {
      session = null
      return toast('Este treino não tem exercícios ativos.')
    }
    persist()
    draw()
    startClock()
  }

  function resume() {
    session = loadSaved()
    if (!session) return
    draw()
    startClock()
  }

  function minimize() {
    document.querySelector('#live-workout')?.close()
    decorate()
  }

  function close() {
    clearInterval(clockTimer)
    session = null
    persist()
    document.querySelector('#live-workout')?.close()
    decorate()
  }

  function finish() {
    const minutes = Math.max(1, Math.round((Date.now() - session.startedAt) / 60000))
    const today = ForjaHooks.dateKey()
    const entries = []
    session.exercises.forEach((exercise, index) => {
      if (exercise.type === 'cardio') {
        const distance = Number(String(exercise.distance).replace(',', '.'))
        const exerciseMinutes = Number(exercise.minutes)
        if (!exercise.done) return
        if (!(distance > 0) || !(exerciseMinutes > 0)) throw Error('Informe distância e minutos de ' + exercise.name + '.')
        entries.push({ id: uid(), exerciseId: exercise.id, name: exercise.name, type: 'cardio', date: today, created: Date.now() + index, minutes: exerciseMinutes, distance })
        return
      }
      const done = exercise.sets.filter((set) => set.done)
      if (!done.length) return
      const reps = done.map((set) => Number(set.reps))
      const loads = done.map((set) => Number(String(set.load).replace(',', '.')) || 0)
      if (reps.some((value) => !(value > 0))) throw Error('Confira as repetições de ' + exercise.name + '.')
      entries.push({
        id: uid(), exerciseId: exercise.id, name: exercise.name, type: 'strength', date: today, created: Date.now() + index,
        minutes: Math.max(1, Math.round(minutes / session.exercises.length)),
        sets: done.length, reps: Math.round(reps.reduce((sum, value) => sum + value, 0) / reps.length), load: Math.max(...loads),
      })
    })
    if (!entries.length) throw Error('Marque pelo menos uma série ou exercício como feito.')
    state.executions.push(...entries)
    if (save()) {
      close()
      render()
      toast('Treino salvo: ' + entries.length + (entries.length === 1 ? ' exercício registrado.' : ' exercícios registrados.'))
    }
  }

  function onDialogClick(event) {
    const target = event.target
    if (target.closest('[data-live-minimize]')) return minimize()
    if (target.closest('[data-live-rest-add]')) {
      session.restEndsAt = Math.max(session.restEndsAt, Date.now()) + 15000
      persist()
      return tick()
    }
    if (target.closest('[data-live-rest-skip]')) {
      session.restEndsAt = 0
      persist()
      return tick()
    }
    const setButton = target.closest('[data-live-set]')
    if (setButton) {
      const [exerciseIndex, setIndex] = setButton.dataset.liveSet.split(':').map(Number)
      const set = session.exercises[exerciseIndex].sets[setIndex]
      set.done = !set.done
      if (set.done) session.restEndsAt = Date.now() + session.rest * 1000
      persist()
      return draw()
    }
    const cardioButton = target.closest('[data-live-cardio]')
    if (cardioButton) {
      const exercise = session.exercises[Number(cardioButton.dataset.liveCardio)]
      exercise.done = !exercise.done
      persist()
      return draw()
    }
    const addSet = target.closest('[data-live-add-set]')
    if (addSet) {
      const exercise = session.exercises[Number(addSet.dataset.liveAddSet)]
      if (exercise.sets.length >= 12) return toast('Limite de 12 séries por exercício.')
      const last = exercise.sets.at(-1)
      exercise.sets.push({ reps: last?.reps || 10, load: last?.load ?? '', done: false })
      persist()
      return draw()
    }
    if (target.closest('[data-live-finish]')) {
      try {
        finish()
      } catch (error) {
        document.querySelector('#live-error').textContent = error.message
      }
      return
    }
    if (target.closest('[data-live-cancel]')) {
      const anyDone = session.exercises.some((exercise) => exercise.done || exercise.sets?.some((set) => set.done))
      if (!anyDone || confirm('Descartar este treino? As séries marcadas não serão salvas.')) close()
    }
  }

  function onDialogInput(event) {
    const target = event.target
    if (target.matches('[data-live-rest]')) {
      session.rest = Number(target.value)
      return persist()
    }
    if (!target.matches('[data-live-field]')) return
    const exercise = session.exercises[Number(target.dataset.exercise)]
    const field = target.dataset.liveField
    if (exercise.type === 'cardio') exercise[field] = target.value
    else exercise.sets[Number(target.dataset.set)][field] = target.value
    persist()
  }

  function decorate() {
    document.querySelectorAll('[data-remove^="workouts:"]').forEach((removeButton) => {
      const actions = removeButton.parentElement
      if (actions.querySelector('[data-live-start]')) return
      const workoutId = removeButton.dataset.remove.split(':')[1]
      const startButton = document.createElement('button')
      startButton.className = 'button small'
      startButton.type = 'button'
      startButton.dataset.liveStart = workoutId
      startButton.textContent = 'Iniciar treino'
      actions.prepend(startButton)
    })
    const saved = ForjaHooks.isSignedIn() ? loadSaved() : null
    let banner = document.querySelector('.live-banner')
    if (!saved || document.querySelector('#live-workout')?.open) {
      banner?.remove()
      return
    }
    if (!banner) {
      banner = document.createElement('button')
      banner.type = 'button'
      banner.className = 'live-banner'
      banner.dataset.liveResume = ''
      document.body.appendChild(banner)
    }
    session = session || saved
    banner.innerHTML = '<span>Treino em andamento: <strong>' + esc(saved.workoutName) + '</strong></span><span data-live-banner-clock>' + elapsedLabel() + '</span><span class="live-banner-action">Continuar</span>'
    startClock()
  }

  document.addEventListener('click', (event) => {
    const startButton = event.target.closest('[data-live-start]')
    if (startButton) return start(startButton.dataset.liveStart)
    if (event.target.closest('[data-live-resume]')) resume()
  })

  ForjaHooks.afterRender(decorate)
})()
