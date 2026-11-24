'use strict';

// Demonstrações animadas dos exercícios: uma figura simplificada alterna
// entre a posição inicial e a final de cada padrão de movimento.
(() => {
  const STAND = { h: [60, 17], s: [60, 31], e: [60, 47], w: [60, 62], e2: [60, 47], w2: [60, 62], p: [60, 62], k: [60, 84], f: [60, 106], k2: [60, 84], f2: [60, 106] }
  const pose = (changes) => ({ ...STAND, ...changes })
  const PATTERNS = {
    squat: { a: pose({ e: [72, 33], w: [86, 33], e2: [72, 33], w2: [86, 33] }), b: pose({ h: [55, 40], s: [55, 53], e: [68, 54], w: [82, 54], e2: [68, 54], w2: [82, 54], p: [42, 78], k: [66, 84], k2: [66, 84] }), floor: true },
    lunge: { a: pose({ k: [68, 84], f: [74, 106], k2: [52, 84], f2: [46, 106] }), b: pose({ h: [60, 33], s: [60, 47], e: [60, 63], w: [60, 78], e2: [60, 63], w2: [60, 78], p: [60, 78], k: [80, 80], f: [80, 106], k2: [50, 102], f2: [34, 106] }), floor: true },
    press: { a: pose({ h: [22, 66], s: [34, 70], e: [34, 52], w: [34, 36], e2: [34, 52], w2: [34, 36], p: [72, 72], k: [88, 78], f: [92, 104], k2: [88, 78], f2: [92, 104] }), b: pose({ h: [22, 66], s: [34, 70], e: [24, 82], w: [32, 58], e2: [24, 82], w2: [32, 58], p: [72, 72], k: [88, 78], f: [92, 104], k2: [88, 78], f2: [92, 104] }), bench: true, bar: true },
    row: { a: pose({ h: [56, 31], s: [56, 45], e: [72, 50], w: [90, 54], e2: [72, 50], w2: [90, 54], p: [56, 78], k: [82, 76], f: [100, 84], k2: [82, 76], f2: [100, 84] }), b: pose({ h: [54, 31], s: [54, 45], e: [40, 54], w: [60, 56], e2: [40, 54], w2: [60, 56], p: [56, 78], k: [82, 76], f: [100, 84], k2: [82, 76], f2: [100, 84] }), cable: [112, 56], seat: true },
    pulldown: { a: pose({ h: [58, 37], s: [58, 51], e: [62, 33], w: [64, 15], e2: [62, 33], w2: [64, 15], p: [58, 82], k: [82, 82], f: [84, 106], k2: [82, 82], f2: [84, 106] }), b: pose({ h: [58, 37], s: [58, 51], e: [52, 64], w: [64, 48], e2: [52, 64], w2: [64, 48], p: [58, 82], k: [82, 82], f: [84, 106], k2: [82, 82], f2: [84, 106] }), cable: [64, 0], seat: true },
    overhead: { a: pose({ h: [57, 17], e: [70, 34], w: [68, 18], e2: [70, 34], w2: [68, 18] }), b: pose({ h: [57, 17], e: [66, 16], w: [64, 2], e2: [66, 16], w2: [64, 2] }), floor: true },
    lateral: { a: pose({ e: [52, 46], w: [50, 60], e2: [68, 46], w2: [70, 60] }), b: pose({ e: [44, 34], w: [30, 34], e2: [76, 34], w2: [90, 34] }), floor: true },
    curl: { a: pose({ e: [62, 47], w: [64, 63], e2: [62, 47], w2: [64, 63] }), b: pose({ e: [62, 47], w: [72, 34], e2: [62, 47], w2: [72, 34] }), floor: true },
    triceps: { a: pose({ e: [64, 47], w: [74, 38], e2: [64, 47], w2: [74, 38] }), b: pose({ e: [64, 47], w: [66, 64], e2: [64, 47], w2: [66, 64] }), cable: [72, 0], floor: true },
    hinge: { a: pose({ w: [62, 62], w2: [62, 62] }), b: pose({ h: [28, 44], s: [40, 46], e: [40, 62], w: [40, 78], e2: [40, 62], w2: [40, 78], p: [66, 60], k: [64, 84], k2: [64, 84] }), floor: true, bar: true },
    bridge: { a: pose({ h: [14, 94], s: [28, 94], e: [42, 98], w: [56, 98], e2: [42, 98], w2: [56, 98], p: [60, 96], k: [78, 78], f: [90, 100], k2: [78, 78], f2: [90, 100] }), b: pose({ h: [14, 92], s: [28, 92], e: [42, 98], w: [56, 98], e2: [42, 98], w2: [56, 98], p: [60, 74], k: [80, 72], f: [90, 100], k2: [80, 72], f2: [90, 100] }), floor: true },
    crunch: { a: pose({ h: [18, 92], s: [32, 94], e: [28, 84], w: [20, 78], e2: [28, 84], w2: [20, 78], p: [64, 96], k: [80, 78], f: [96, 98], k2: [80, 78], f2: [96, 98] }), b: pose({ h: [32, 72], s: [40, 82], e: [36, 70], w: [28, 64], e2: [36, 70], w2: [28, 64], p: [64, 96], k: [80, 78], f: [96, 98], k2: [80, 78], f2: [96, 98] }), floor: true },
    legraise: { a: pose({ h: [16, 94], s: [30, 96], e: [44, 98], w: [56, 98], e2: [44, 98], w2: [56, 98], p: [64, 98], k: [84, 98], f: [104, 98], k2: [84, 98], f2: [104, 98] }), b: pose({ h: [16, 94], s: [30, 96], e: [44, 98], w: [56, 98], e2: [44, 98], w2: [56, 98], p: [64, 98], k: [74, 80], f: [82, 60], k2: [74, 80], f2: [82, 60] }), floor: true },
    plank: { a: pose({ h: [20, 70], s: [30, 76], e: [30, 96], w: [40, 98], e2: [30, 96], w2: [40, 98], p: [64, 80], k: [84, 88], f: [104, 96], k2: [84, 88], f2: [104, 96] }), b: pose({ h: [20, 68], s: [30, 74], e: [30, 96], w: [40, 98], e2: [30, 96], w2: [40, 98], p: [64, 77], k: [84, 86], f: [104, 96], k2: [84, 86], f2: [104, 96] }), floor: true },
    calf: { a: pose({}), b: pose({ h: [60, 11], s: [60, 25], e: [60, 41], w: [60, 56], e2: [60, 41], w2: [60, 56], p: [60, 56], k: [60, 78], f: [60, 100], k2: [60, 78], f2: [60, 100] }), floor: true },
    extension: { a: pose({ h: [48, 28], s: [50, 42], e: [56, 58], w: [62, 70], e2: [56, 58], w2: [62, 70], p: [56, 72], k: [80, 72], f: [82, 100], k2: [80, 72], f2: [82, 100] }), b: pose({ h: [48, 28], s: [50, 42], e: [56, 58], w: [62, 70], e2: [56, 58], w2: [62, 70], p: [56, 72], k: [80, 72], f: [104, 66], k2: [80, 72], f2: [104, 66] }), seat: true },
    legcurl: { a: pose({ h: [16, 74], s: [28, 78], e: [20, 88], w: [12, 90], e2: [20, 88], w2: [12, 90], p: [60, 80], k: [84, 80], f: [104, 82], k2: [84, 80], f2: [104, 82] }), b: pose({ h: [16, 74], s: [28, 78], e: [20, 88], w: [12, 90], e2: [20, 88], w2: [12, 90], p: [60, 80], k: [84, 80], f: [80, 56], k2: [84, 80], f2: [80, 56] }), bench: true },
    adductor: { a: pose({ p: [60, 66], k: [40, 74], f: [36, 100], k2: [80, 74], f2: [84, 100] }), b: pose({ p: [60, 66], k: [54, 76], f: [54, 100], k2: [66, 76], f2: [66, 100] }), seat: true },
    run: { a: pose({ h: [62, 17], e: [52, 44], w: [58, 56], e2: [70, 42], w2: [76, 32], k: [72, 80], f: [64, 100], k2: [50, 86], f2: [40, 104] }), b: pose({ h: [62, 17], e: [70, 42], w: [76, 32], e2: [52, 44], w2: [58, 56], k: [50, 86], f: [40, 104], k2: [72, 80], f2: [64, 100] }), floor: true },
    mobility: { a: pose({ e: [52, 22], w: [48, 6], e2: [68, 22], w2: [72, 6] }), b: pose({ h: [62, 20], e: [44, 30], w: [30, 22], e2: [76, 30], w2: [90, 22] }), floor: true },
  }
  const RULES = [
    [/búlgaro|avanço|afundo/i, 'lunge'], [/agachamento|leg press/i, 'squat'], [/extensora/i, 'extension'], [/flexora/i, 'legcurl'], [/adutora|abdutora/i, 'adductor'],
    [/terra|stiff|romeno/i, 'hinge'], [/elevação pélvica|extensão de quadril|glúteo/i, 'bridge'], [/panturrilha/i, 'calf'],
    [/supino|crucifixo|crossover|peck|flexão/i, 'press'], [/puxada|pulldown|barra fixa/i, 'pulldown'], [/remada|face pull/i, 'row'],
    [/desenvolvimento/i, 'overhead'], [/elevação lateral/i, 'lateral'], [/rosca/i, 'curl'], [/tríceps|triceps/i, 'triceps'],
    [/prancha/i, 'plank'], [/elevação de pernas/i, 'legraise'], [/abdominal/i, 'crunch'], [/corrida|bike|caminhada|bicicleta/i, 'run'], [/mobilidade/i, 'mobility'],
  ]
  const patternFor = (name) => RULES.find(([pattern]) => pattern.test(name))?.[1]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const line = (a, b, cls = 'fig-limb') => '<line class="' + cls + '" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>'

  function frame(pattern, t) {
    const p = Object.fromEntries(Object.keys(pattern.a).map((key) => [key, lerp(pattern.a[key], pattern.b[key], t)]))
    let svg = ''
    if (pattern.floor) svg += line([8, 108], [112, 108], 'fig-prop')
    if (pattern.bench) svg += line([16, 82], [96, 82], 'fig-prop') + line([24, 82], [24, 108], 'fig-prop') + line([88, 82], [88, 108], 'fig-prop')
    if (pattern.seat) svg += line([36, p.p[1] + 4], [76, p.p[1] + 4], 'fig-prop') + line([56, p.p[1] + 4], [56, 108], 'fig-prop')
    if (pattern.cable) svg += line(p.w, pattern.cable, 'fig-cable')
    svg += line(p.s, p.e2, 'fig-limb fig-back') + line(p.e2, p.w2, 'fig-limb fig-back') + line(p.p, p.k2, 'fig-limb fig-back') + line(p.k2, p.f2, 'fig-limb fig-back')
    svg += line(p.s, p.p) + line(p.p, p.k) + line(p.k, p.f) + line(p.s, p.e) + line(p.e, p.w)
    svg += '<circle class="fig-head" cx="' + p.h[0].toFixed(1) + '" cy="' + p.h[1].toFixed(1) + '" r="8"/>'
    if (pattern.bar) svg += '<circle class="fig-weight" cx="' + p.w[0].toFixed(1) + '" cy="' + p.w[1].toFixed(1) + '" r="5"/>'
    return svg
  }

  function animate(svg, pattern) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    const step = (now) => {
      if (!svg.isConnected) return
      const cycle = ((now - started) / 2400) % 1
      const t = reduced ? 1 : 0.5 - Math.cos(cycle * Math.PI * 2) / 2
      svg.innerHTML = frame(pattern, t)
      if (!reduced) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  function decorateDetail() {
    const content = document.querySelector('[data-muscle-detail-content]')
    const title = content?.querySelector('#muscle-detail-title')
    if (!title || content.querySelector('.exercise-animation')) return
    const key = patternFor(title.textContent)
    if (!key) return
    const figure = document.createElement('figure')
    figure.className = 'exercise-animation'
    figure.innerHTML = '<svg viewBox="0 0 120 112" role="img" aria-label="Demonstração animada: ' + esc(title.textContent) + '"></svg><figcaption>Demonstração simplificada do movimento. Ajuste a execução com um profissional.</figcaption>'
    title.insertAdjacentElement('afterend', figure)
    animate(figure.querySelector('svg'), PATTERNS[key])
  }

  // O guia abre ao clicar em "Ver execução"; a animação entra logo depois que o conteúdo é montado.
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-muscle-exercise]')) requestAnimationFrame(decorateDetail)
  })
  window.ForjaAnimacoes = Object.freeze({ patternFor, patterns: Object.keys(PATTERNS) })
})()
