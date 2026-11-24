'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { loadScripts } = require('./helpers')

test('tabela TACO tem centenas de alimentos com valores válidos por 100 g', () => {
  const ctx = loadScripts(['data/taco.js'])
  const { alimentos, categorias } = ctx.FORJA_TACO
  assert.ok(alimentos.length > 500)
  alimentos.forEach(([nome, kcal, proteina, carboidrato, gordura, categoria]) => {
    assert.ok(nome.length > 2)
    assert.ok(kcal >= 0 && kcal <= 950, nome)
    assert.ok(proteina >= 0 && carboidrato >= 0 && gordura >= 0, nome)
    assert.ok(categorias[categoria], nome)
  })
})

test('todo exercício da biblioteca tem demonstração animada', () => {
  const ctx = loadScripts(['storage.js', 'app.js', 'js/animacoes.js'])
  const names = ctx.run('EXERCISE_LIBRARY.map((exercise) => exercise.nome)')
  const missing = names.filter((name) => !ctx.ForjaAnimacoes.patternFor(name))
  assert.equal(missing.length, 0, 'Sem animação: ' + missing.join(', '))
})

test('sequência de dias ativos conta dias consecutivos até hoje', () => {
  const ctx = loadScripts(['storage.js', 'app.js', 'js/hooks.js', 'js/habitos.js'])
  const day = (offset) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return ctx.ForjaHooks.dateKey(date)
  }
  ctx.run('state = fresh()')
  ctx.run('state.meals = ' + JSON.stringify([0, -1, -2, -5].map((offset) => ({ id: String(offset), date: day(offset), quantity: 100, snapshot: {} }))))
  const result = ctx.ForjaHabitos.streaks()
  assert.equal(result.current, 3)
  assert.equal(result.best, 3)
  assert.equal(result.total, 4)
})

test('conquistas são liberadas conforme os registros', () => {
  const ctx = loadScripts(['storage.js', 'app.js', 'js/hooks.js', 'js/habitos.js'])
  ctx.run('state = fresh()')
  const before = ctx.ForjaHabitos.achievements().filter((item) => item[3]).length
  ctx.run('state.executions = [{ id: "1", date: "2026-01-01", type: "strength", sets: 3, reps: 10, load: 20, minutes: 30 }]')
  const after = ctx.ForjaHabitos.achievements().filter((item) => item[3]).length
  assert.equal(before, 0)
  assert.equal(after, 1)
})
