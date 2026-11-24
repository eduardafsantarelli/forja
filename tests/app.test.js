'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { loadScripts } = require('./helpers')

const MEATS = ['Frango grelhado', 'Carne bovina', 'Peixe', 'Atum']
const plainNames = (plan) => plan.plano.flatMap((dia) => dia.refeicoes.flatMap((refeicao) => refeicao.alimentos.map((item) => item.nome)))

function newApp() {
  return loadScripts(['storage.js', 'app.js'])
}

function makePlan(app, profile = {}) {
  app.run('state = fresh()')
  const base = app.run('fresh().profile')
  return app.gerarPlanoAlimentar({ ...base, name: 'Teste', age: 25, height: 170, weight: 70, calories: 2200, refeicoesPorDia: 6, ...profile }, { semana: [] })
}

test('cardápio semanal tem 7 dias, versão 2 e nenhum alimento fora do horário', () => {
  const app = newApp()
  const plan = makePlan(app)
  assert.equal(plan.versao, 2)
  assert.equal(plan.plano.length, 7)
  assert.deepEqual([...plan.problemas], [])
  plan.plano.forEach((dia) => assert.equal(dia.refeicoes.length, 6))
})

test('almoço e jantar do mesmo dia usam proteínas diferentes', () => {
  const app = newApp()
  const plan = makePlan(app)
  const proteinas = new Set(['Frango grelhado', 'Carne bovina', 'Peixe', 'Atum', 'Ovos', 'Tofu'])
  plan.plano.forEach((dia) => {
    const pick = (nome) => dia.refeicoes.find((refeicao) => refeicao.nome === nome).alimentos.map((item) => item.nome).find((nome) => proteinas.has(nome))
    const almoco = pick('Almoço')
    const jantar = pick('Jantar')
    if (almoco && jantar) assert.notEqual(almoco, jantar, dia.dia)
  })
})

test('perfil vegetariano não recebe carnes nem peixes', () => {
  const app = newApp()
  const plan = makePlan(app, { restricoesAlimentares: ['vegetariano'] })
  assert.equal(plainNames(plan).filter((nome) => MEATS.includes(nome)).length, 0)
})

test('alimento marcado como "não gosto" e alergia ficam fora do cardápio', () => {
  const app = newApp()
  const plan = makePlan(app, { naoGosta: ['Banana'], alergias: ['Amendoim'] })
  const names = plainNames(plan)
  assert.ok(!names.includes('Banana'))
  assert.ok(!names.some((nome) => nome.toLowerCase().includes('amendoim')))
})

test('porções ficam entre 80% e 125% da porção média', () => {
  const app = newApp()
  const getMeta = app.run('getFoodMacroMeta')
  const units = app.run('MEAL_UNITS')
  const normalize = app.run('normalizeName')
  for (const calories of [1000, 6000]) {
    const plan = makePlan(app, { calories })
    plan.plano.forEach((dia) => dia.refeicoes.forEach((refeicao) => refeicao.alimentos.forEach((item) => {
      const base = getMeta(item.nome).portion
      const step = units[normalize(item.nome)]?.[0] || 10
      assert.ok(item.porcao >= base * 0.8 - step && item.porcao <= base * 1.25 + step, item.nome + ' ' + item.porcao)
    })))
  }
})

test('gerador de treino respeita os dias disponíveis', () => {
  const app = newApp()
  for (const days of [2, 3, 4, 5]) {
    app.run('state = fresh()')
    app.run('state.profile = { ...state.profile, name: "Teste", age: 25, height: 170, weight: 70, daysAvailable: ' + days + ', experience: "iniciante", goal: "hipertrofia" }')
    const plan = app.buildSmartWorkoutPlan()
    assert.equal(plan.semana.length, days)
    plan.semana.forEach((dia) => assert.ok(dia.exercicios.length > 0, dia.dia))
  }
})

test('gráfico com escala ajustada não começa em zero', () => {
  const app = newApp()
  const svg = app.chart([{ values: [70.2, 69.8, 69.1] }], ['a', 'b', 'c'], { unit: 'kg', fit: true })
  const labels = [...svg.matchAll(/<text x="30"[^>]*>(\d+)<\/text>/g)].map((match) => Number(match[1]))
  assert.ok(labels.length >= 2)
  assert.ok(Math.min(...labels) > 50)
})
