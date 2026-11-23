'use strict';
let KEY = ForjaStorage.keys.appData; const $ = s => document.querySelector(s), esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])), today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }, uid = () => crypto.randomUUID(), num = n => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
// Os grupos abaixo refletem combinações práticas e consistentes para musculação.
// O pescoço não entra na rotina base do gerador, porque esse app prioriza divisões de treino reais e seguras para o público geral.

const EXERCISE_GROUPS = [
  ['peito', 'Peito'],
  ['costas', 'Costas'],
  ['ombros', 'Ombros'],
  ['biceps', 'Bíceps'],
  ['triceps', 'Tríceps'],
  ['quadriceps', 'Quadríceps'],
  ['posteriores', 'Posteriores de coxa'],
  ['gluteos', 'Glúteos'],
  ['adutores', 'Adutores'],
  ['panturrilhas', 'Panturrilhas'],
  ['core', 'Core / abdômen'],
  ['cardio', 'Cardio'],
];

const EXERCISE_LIBRARY = [
  { nome: 'Supino reto', grupo: 'peito', primarios: ['peitoral maior — porção esternocostal'], secundarios: ['tríceps', 'deltoide anterior'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Posicione os pés no chão, estabilize a região lombar e abaixe a barra até o peitoral com controle.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Supino inclinado', grupo: 'peito', primarios: ['peitoral maior — porção clavicular'], secundarios: ['tríceps', 'deltoide anterior'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Mantenha os ombros fixos e controlem a descida para reduzir compensações.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Crucifixo', grupo: 'peito', primarios: ['peitoral maior — porção esternocostal'], secundarios: ['peitoral menor', 'deltoide anterior'], equipamento: 'halteres', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Abaixe os braços com leve flexão de cotovelos e retorne sem exagerar a amplitude.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Crossover', grupo: 'peito', primarios: ['peitoral maior — porção esternocostal'], secundarios: ['deltoide anterior'], equipamento: 'polia', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantenha o tronco estável e conduza as mãos à frente do peito sem perder o controle na volta.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Peck deck', grupo: 'peito', primarios: ['peitoral maior — porção esternocostal'], secundarios: ['peitoral menor'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantenha o peito aberto e a contração no ponto final.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Puxada frontal', grupo: 'costas', primarios: ['latíssimo do dorso'], secundarios: ['biceps braquial — cabeça curta', 'rhomboide maior'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Puxe a barra em direção ao tórax com ombros baixos e tronco estável.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Barra fixa', grupo: 'costas', primarios: ['latíssimo do dorso'], secundarios: ['trapézio médio', 'bíceps braquial — cabeça curta'], equipamento: 'barra fixa', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Use a amplitude que permita manter uma linha estável e controlada.', foco: ['forca', 'geral'] },
  { nome: 'Remada baixa', grupo: 'costas', primarios: ['romboide maior', 'trapézio médio'], secundarios: ['latíssimo do dorso', 'biceps braquial — cabeça longa'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Construa o movimento pela scapula e mantenha o tronco firme.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Pulldown', grupo: 'costas', primarios: ['latíssimo do dorso'], secundarios: ['bíceps braquial — cabeça curta', 'trapezio superior'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'composto', instrucoes: 'Controle a volta e mantenha a postura cervical neutra.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Desenvolvimento', grupo: 'ombros', primarios: ['deltoide anterior'], secundarios: ['deltoide lateral', 'tríceps'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Abaixe a barra com controle e mantenha os cotovelos com leve flexão.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Elevação lateral', grupo: 'ombros', primarios: ['deltoide lateral'], secundarios: ['supraespinal'], equipamento: 'halteres', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Eleve os braços sem deslocar o tronco.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Face pull', grupo: 'ombros', primarios: ['deltoide posterior'], secundarios: ['romboide maior', 'supraespinal'], equipamento: 'polia', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Traga as alças em direção ao rosto com contração escapular.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Rosca direta', grupo: 'biceps', primarios: ['bíceps braquial — cabeça longa'], secundarios: ['braquial', 'braquiorradial'], equipamento: 'barra', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Movimente apenas o cotovelo e mantenha o ombro estável.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Rosca alternada', grupo: 'biceps', primarios: ['bíceps braquial — cabeça curta'], secundarios: ['braquiorradial'], equipamento: 'halteres', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Concentre-se na contração e evite oscilar o corpo.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Rosca martelo', grupo: 'biceps', primarios: ['braquiorradial'], secundarios: ['braquial', 'grácil'], equipamento: 'halteres', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'A mão fica neutra e o movimento segue em linha reta.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Tríceps pulley', grupo: 'triceps', primarios: ['cabeça longa'], secundarios: ['cabeça lateral'], equipamento: 'polia', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantenha os cotovelos próximos ao corpo e retorne lentamente.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Tríceps francês', grupo: 'triceps', primarios: ['cabeça longa'], secundarios: ['cabeça medial'], equipamento: 'halter', nivel: 'intermediario', tipo: 'isolador', instrucoes: 'Abaixe controlando a flexão do cotovelo e mantenha o tronco firme.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Agachamento', grupo: 'quadriceps', primarios: ['reto femoral', 'vasto lateral', 'vasto medial'], secundarios: ['glúteo máximo', 'core'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Abaixe em profundidade confortável e estabilize a coluna.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Leg press', grupo: 'quadriceps', primarios: ['vasto lateral', 'vasto intermédio'], secundarios: ['glúteo máximo', 'adutor magno'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'composto', instrucoes: 'Evite hiperextensão e mantenha os pés alinhados.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Cadeira extensora', grupo: 'quadriceps', primarios: ['vasto medial', 'reto femoral'], secundarios: ['vasto lateral'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Estenda a articulação com controle e mantenha boa postura.', foco: ['hipertrofia', 'resistencia muscular', 'geral'] },
  { nome: 'Agachamento búlgaro', grupo: 'quadriceps', primarios: ['reto femoral', 'glúteo máximo'], secundarios: ['adutor magno', 'core'], equipamento: 'halter', nivel: 'avancado', tipo: 'composto', instrucoes: 'Mantenha o tronco alinhado e a perna de trás ativa.', foco: ['hipertrofia', 'forca'] },
  { nome: 'Mesa flexora', grupo: 'posteriores', primarios: ['bíceps femoral — cabeça longa'], secundarios: ['semitendíneo', 'semimembranáceo'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Flexione o joelho sem puxar o tronco para trás.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Levantamento terra romeno', grupo: 'posteriores', primarios: ['eretor da espinha', 'glúteo máximo'], secundarios: ['bíceps femoral — cabeça longa', 'core'], equipamento: 'barra', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Mantenha a coluna neutra enquanto descem e subam os braços.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Elevação pélvica', grupo: 'gluteos', primarios: ['glúteo máximo'], secundarios: ['glúteo médio', 'core'], equipamento: 'barra', nivel: 'iniciante', tipo: 'composto', instrucoes: 'Eleve o quadril até a linha corporal sem perder o encaixe do tronco.', foco: ['hipertrofia', 'forca', 'geral'] },
  { nome: 'Avanço', grupo: 'gluteos', primarios: ['glúteo máximo'], secundarios: ['quadriceps', 'core'], equipamento: 'halteres', nivel: 'intermediario', tipo: 'composto', instrucoes: 'Desça em bloco e mantenha o equilíbrio.', foco: ['hipertrofia', 'geral'] },
  { nome: 'Extensão de quadril', grupo: 'gluteos', primarios: ['glúteo máximo'], secundarios: ['glúteo médio'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Expulse o quadril sem exagerar na extensão da lombar.', foco: ['hipertrofia', 'resistencia muscular'] },
  { nome: 'Máquina adutora', grupo: 'adutores', primarios: ['adutor magno'], secundarios: ['adutor longo', 'grácil'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Movimente a faixa de forma controlada sem torcer o tronco.', foco: ['geral', 'resistencia muscular'] },
  { nome: 'Panturrilha em pé', grupo: 'panturrilhas', primarios: ['gastrocnêmio — cabeça medial'], secundarios: ['sóleo', 'plantar'], equipamento: 'barra', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Eleve os calcanhares completamente e retorne com controle.', foco: ['hipertrofia', 'resistencia muscular', 'geral'] },
  { nome: 'Panturrilha sentado', grupo: 'panturrilhas', primarios: ['sóleo'], secundarios: ['gastrocnêmio — cabeça lateral'], equipamento: 'máquina', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantém a dorsiflexão e a elevação do tornozelo em um movimento controlado.', foco: ['hipertrofia', 'resistencia muscular'] },
  { nome: 'Abdominal', grupo: 'core', primarios: ['reto abdominal'], secundarios: ['oblíquo externo', 'transverso do abdômen'], equipamento: 'peso corporal', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Eleve o tronco mantendo a lombar apoiada e a respiração controlada.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Elevação de pernas', grupo: 'core', primarios: ['reto abdominal'], secundarios: ['oblíquo interno'], equipamento: 'peso corporal', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantenha a lombar no chão e eleve as pernas com controle.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Prancha', grupo: 'core', primarios: ['transverso do abdômen'], secundarios: ['oblíquo interno', 'quadrado lombar'], equipamento: 'peso corporal', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Mantenha o corpo em linha reta sem perder a estabilidade do quadril.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Abdominal oblíquo', grupo: 'core', primarios: ['oblíquo externo'], secundarios: ['oblíquo interno', 'reto abdominal'], equipamento: 'peso corporal', nivel: 'iniciante', tipo: 'isolador', instrucoes: 'Movimente o tronco com controlo e mantenha a pelve estável.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Corrida leve', grupo: 'cardio', primarios: ['glúteo máximo', 'quadriceps'], secundarios: ['panturrilhas'], equipamento: 'treadmill', nivel: 'iniciante', tipo: 'composto', instrucoes: 'Mantenha uma cadência confortável e respiratória controlada.', foco: ['resistencia muscular', 'geral'] },
  { nome: 'Bike', grupo: 'cardio', primarios: ['quadriceps'], secundarios: ['glúteo máximo', 'panturrilhas'], equipamento: 'bike', nivel: 'iniciante', tipo: 'composto', instrucoes: 'Escolha intensidade moderada para manter uma boa ciclagem.', foco: ['resistencia muscular', 'geral'] }
];

const FOOD_LIBRARY = [
  { nome: 'Arroz branco', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Base prática para refeições principais.' },
  { nome: 'Arroz integral', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Opção com maior variedade de fibras.' },
  { nome: 'Batata inglesa', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa alternativa em refeições de maior volume.' },
  { nome: 'Batata doce', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Alternativa energética e saborosa.' },
  { nome: 'Mandioca', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Fonte versátil de energia.' },
  { nome: 'Macarrão', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Adequado em combinações de maior volume.' },
  { nome: 'Aveia', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Boa opção para café e preparo rápido.' },
  { nome: 'Pão integral', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Boa base para café da manhã e lanches.' },
  { nome: 'Tapioca', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Opção leve para organização simples.' },
  { nome: 'Cuscuz', categoria: 'carboidrato', grupos: ['carboidrato'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa opção para alternância de carboidratos.' },
  { nome: 'Frango grelhado', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: false, vegano: false, observacao: 'Fonte de proteína de fácil adaptação.' },
  { nome: 'Carne bovina', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: false, vegano: false, observacao: 'Boa escolha em refeições principais.' },
  { nome: 'Peixe', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: false, vegano: false, observacao: 'Boa opção balanceada em dias de treino.' },
  { nome: 'Atum', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: false, vegano: false, observacao: 'Fonte prática de proteína.' },
  { nome: 'Ovos', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['cafe', 'almoco', 'jantar'], vegetariano: true, vegano: false, observacao: 'Versátil para café e refeições rápidas.' },
  { nome: 'Iogurte natural', categoria: 'proteina', grupos: ['proteina', 'laticinio'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: false, observacao: 'Bom para café, lanche ou acompanhamento.' },
  { nome: 'Queijo', categoria: 'proteina', grupos: ['proteina', 'laticinio'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: false, observacao: 'Pode entrar em lanches e café da manhã.' },
  { nome: 'Feijão', categoria: 'leguminosa', grupos: ['leguminosa', 'proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Opção versátil e equilibrada.' },
  { nome: 'Lentilha', categoria: 'leguminosa', grupos: ['leguminosa', 'proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa fonte de proteína e fibras.' },
  { nome: 'Grão-de-bico', categoria: 'leguminosa', grupos: ['leguminosa', 'proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa alternativa para variados pratos.' },
  { nome: 'Tofu', categoria: 'proteina', grupos: ['proteina'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa alternativa para dietas sem carne.' },
  { nome: 'Banana', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Fonte de energia e praticidade.' },
  { nome: 'Maçã', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['lanche', 'cafe'], vegetariano: true, vegano: true, observacao: 'Boa opção para lanches.' },
  { nome: 'Laranja', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['lanche', 'cafe'], vegetariano: true, vegano: true, observacao: 'Boa opção para variar a fruta.' },
  { nome: 'Mamão', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Fruta útil para café da manhã e lanche.' },
  { nome: 'Morango', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Boa opção para lanches e frutas naturais.' },
  { nome: 'Manga', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['lanche', 'cafe'], vegetariano: true, vegano: true, observacao: 'Fruta doce para flexibilizar o dia.' },
  { nome: 'Abacaxi', categoria: 'fruta', grupos: ['fruta'], refeicoesIndicadas: ['lanche', 'cafe'], vegetariano: true, vegano: true, observacao: 'Boa escolha para variar os carboidratos e as frutas.' },
  { nome: 'Alface', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Base leve para saladas e acompanhamento.' },
  { nome: 'Rúcula', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa para saladas e pratos leves.' },
  { nome: 'Tomate', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Versátil e fácil de combinar.' },
  { nome: 'Cenoura', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa opção em saladas e preparações simples.' },
  { nome: 'Brócolis', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Vegetal muito útil em refeições principais.' },
  { nome: 'Couve-flor', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa alternativa para variações de prato.' },
  { nome: 'Abobrinha', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa opção em preparações leves.' },
  { nome: 'Espinafre', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Fica bem em refeições de maior equilíbrio.' },
  { nome: 'Couve', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Boa escolha para acompanhamento.' },
  { nome: 'Abacate', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['almoco', 'lanche'], vegetariano: true, vegano: true, observacao: 'Boa fonte de gordura de boa qualidade.' },
  { nome: 'Castanhas', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['lanche'], vegetariano: true, vegano: true, observacao: 'Bom lanche em porções moderadas.' },
  { nome: 'Amendoim', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['lanche'], vegetariano: true, vegano: true, observacao: 'Boa fonte de gordura para lanches.' },
  { nome: 'Pasta de amendoim', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['lanche', 'cafe'], vegetariano: true, vegano: true, observacao: 'Alternativa prática para lanches.' },
  { nome: 'Azeite', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Uso moderado como fonte de gordura.' },
  { nome: 'Sementes de chia', categoria: 'gordura', grupos: ['gordura'], refeicoesIndicadas: ['cafe', 'lanche'], vegetariano: true, vegano: true, observacao: 'Boa alternativa para café e lanche.' },
  { nome: 'Água', categoria: 'outros', grupos: ['outros'], refeicoesIndicadas: ['todos'], vegetariano: true, vegano: true, observacao: 'Priorize hidratação ao longo do dia.' },
  { nome: 'Leite', categoria: 'laticinio', grupos: ['laticinio'], refeicoesIndicadas: ['cafe'], vegetariano: true, vegano: false, observacao: 'Opção se não houver restrição de lactose.' },
  { nome: 'Bebidas sem açúcar', categoria: 'outros', grupos: ['outros'], refeicoesIndicadas: ['todos'], vegetariano: true, vegano: true, observacao: 'Boa opção para hidratação sem exagerar.' },
  { nome: 'Salada', categoria: 'vegetal', grupos: ['vegetal'], refeicoesIndicadas: ['almoco', 'jantar'], vegetariano: true, vegano: true, observacao: 'Alimentação leve e colorida.' }
];

const FOOD_ALTERNATIVES = {
  'arroz branco': ['arroz integral', 'batata inglesa', 'batata doce', 'mandioca', 'macarrão', 'cuscuz'],
  'frango grelhado': ['carne bovina', 'peixe', 'ovos', 'tofu', 'feijão'],
  'banana': ['maçã', 'mamão', 'laranja', 'morango', 'manga'],
  'iogurte natural': ['leite de soja', 'queijo', 'ovos', 'tofu'],
  'feijão': ['lentilha', 'grão-de-bico', 'tofu', 'ovos'],
  'batata inglesa': ['batata doce', 'arroz integral', 'mandioca', 'macarrão']
};

const MEAL_LAYOUTS = {
  3: ['Café da manhã', 'Almoço', 'Jantar'],
  4: ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'],
  5: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar'],
  6: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia']
};

const FOOD_MACRO_DB = {
  'arroz branco': { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, portion: 180 },
  'arroz integral': { kcal: 124, protein: 2.7, carbs: 26, fat: 1.1, portion: 180 },
  'batata inglesa': { kcal: 77, protein: 2, carbs: 17.5, fat: 0.1, portion: 200 },
  'batata doce': { kcal: 86, protein: 1.6, carbs: 20.1, fat: 0.1, portion: 200 },
  'mandioca': { kcal: 160, protein: 1.5, carbs: 38, fat: 0.3, portion: 180 },
  'macarrão': { kcal: 131, protein: 5.1, carbs: 25.5, fat: 1.3, portion: 180 },
  'aveia': { kcal: 389, protein: 16.9, carbs: 66, fat: 6.9, portion: 60 },
  'pão integral': { kcal: 247, protein: 12, carbs: 46, fat: 3, portion: 90 },
  'tapioca': { kcal: 155, protein: 1.4, carbs: 33, fat: 0.4, portion: 90 },
  'cuscuz': { kcal: 129, protein: 4.5, carbs: 24, fat: 1.4, portion: 150 },
  'frango grelhado': { kcal: 165, protein: 31, carbs: 0, fat: 3.6, portion: 150 },
  'carne bovina': { kcal: 210, protein: 26, carbs: 0, fat: 12, portion: 140 },
  'peixe': { kcal: 150, protein: 23, carbs: 0, fat: 6, portion: 150 },
  'atum': { kcal: 128, protein: 25, carbs: 0, fat: 1, portion: 120 },
  'ovos': { kcal: 155, protein: 13, carbs: 1.1, fat: 11, portion: 120 },
  'iogurte natural': { kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, portion: 170 },
  'queijo': { kcal: 402, protein: 25, carbs: 1.3, fat: 33, portion: 50 },
  'feijão': { kcal: 132, protein: 8.7, carbs: 23.7, fat: 0.5, portion: 150 },
  'lentilha': { kcal: 116, protein: 9, carbs: 20, fat: 0.4, portion: 150 },
  'grão-de-bico': { kcal: 164, protein: 8.9, carbs: 27, fat: 2.6, portion: 150 },
  'tofu': { kcal: 76, protein: 8, carbs: 1.9, fat: 4.8, portion: 120 },
  'banana': { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, portion: 120 },
  'maçã': { kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2, portion: 120 },
  'laranja': { kcal: 47, protein: 0.9, carbs: 11.8, fat: 0.1, portion: 120 },
  'mamão': { kcal: 43, protein: 0.8, carbs: 10.8, fat: 0.2, portion: 140 },
  'morango': { kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, portion: 120 },
  'manga': { kcal: 60, protein: 0.8, carbs: 14.8, fat: 0.4, portion: 120 },
  'abacaxi': { kcal: 50, protein: 0.5, carbs: 13.1, fat: 0.1, portion: 120 },
  'alface': { kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, portion: 120 },
  'rúcula': { kcal: 22, protein: 2.6, carbs: 3.7, fat: 0.7, portion: 60 },
  'tomate': { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, portion: 120 },
  'cenoura': { kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2, portion: 120 },
  'brócolis': { kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, portion: 150 },
  'couve-flor': { kcal: 25, protein: 1.9, carbs: 4.9, fat: 0.3, portion: 150 },
  'abobrinha': { kcal: 17, protein: 1.2, carbs: 3.4, fat: 0.2, portion: 150 },
  'espinafre': { kcal: 22, protein: 2.9, carbs: 3.6, fat: 0.2, portion: 80 },
  'couve': { kcal: 49, protein: 2.9, carbs: 8.9, fat: 0.9, portion: 90 },
  'abacate': { kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, portion: 80 },
  'castanhas': { kcal: 553, protein: 15.2, carbs: 13.6, fat: 49.7, portion: 25 },
  'amendoim': { kcal: 567, protein: 25, carbs: 16, fat: 49, portion: 25 },
  'pasta de amendoim': { kcal: 588, protein: 25, carbs: 17, fat: 50, portion: 20 },
  'azeite': { kcal: 884, protein: 0, carbs: 0, fat: 100, portion: 10 },
  'sementes de chia': { kcal: 486, protein: 16.5, carbs: 42.1, fat: 30.7, portion: 20 },
  'água': { kcal: 0, protein: 0, carbs: 0, fat: 0, portion: 250 },
  'leite': { kcal: 42, protein: 3.4, carbs: 4.8, fat: 1, portion: 200 },
  'bebidas sem açúcar': { kcal: 2, protein: 0, carbs: 0, fat: 0, portion: 200 },
  'salada': { kcal: 35, protein: 1.2, carbs: 7, fat: 0.2, portion: 180 }
};

const getFoodMacroMeta = (foodName) => {
  const key = normalizeName(foodName);
  const match = Object.entries(FOOD_MACRO_DB).find(([name]) => normalizeName(name) === key);
  if (match) return { ...match[1], nome: match[0] };
  return { kcal: 120, protein: 6, carbs: 18, fat: 4, portion: 150, nome: String(foodName || 'Alimento').trim() || 'Alimento' };
};

const getMealFoodSnapshot = (foodName) => {
  const meta = getFoodMacroMeta(foodName);
  const portion = meta.portion || 150;
  const calories = (meta.kcal * portion) / 100;
  const protein = (meta.protein * portion) / 100;
  const carbs = (meta.carbs * portion) / 100;
  const fat = (meta.fat * portion) / 100;
  return { ...meta, portion, calories, protein, carbs, fat };
};

const fresh = () => ({ profile: { name: '', weight: 0, target: 0, calories: 2000, age: 0, height: 0, experience: 'iniciante', goal: 'hipertrofia', athlete: false, athletePhase: 'off-season', daysAvailable: 3, refeicoesPorDia: 4, gosta: [], naoGosta: [], alergias: [], intolerancias: [], restricoesAlimentares: [], observacoes: '', restrictions: '' }, exercises: [], workouts: [], executions: [], foods: [], meals: [], weights: [], generatedPlan: null, nutritionPlan: null, demo: false }); let state = fresh(); const rawState = ForjaStorage.readJSON(KEY); if (rawState && rawState.profile && ['exercises', 'workouts', 'executions', 'foods', 'meals', 'weights'].every(k => Array.isArray(rawState[k]))) { state = { ...fresh(), ...rawState, profile: { ...fresh().profile, ...(rawState.profile || {}) } } } let route = 'inicio';
window.forjaSetUserScope = userId => { KEY = userId ? `${ForjaStorage.keys.appData}:${userId}` : ForjaStorage.keys.appData; const savedState = ForjaStorage.readJSON(KEY); state = fresh(); if (savedState && savedState.profile && ['exercises', 'workouts', 'executions', 'foods', 'meals', 'weights'].every(key => Array.isArray(savedState[key]))) state = { ...fresh(), ...savedState, profile: { ...fresh().profile, ...(savedState.profile || {}) } }; return state; };
const save = () => { if (ForjaStorage.writeJSON(KEY, state)) return true; toast('Não foi possível salvar. Verifique o espaço e as permissões do navegador.'); return false }, notify = () => { render(); toast('Registro salvo. Seu acompanhamento foi atualizado.'); };
function toast(t) { const element = $('#toast'); element.textContent = t; element.dataset.type = /não foi possível|não permitiu|falha/i.test(t) ? 'error' : 'success'; element.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove('show'), 4000) }
function dates(n = 7) { return Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - n + 1 + i); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }) }
const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
function nutrition(day) { return state.meals.filter(m => m.date === day).reduce((a, m) => { for (const k of ['calories', 'protein', 'carbs', 'fat']) a[k] += (m.snapshot[k] || 0) * m.quantity / 100; return a }, { calories: 0, protein: 0, carbs: 0, fat: 0 }) }
function volume(x) { return x.type === 'cardio' ? x.distance : x.sets * x.reps * x.load }
function expenditure(day) { return state.executions.filter(x => x.date === day).reduce((a, x) => a + x.minutes * (x.type === 'cardio' ? 7 : 4), 0) }
function progress(id) { const xs = state.executions.filter(x => x.exerciseId === id).sort((a, b) => a.date.localeCompare(b.date) || a.created - b.created); if (xs.length < 2) return { label: 'Sem comparação', delta: null }; const before = volume(xs[xs.length - 2]), after = volume(xs.at(-1)); if (!before) return { label: 'Sem comparação', delta: null }; const delta = (after - before) / before * 100; return { label: delta > 5 ? 'Evoluindo' : delta < -5 ? 'Regredindo' : 'Estável', delta } }
function insight() { const ds = dates(14).filter(d => state.meals.some(m => m.date === d)); if (!ds.length) return 'Registre refeições e treinos para descobrir a relação entre sua alimentação e sua rotina. Dias sem alimentação registrada ficam fora da análise.'; if (!ds.some(d => state.executions.some(x => x.date === d))) return 'Já existem registros de alimentação. Registre também seus treinos nesse período para comparar os dias com e sem atividade.'; const over = ds.filter(d => nutrition(d).calories > state.profile.calories), rest = over.filter(d => !state.executions.some(x => x.date === d)); const withTrain = ds.filter(d => state.executions.some(x => x.date === d)), without = ds.filter(d => !withTrain.includes(d)); const pct = arr => arr.length ? `${Math.round(arr.filter(d => over.includes(d)).length / arr.length * 100)}%` : 'sem dados'; return `Nos últimos 14 dias, ${over.length} de ${ds.length} dias com alimentação registrada ultrapassaram a meta base. ${rest.length} desses dias não tiveram treino registrado. Excesso alimentar: ${pct(withTrain)} dos dias com treino e ${pct(without)} dos dias sem treino. Essa comparação descreve seus registros, sem indicar causa.` }
function chart(series, labels, { goal = 0, unit = '', fit = false } = {}) { if (!series.length || !series.some(s => s.values.some(v => v !== null))) return '<div class="empty"><strong>Seu próximo registro começa este gráfico.</strong>Adicione dados para acompanhar a tendência.</div>'; const W = 620, H = 190, p = 30, all = series.flatMap(s => s.values).filter(v => v !== null), reference = goal ? [...all, goal] : all, low = Math.min(...reference), high = Math.max(...reference), pad = Math.max((high - low) * 0.15, 1), min = fit ? Math.max(0, Math.floor(low - pad)) : 0, max = fit ? Math.ceil(high + pad) : Math.max(...all, goal, 1) * 1.2, base = H - 30, x = i => p + i * (W - 2 * p) / Math.max(labels.length - 1, 1), y = v => base - (v - min) / (max - min) * (H - 55); let svg = `<svg class="chart" role="img" aria-label="Gráfico ${esc(unit)}" viewBox="0 0 ${W} ${H}">`; for (let i = 0; i < 4; i++) { const v = min + (max - min) * i / 3; svg += `<line x1="${p}" x2="${W - p}" y1="${y(v)}" y2="${y(v)}" class="chart-grid"/><text x="${p}" y="${y(v) - 5}">${Math.round(v)}</text>` } if (goal) svg += `<line x1="${p}" x2="${W - p}" y1="${y(goal)}" y2="${y(goal)}" class="chart-goal" stroke-dasharray="5 5"/>`; for (const s of series) { let path = '', open = false; s.values.forEach((v, i) => { if (v === null) { open = false; return } path += `${open ? 'L' : 'M'}${x(i)},${y(v)} `; open = true }); svg += `<path d="${path}" fill="none" stroke="${s.color || '#ff591f'}" stroke-width="2.5"/>`; s.values.forEach((v, i) => { if (v !== null) svg += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${s.color || '#ff591f'}"><title>${esc(labels[i])}: ${num(v)} ${esc(unit)}</title></circle>` }) } labels.forEach((d, i) => { if (labels.length < 9 || i % 2 === 0) svg += `<text text-anchor="middle" x="${x(i)}" y="${H - 7}">${esc(d)}</text>` }); return svg + '</svg>' }
const button = (label, action, cls = '') => `<button class="button ${cls}" data-action="${action}">${label}</button>`;
const empty = t => `<div class="empty">${t}</div>`;
const title = (eyebrow, t, desc, buttons = '') => `<div class="page-title"><div><p class="eyebrow orange">${eyebrow}</p><h1>${t}</h1><p>${desc}</p></div><div class="actions">${buttons}</div></div>`;
function stats() { const n = nutrition(today()), g = expenditure(today()), remaining = state.profile.calories + g - n.calories, weights = state.weights.slice().sort((first, second) => first.date.localeCompare(second.date)), weight = weights.at(-1)?.weight ?? state.profile.weight; return `<div class="stats">${[["CALORIAS HOJE", num(n.calories), 'kcal', `Meta base: ${num(state.profile.calories)} kcal`, n.calories / state.profile.calories], [remaining >= 0 ? 'SALDO DISPONÍVEL' : 'ACIMA DA REFERÊNCIA', num(Math.abs(remaining)), 'kcal', `Treino estimado: ${num(g)} kcal`, g / 500], ["PROTEÍNA HOJE", num(n.protein), 'g', `${num(n.carbs)} g carbo · ${num(n.fat)} g gordura`, 0], ["PESO ATUAL", weight ? num(weight) : '—', 'kg', state.profile.target ? `Meta: ${num(state.profile.target)} kg` : 'Defina sua meta no perfil', 0]].map(([l, v, u, s, m]) => `<article class="stat reveal"><span class="label">${l}</span><strong>${v} <span>${u}</span></strong><small>${s}</small><div class="meter"><i style="width:${Math.min(100, Math.max(0, m * 100))}%"></i></div></article>`).join('')}</div>` }
function mealRows(ms) { return ms.length ? ms.slice().reverse().map(m => `<div class="row"><div class="row-main"><span class="row-icon">${esc(m.meal[0])}</span><div><strong>${esc(m.snapshot.name)}</strong><small>${esc(m.meal)}${m.time ? ` · ${esc(m.time)}` : ''} · ${num(m.quantity)} g · ${fmtDate(m.date)}</small></div></div><div class="row-value">${num(m.snapshot.calories * m.quantity / 100)} kcal<br><button class="delete" data-remove="meals:${m.id}">Excluir</button></div></div>`).join('') : empty('Ainda não há refeições registradas. Adicione a primeira.'); }
function weightChart() { const ws = state.weights.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(-10); return chart([{ values: ws.map(w => w.weight) }], ws.map(w => fmtDate(w.date)), { goal: state.profile.target, unit: 'kg', fit: true }) }
function field(name, label, type = 'text', value = '', extra = '') { return `<div class="field"><label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${extra} required></div>` }
const positive = 'min="0.1" step="any"', nonnegative = 'min="0" step="any"', dateField = () => field('date', 'Data', 'date', today(), `max="${today()}"`), selectField = (name, label, opts) => `<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}" required>${opts}</select></div>`;
function render() {
  // A interface é desenhada por renderExperience (experience.js), que substitui esta função ao iniciar.
}
function observe() { const ob = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ob.unobserve(e.target) } }), { threshold: .07 }); document.querySelectorAll('.scroll-reveal').forEach(el => ob.observe(el)); }
function readNum(fd, k, zero = false) { const v = Number(fd.get(k)); if (!Number.isFinite(v) || fd.get(k) === '' || (zero ? v < 0 : v <= 0)) throw Error('Preencha os valores numéricos corretamente.'); return v }
function readDate(fd) { const d = String(fd.get('date')); if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d > today() || Number.isNaN(Date.parse(d + 'T12:00:00'))) throw Error('Use uma data válida que não esteja no futuro.'); return d }
function resolvePlanDivision(daysAvailable) {
  const map = {
    1: { label: 'Full Body', sessions: ['Full Body'] },
    2: { label: 'Full Body A / Full Body B', sessions: ['Full Body A', 'Full Body B'] },
    3: { label: 'Full Body A / Full Body B / Full Body C', sessions: ['Full Body A', 'Full Body B', 'Full Body C'] },
    4: { label: 'Upper / Lower', sessions: ['Upper A', 'Lower A', 'Upper B', 'Lower B'] },
    5: { label: 'Upper / Lower + foco', sessions: ['Upper', 'Lower', 'Upper', 'Lower', 'Recuperação'] },
    6: { label: 'Push / Pull / Legs', sessions: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'] },
    7: { label: 'Push / Pull / Legs + recuperação', sessions: ['Push', 'Pull', 'Legs', 'Recuperação', 'Push', 'Pull', 'Legs'] }
  };
  return map[Math.min(7, Math.max(1, Number(daysAvailable) || 3))] || map[3];
}
function getSessionGroups(sessionName) {
  const groups = {
    'Full Body': ['peito', 'costas', 'quadriceps', 'posteriores', 'ombros', 'core'],
    'Full Body A': ['peito', 'quadriceps', 'ombros'],
    'Full Body B': ['costas', 'posteriores', 'gluteos', 'core'],
    'Full Body C': ['ombros', 'panturrilhas', 'quadriceps', 'core'],
    'Upper A': ['peito', 'costas', 'ombros', 'triceps'],
    'Lower A': ['quadriceps', 'posteriores', 'gluteos'],
    'Upper B': ['costas', 'biceps', 'ombros'],
    'Lower B': ['quadriceps', 'posteriores', 'panturrilhas', 'core'],
    Upper: ['peito', 'costas', 'ombros', 'biceps'],
    Lower: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas'],
    Push: ['peito', 'ombros', 'triceps'],
    Pull: ['costas', 'biceps', 'core'],
    Legs: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas'],
    Recuperação: []
  };
  return groups[sessionName] || ['core'];
}
function getExercisePoolByGroup(group) {
  return EXERCISE_LIBRARY.filter(ex => ex.grupo === group);
}
function getRepsRange(goal, level) {
  const ranges = {
    hipertrofia: { iniciante: '8-12', intermediario: '8-12', avancado: '6-10' },
    forca: { iniciante: '5-8', intermediario: '5-8', avancado: '4-6' },
    'resistencia muscular': { iniciante: '12-15', intermediario: '10-15', avancado: '12-20' },
    geral: { iniciante: '8-12', intermediario: '8-12', avancado: '6-10' }
  };
  return ranges[goal]?.[level] || ranges.hipertrofia.iniciante;
}
function getSeriesRange(goal, level) {
  const ranges = {
    hipertrofia: { iniciante: '3', intermediario: '3-4', avancado: '4-5' },
    forca: { iniciante: '3-4', intermediario: '4-5', avancado: '5-6' },
    'resistencia muscular': { iniciante: '2-3', intermediario: '3', avancado: '3-4' },
    geral: { iniciante: '3', intermediario: '3-4', avancado: '4' }
  };
  return ranges[goal]?.[level] || ranges.hipertrofia.iniciante;
}
function getRestGoal(goal, type) {
  if (type === 'composto') {
    if (goal === 'forca') return '120-180s';
    return '90-120s';
  }
  if (goal === 'resistencia muscular') return '45-75s';
  return '60-90s';
}
function getDifficultyFilter(level) {
  if (level === 'iniciante') return ex => ex.nivel !== 'avancado';
  if (level === 'intermediario') return ex => ex.nivel !== 'iniciante' || ex.tipo === 'composto';
  return () => true;
}
function getGoalBias(goal) {
  return {
    hipertrofia: { compound: 4, isolation: 3, aerobic: 1, strengthBias: 1 },
    forca: { compound: 5, isolation: 1, aerobic: 1, strengthBias: 3 },
    'resistencia muscular': { compound: 3, isolation: 4, aerobic: 2, strengthBias: 0 },
    geral: { compound: 3, isolation: 3, aerobic: 2, strengthBias: 1 }
  }[goal] || { compound: 3, isolation: 3, aerobic: 1, strengthBias: 1 };
}
function scoreExerciseForSession(exercise, sessionName, goal, level, athlete, phase) {
  const bias = getGoalBias(goal);
  let score = 0;
  if (exercise.tipo === 'composto') score += bias.compound * 4;
  else score += bias.isolation * 2.5;
  if (exercise.grupo === 'cardio') score += bias.aerobic * 2;
  if (exercise.foco.includes(goal)) score += 3;
  if (exercise.foco.includes('geral')) score += 2;
  if (exercise.nivel === level) score += 3;
  if (level === 'iniciante' && exercise.nivel === 'intermediario') score += 1;
  if (level === 'avancado' && exercise.nivel === 'iniciante') score -= 1;

  const focusMap = {
    'Full Body': ['peito', 'costas', 'quadriceps', 'posteriores', 'ombros', 'core'],
    'Full Body A': ['peito', 'quadriceps', 'ombros'],
    'Full Body B': ['costas', 'posteriores', 'gluteos', 'core'],
    'Full Body C': ['ombros', 'panturrilhas', 'quadriceps', 'core'],
    'Upper A': ['peito', 'costas', 'ombros', 'triceps'],
    'Lower A': ['quadriceps', 'posteriores', 'gluteos'],
    'Upper B': ['costas', 'biceps', 'ombros'],
    'Lower B': ['quadriceps', 'posteriores', 'panturrilhas', 'core'],
    Upper: ['peito', 'costas', 'ombros', 'biceps'],
    Lower: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas'],
    Push: ['peito', 'ombros', 'triceps'],
    Pull: ['costas', 'biceps', 'core'],
    Legs: ['quadriceps', 'posteriores', 'gluteos', 'panturrilhas']
  };
  const groups = focusMap[sessionName] || [];
  if (groups.includes(exercise.grupo)) score += 2.5;

  if (athlete && phase === 'pré-competição') {
    if (exercise.tipo === 'composto') score -= 0.5;
    if (exercise.tipo === 'isolador') score += 0.5;
  }
  if (athlete && phase === 'bulking') {
    if (exercise.tipo === 'composto') score += 0.7;
  }

  return score;
}
function getSessionTargetCount(sessionName, goal) {
  if (sessionName === 'Recuperação') return 0;
  if (goal === 'forca') return 3;
  if (goal === 'resistencia muscular') return 4;
  return 4;
}
function buildSmartWorkoutPlan() {
  const profile = state.profile || {};
  const age = Number(profile.age) || 0;
  const height = Number(profile.height) || 0;
  const daysAvailable = Math.min(7, Math.max(1, Number(profile.daysAvailable) || 3));
  const level = profile.experience || 'iniciante';
  const goal = profile.goal || 'hipertrofia';
  const athlete = Boolean(profile.athlete);
  const phase = profile.athletePhase || 'off-season';
  const restrictions = String(profile.restrictions || '').trim();

  if (!profile.name) throw Error('Preencha seu nome no perfil antes de gerar uma sugestão de treino.');
  if (!age || age <= 0) throw Error('Informe sua idade para gerar o treino.');
  if (!height || height <= 0) throw Error('Informe sua altura para gerar o treino.');
  if (!profile.daysAvailable || profile.daysAvailable <= 0) throw Error('Defina a quantidade de dias disponíveis por semana.');

  const division = resolvePlanDivision(daysAvailable);
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const semana = [];
  const allNames = new Set();
  const sessionBias = athlete && phase === 'pré-competição' ? 0.85 : athlete && phase === 'bulking' ? 1.15 : 1;

  division.sessions.forEach((sessionName, index) => {
    const dayLabel = weekDays[index] || 'Dia de recuperação';
    const exercicios = [];

    if (sessionName === 'Recuperação') {
      semana.push({ dia: dayLabel, treino: 'Recuperação', exercicios: [] });
      return;
    }

    const groups = getSessionGroups(sessionName);
    const targetCount = getSessionTargetCount(sessionName, goal);
    const pool = [];

    groups.forEach((group) => {
      const candidates = getExercisePoolByGroup(group)
        .filter(getDifficultyFilter(level))
        .filter(ex => ex.foco.includes(goal) || ex.foco.includes('geral'))
        .sort((a, b) => scoreExerciseForSession(b, sessionName, goal, level, athlete, phase) - scoreExerciseForSession(a, sessionName, goal, level, athlete, phase));
      if (candidates.length) pool.push(...candidates);
    });

    const selectedUnique = [];
    pool
      .sort((a, b) => scoreExerciseForSession(b, sessionName, goal, level, athlete, phase) - scoreExerciseForSession(a, sessionName, goal, level, athlete, phase))
      .forEach((exercise) => {
        if (selectedUnique.length >= targetCount) return;
        if (allNames.has(exercise.nome)) return;
        selectedUnique.push(exercise);
        allNames.add(exercise.nome);
      });

    selectedUnique.forEach((exercise) => {
      const intensity = athlete && phase === 'pré-competição' ? 'mais controlada' : goal === 'forca' ? 'mais intensa' : 'moderada';
      exercicios.push({
        nome: exercise.nome,
        grupo: exercise.grupo,
        series: getSeriesRange(goal, level),
        repeticoes: getRepsRange(goal, level),
        descanso: getRestGoal(goal, exercise.tipo),
        primarios: exercise.primarios,
        secundarios: exercise.secundarios,
        equipamento: exercise.equipamento,
        tipo: exercise.tipo,
        instrucoes: exercise.instrucoes,
        intensidade: intensity,
        volume: Math.round(sessionBias * (goal === 'forca' ? 12 : goal === 'resistencia muscular' ? 10 : 9))
      });
    });

    if (!exercicios.length) {
      semana.push({ dia: dayLabel, treino: sessionName, exercicios: [{ nome: 'Mobilidade e ativação', grupo: 'core', series: '2', repeticoes: '8-10', descanso: '45-60s', primarios: ['core'], secundarios: ['quadrado lombar'], equipamento: 'peso corporal', tipo: 'isolador', instrucoes: 'Ative o corpo e mantenha a mobilidade antes do treino.', intensidade: 'leve', volume: 6 }] });
      return;
    }

    semana.push({ dia: dayLabel, treino: sessionName, exercicios: exercicios.slice(0, Math.min(5, targetCount + 1)) });
  });

  const validation = validarTreinoSemanal(semana, level, goal, daysAvailable);
  const aviso = restrictions ? 'Há restrição ou condição informada. Recomendamos avaliação com profissional de saúde/educação física antes de seguir a sugestão de treino.' : '';
  const volumeMeta = goal === 'forca' ? 'volume concentrado e mais pesado' : goal === 'resistencia muscular' ? 'volume moderado com melhor controle do tempo sob tensão' : 'volume crescente com foco em qualidade e recuperação';

  return {
    usuario: {
      idade: age,
      peso: Number(profile.weight) || 0,
      altura: height,
      nivel: level,
      objetivo: goal,
      atleta: athlete,
      faseAtleta: athlete ? phase : 'n/a',
      diasDisponiveis: daysAvailable,
      restricoes: restrictions || 'nenhuma'
    },
    divisao: division.label,
    semana,
    validacao: validation,
    aviso,
    foco: volumeMeta,
    intensidade: athlete && phase === 'pré-competição' ? 'mais controlada, com atenção à recuperação' : goal === 'forca' ? 'mais alta' : 'moderada',
    recomendacao: athlete && phase === 'pré-competição'
      ? 'Priorize recuperação e consistência; evite aumentar volume agressivamente por estar em fase pré-competição.'
      : goal === 'forca'
        ? 'Ajuste as cargas de forma progressiva, mantendo técnica e tempo de recuperação entre séries.'
        : 'Mantenha o foco no objetivo selecionado e distribua o volume com recuperação adequada.'
  };
}
function validarTreinoSemanal(semana, level, goal, daysAvailable) {
  const daysWithWork = semana.filter(item => item.treino !== 'Recuperação');
  const longDays = daysWithWork.filter(item => item.exercicios.length > 5);
  const repeated = [];
  const names = new Map();
  semana.forEach(item => {
    item.exercicios.forEach(ex => {
      const key = ex.nome;
      names.set(key, (names.get(key) || 0) + 1);
    });
  });
  for (const [key, count] of names.entries()) {
    if (count > 1) repeated.push(key);
  }
  const warnings = [];
  if (longDays.length) warnings.push('Algum dia ficou com excesso de exercícios para o volume planejado.');
  if (repeated.length) warnings.push('Houve repetição de exercícios no mesmo ciclo de treino.');
  if (daysWithWork.length < 2) warnings.push('A rotina está muito enxuta para cobertura ampla de grupos musculares.');
  if (goal === 'forca' && level === 'iniciante' && daysAvailable >= 5) warnings.push('Para iniciante, mantenha a progressão e não aumente excessivamente a densidade semanal.');
  return warnings.length ? warnings : ['Estrutura semanal consistente com o nível e objetivo selecionados.'];
}
function toList(value) {
  if (Array.isArray(value)) return value.flatMap(item => String(item).split(',')).map(item => item.trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[;,\n]/).map(item => item.trim()).filter(Boolean);
  return [];
}
function normalizeName(value) {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function filtroAlimentos(usuario) {
  const user = usuario || state.profile || {};
  const likes = new Set(toList(user.gosta).map(normalizeName));
  const dislikes = new Set(toList(user.naoGosta).map(normalizeName));
  const alergias = toList(user.alergias).map(normalizeName);
  const intolerancias = toList(user.intolerancias).map(normalizeName);
  const restricoes = toList(user.restricoesAlimentares).concat(toList(user.restrictions)).map(normalizeName);
  const semLactose = restricoes.includes('sem lactose') || intolerancias.includes('lactose');
  const semGluten = restricoes.includes('sem gluten') || intolerancias.includes('gluten');
  const vegetariano = restricoes.includes('vegetariano');
  const vegano = restricoes.includes('vegano');

  return FOOD_LIBRARY.filter(food => {
    const name = normalizeName(food.nome);

    if (dislikes.has(name) || alergias.some(item => name.includes(item) || item.includes(name))) return false;
    if (intolerancias.some(item => name.includes(item) || item.includes(name))) return false;
    if (semLactose && (food.grupos.includes('laticinio') || name.includes('leite') || name.includes('queijo') || name.includes('iogurte'))) return false;
    if (semGluten && (name.includes('pao') || name.includes('farinha') || name.includes('trigo'))) return false;
    if (vegetariano && !food.vegetariano) return false;
    if (vegano && !food.vegano) return false;
    if (name.includes('leite') && semLactose) return false;
    return true;
  }).sort((a, b) => {
    const aLike = likes.has(normalizeName(a.nome)) ? 1 : 0;
    const bLike = likes.has(normalizeName(b.nome)) ? 1 : 0;
    return bLike - aLike;
  });
}
function buscarSubstituicoes(nome) {
  const key = normalizeName(nome);
  const direct = FOOD_ALTERNATIVES[key] || [];
  return direct.length ? direct : FOOD_LIBRARY.filter(food => normalizeName(food.nome) !== key).slice(0, 4).map(food => food.nome);
}
// Cardápio coerente por refeição: cada horário tem modelos próprios (café, lanche, almoço, jantar e ceia).
// Os alimentos de cada papel saem só da lista adequada àquele horário, giram ao longo da semana
// e respeitam gostos, aversões, alergias e restrições do perfil (via filtroAlimentos).
const MEAL_TIMES = { 'Café da manhã': '07:00', 'Lanche da manhã': '10:00', 'Almoço': '12:30', Lanche: '16:00', 'Lanche da tarde': '16:00', 'Jantar': '19:30', 'Ceia': '21:30' };
const MEAL_SLOT = { 'Café da manhã': 'cafe', 'Lanche da manhã': 'lanche', Lanche: 'lanche', 'Lanche da tarde': 'lanche', 'Almoço': 'almoco', 'Jantar': 'jantar', 'Ceia': 'ceia' };
const MEAL_ROLES = {
  cafeCarbo: ['Pão integral', 'Tapioca', 'Aveia'],
  cafeProteina: ['Ovos', 'Queijo', 'Iogurte natural', 'Pasta de amendoim'],
  cafeFruta: ['Mamão', 'Banana', 'Morango', 'Laranja', 'Manga', 'Abacaxi', 'Maçã'],
  lancheFruta: ['Maçã', 'Banana', 'Laranja', 'Morango', 'Manga', 'Abacaxi', 'Mamão'],
  lancheGordura: ['Castanhas', 'Amendoim', 'Pasta de amendoim', 'Sementes de chia'],
  principalCarbo: ['Arroz branco', 'Batata doce', 'Arroz integral', 'Mandioca', 'Macarrão', 'Batata inglesa', 'Cuscuz'],
  leguminosa: ['Feijão', 'Lentilha', 'Grão-de-bico'],
  principalProteina: ['Frango grelhado', 'Carne bovina', 'Peixe', 'Ovos', 'Atum', 'Tofu'],
  folhas: ['Salada', 'Alface', 'Tomate', 'Rúcula'],
  legumes: ['Brócolis', 'Cenoura', 'Abobrinha', 'Couve-flor', 'Espinafre', 'Couve'],
  ceiaProteina: ['Iogurte natural', 'Queijo'],
};
const MEAL_TEMPLATES = {
  cafe: [
    { roles: ['Pão integral', 'cafeProteina', 'cafeFruta'], nota: 'Café com carboidrato, uma fonte de proteína e fruta.' },
    { roles: ['Iogurte natural', 'Aveia', 'cafeFruta', 'Sementes de chia'], nota: 'Bowl de iogurte com aveia, fruta e chia.' },
    { roles: ['Tapioca', 'cafeProteina', 'cafeFruta'], nota: 'Tapioca recheada com proteína e uma fruta.' },
    { roles: ['Aveia', 'Leite', 'Banana', 'Pasta de amendoim'], nota: 'Mingau de aveia com banana e pasta de amendoim.' },
  ],
  lanche: [
    { roles: ['lancheFruta', 'lancheGordura'], nota: 'Fruta com uma porção pequena de oleaginosas.' },
    { roles: ['Iogurte natural', 'lancheFruta'], nota: 'Iogurte com fruta.' },
    { roles: ['Pão integral', 'Pasta de amendoim'], nota: 'Pão integral com pasta de amendoim.' },
    { roles: ['lancheFruta', 'Aveia', 'Sementes de chia'], nota: 'Fruta picada com aveia e chia.' },
  ],
  ceia: [
    { roles: ['ceiaProteina', 'Morango'], nota: 'Ceia leve com proteína e fruta.' },
    { roles: ['lancheFruta', 'Castanhas'], nota: 'Ceia leve com fruta e poucas castanhas.' },
    { roles: ['Iogurte natural', 'Mamão'], nota: 'Ceia leve com iogurte e mamão.' },
  ],
};
const MEAL_UNITS = { ovos: [50, 'unidade', 'unidades'], 'pao integral': [30, 'fatia', 'fatias'], banana: [100, 'unidade', 'unidades'], maca: [130, 'unidade', 'unidades'], laranja: [130, 'unidade', 'unidades'] };
const SCALABLE_GROUPS = ['carboidrato', 'proteina', 'leguminosa'];

function alimentosDisponiveis(usuario) {
  const disponiveis = filtroAlimentos(usuario);
  const porNome = new Map(disponiveis.map(food => [normalizeName(food.nome), food]));
  const gosta = new Set(toList(usuario.gosta).map(normalizeName));
  return { porNome, gosta };
}
function candidatosDoPapel(papel, contexto) {
  const nomes = MEAL_ROLES[papel] || [papel];
  const lista = nomes.map(nome => contexto.porNome.get(normalizeName(nome))).filter(Boolean);
  // Alimentos marcados como "gosto" aparecem com mais frequência, sem eliminar a variedade.
  return [...lista.filter(food => contexto.gosta.has(normalizeName(food.nome))), ...lista];
}
function escolherDoPapel(papel, contexto, indice, usados, permitirRepeticao = true) {
  const candidatos = candidatosDoPapel(papel, contexto);
  const usadosNoDia = contexto.usadosNoDia || new Set();
  // Primeiro tenta um alimento que ainda não apareceu no dia; só repete se não houver outra opção.
  for (const evitarRepeticao of permitirRepeticao ? [true, false] : [true]) {
    for (let passo = 0; passo < candidatos.length; passo++) {
      const food = candidatos[(indice + passo) % candidatos.length];
      const key = normalizeName(food.nome);
      if (usados.has(key) || (evitarRepeticao && usadosNoDia.has(key))) continue;
      return { food, alternativas: candidatos.filter(item => item !== food && !usados.has(normalizeName(item.nome))) };
    }
  }
  return null;
}
function itemDoCardapio(food, alternativas) {
  const vistas = new Set([normalizeName(food.nome)]);
  const substituicoes = [];
  for (const item of alternativas) {
    const key = normalizeName(item.nome);
    if (!vistas.has(key)) { vistas.add(key); substituicoes.push(item.nome); }
    if (substituicoes.length === 2) break;
  }
  return { nome: food.nome, categoria: food.categoria, substituicoes };
}
function montarPorModelo(slot, contexto, dia) {
  const modelos = MEAL_TEMPLATES[slot];
  const usadosNoDia = contexto.usadosNoDia || new Set();
  let melhor = null;
  for (let tentativa = 0; tentativa < modelos.length; tentativa++) {
    const modelo = modelos[(dia + (slot === 'lanche' ? contexto.lancheOffset : 0) + tentativa) % modelos.length];
    const usados = new Set();
    const alimentos = [];
    modelo.roles.forEach((papel, posicao) => {
      const escolha = escolherDoPapel(papel, contexto, dia * 3 + posicao + (slot === 'lanche' ? contexto.lancheOffset : 0), usados);
      if (!escolha) return;
      usados.add(normalizeName(escolha.food.nome));
      alimentos.push(itemDoCardapio(escolha.food, escolha.alternativas));
    });
    if (alimentos.length < Math.min(2, modelo.roles.length)) continue;
    // Prefere o modelo que menos repete alimentos já usados em outras refeições do mesmo dia.
    const repeticoes = alimentos.filter(item => usadosNoDia.has(normalizeName(item.nome))).length;
    if (!melhor || repeticoes < melhor.repeticoes) melhor = { alimentos, nota: modelo.nota, repeticoes };
    if (repeticoes === 0) break;
  }
  if (!melhor) return { alimentos: [], nota: '' };
  melhor.alimentos.forEach(item => usadosNoDia.add(normalizeName(item.nome)));
  return { alimentos: melhor.alimentos, nota: melhor.nota };
}
function montarRefeicaoPrincipal(slot, contexto, dia) {
  const usados = new Set();
  const alimentos = [];
  const adicionar = (papel, indice, permitirRepeticao = true) => {
    const escolha = escolherDoPapel(papel, contexto, indice, usados, permitirRepeticao);
    if (!escolha) return null;
    usados.add(normalizeName(escolha.food.nome));
    alimentos.push(itemDoCardapio(escolha.food, escolha.alternativas));
    return escolha.food;
  };
  const almoco = slot === 'almoco';
  // Almoço e jantar usam deslocamentos diferentes para não repetir a mesma proteína e o mesmo carboidrato no dia.
  const carbo = adicionar('principalCarbo', almoco ? dia : dia + 3);
  const semCarne = !candidatosDoPapel('principalProteina', contexto).some(food => food.vegetariano === false);
  const temMacarrao = carbo && normalizeName(carbo.nome) === 'macarrao';
  const leguminosa = (almoco || semCarne) && !temMacarrao ? adicionar('leguminosa', almoco ? dia : dia + 1) : null;
  // Com leguminosa no prato, a proteína só entra se não repetir outra refeição do dia.
  adicionar('principalProteina', almoco ? dia * 2 : dia * 2 + 1, !leguminosa);
  adicionar('folhas', almoco ? dia : dia + 2);
  adicionar('legumes', almoco ? dia : dia + 3);
  if (almoco) adicionar('Azeite', 0);
  alimentos.forEach(item => contexto.usadosNoDia?.add(normalizeName(item.nome)));
  const nota = almoco
    ? 'Prato principal: carboidrato, leguminosa, proteína e vegetais. Azeite em pequena quantidade.'
    : 'Jantar com a mesma base do almoço, trocando proteína, carboidrato e vegetais.';
  return { alimentos, nota };
}
function porcaoAjustada(nome, fator, categoria) {
  const meta = getFoodMacroMeta(nome);
  const base = meta.portion || 150;
  const grupo = FOOD_LIBRARY.find(food => normalizeName(food.nome) === normalizeName(nome))?.grupos || [categoria];
  if (!grupo.some(item => SCALABLE_GROUPS.includes(item))) return base;
  const unidade = MEAL_UNITS[normalizeName(nome)];
  if (unidade) return Math.max(unidade[0], Math.round(base * fator / unidade[0]) * unidade[0]);
  return Math.max(10, Math.round(base * fator / 10) * 10);
}
function descreverPorcao(alimento) {
  const gramas = alimento.porcao || getFoodMacroMeta(alimento.nome).portion || 150;
  const unidade = MEAL_UNITS[normalizeName(alimento.nome)];
  if (!unidade) return gramas + ' g';
  const quantidade = Math.max(1, Math.round(gramas / unidade[0]));
  return gramas + ' g · ' + quantidade + ' ' + (quantidade === 1 ? unidade[1] : unidade[2]);
}
function snapshotDoCardapio(alimento) {
  const snapshot = getMealFoodSnapshot(alimento.nome);
  if (!alimento.porcao || alimento.porcao === snapshot.portion) return snapshot;
  const proporcao = alimento.porcao / snapshot.portion;
  return { ...snapshot, portion: alimento.porcao, calories: snapshot.calories * proporcao, protein: snapshot.protein * proporcao, carbs: snapshot.carbs * proporcao, fat: snapshot.fat * proporcao };
}
function montagemPorRefeicao(usuario, tipoRefeicao, diaTipo, dia, contexto = { ...alimentosDisponiveis(usuario), lancheOffset: 0, usadosNoDia: new Set() }) {
  const slot = MEAL_SLOT[tipoRefeicao] || 'lanche';
  const resultado = slot === 'almoco' || slot === 'jantar' ? montarRefeicaoPrincipal(slot, contexto, dia) : montarPorModelo(slot, contexto, dia);
  let nota = resultado.nota;
  if (diaTipo === 'Treino' && (tipoRefeicao === 'Lanche da tarde' || tipoRefeicao === 'Lanche')) nota += ' Em dia de treino, pode ser feito 1 a 2 horas antes da atividade.';
  return { alimentos: resultado.alimentos, observacao: nota || 'Sugestão equilibrada.' };
}
function ajustarPorcoes(plano, metaCalorias) {
  return plano.map(dia => {
    const base = dia.refeicoes.reduce((total, refeicao) => total + refeicao.alimentos.reduce((soma, item) => soma + getMealFoodSnapshot(item.nome).calories, 0), 0);
    // O ajuste usa a meta informada no perfil, limitado entre 80% e 125% das porções médias para evitar extremos.
    const fator = metaCalorias > 0 && base > 0 ? Math.min(1.25, Math.max(0.8, metaCalorias / base)) : 1;
    return { ...dia, refeicoes: dia.refeicoes.map(refeicao => ({ ...refeicao, alimentos: refeicao.alimentos.map(item => ({ ...item, porcao: porcaoAjustada(item.nome, fator, item.categoria) })) })) };
  });
}
function validarPlanoAlimentar(plano, usuario) {
  const alertas = [];
  const problemas = [];
  const sugestoes = [];
  const restricoes = toList(usuario.restricoesAlimentares).concat(toList(usuario.restrictions)).map(normalizeName);
  const alergias = toList(usuario.alergias).map(normalizeName);
  const dislikes = toList(usuario.naoGosta).map(normalizeName);
  const refeicoesPorDia = Number(usuario.refeicoesPorDia) || 4;

  if (!plano || !Array.isArray(plano) || !plano.length) {
    return { valido: false, alertas: ['Plano alimentar vazio.'], problemas: ['Sem dias no plano.'], sugestoes: ['Gerar uma nova sugestão.'] };
  }

  plano.forEach((dia) => {
    if (!dia.refeicoes || !dia.refeicoes.length) {
      problemas.push(`${dia.dia} ficou sem refeições.`);
      return;
    }
    if (dia.refeicoes.length < Math.min(refeicoesPorDia, 2) || dia.refeicoes.length > 6) {
      problemas.push(`${dia.dia} não está adequadamente organizado para a preferência de refeições.`);
    }
    dia.refeicoes.forEach((refeicao) => {
      if (!refeicao.alimentos || !refeicao.alimentos.length) {
        problemas.push(`${dia.dia} — ${refeicao.nome} sem alimentos.`);
        return;
      }
      const slot = MEAL_SLOT[refeicao.nome];
      const horariosAceitos = slot === 'ceia' ? ['lanche', 'cafe'] : [slot];
      refeicao.alimentos.forEach((alimento) => {
        const nome = normalizeName(alimento.nome);
        const referencia = FOOD_LIBRARY.find(food => normalizeName(food.nome) === nome);
        if (slot && referencia && !referencia.refeicoesIndicadas.includes('todos') && !referencia.refeicoesIndicadas.some(item => horariosAceitos.includes(item))) {
          problemas.push(`${dia.dia} — ${alimento.nome} não é indicado para ${refeicao.nome.toLowerCase()}.`);
        }
        if (dislikes.some(item => nome.includes(item))) {
          problemas.push(`${dia.dia} — ${refeicao.nome} inclui alimento marcado como não gostado.`);
          sugestoes.push(`Substituir ${alimento.nome} por ${buscarSubstituicoes(alimento.nome)[0] || 'alternativa similar'}.`);
        }
        if (restricoes.some(item => nome.includes(item) || item.includes(nome))) {
          problemas.push(`${dia.dia} — ${refeicao.nome} tem alimento incompatível com restrição.`);
          alertas.push('Foi identificado um alimento incompatível com uma restrição informada.');
        }
        if (alergias.some(item => nome.includes(item) || item.includes(nome))) {
          problemas.push(`${dia.dia} — ${refeicao.nome} inclui alimento associado à alergia.`);
          alertas.push('As sugestões foram adaptadas às informações fornecidas, mas condições de saúde, alergias, intolerâncias e necessidades específicas devem ser avaliadas por um profissional qualificado.');
        }
      });
    });
  });

  const valido = problems => problems.length === 0;
  return {
    valido: valido(problemas),
    alertas: [...new Set(alertas)],
    problemas: [...new Set(problemas)],
    sugestoes: [...new Set(sugestoes)]
  };
}
function gerarPlanoAlimentar(usuario, treino = null) {
  const user = { ...state.profile, ...usuario };
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const refeicoesPorDia = Math.min(6, Math.max(3, Number(user.refeicoesPorDia) || 4));
  const layout = MEAL_LAYOUTS[refeicoesPorDia] || MEAL_LAYOUTS[4];
  const treinoSemana = Array.isArray(treino?.semana) ? treino.semana : [];
  const disponiveis = alimentosDisponiveis(user);
  const plano = dias.map((dia, index) => {
    const diaTreino = treinoSemana[index];
    const tipo = diaTreino && diaTreino.treino !== 'Recuperação' ? 'Treino' : 'Descanso';
    let lanches = 0;
    const usadosNoDia = new Set();
    const refeicoes = layout.map((nome) => {
      // Dois lanches no mesmo dia começam em modelos diferentes.
      const lancheOffset = MEAL_SLOT[nome] === 'lanche' ? 2 * lanches++ : 0;
      const montagem = montagemPorRefeicao(user, nome, tipo, index, { ...disponiveis, lancheOffset, usadosNoDia });
      return { nome, horario: MEAL_TIMES[nome] || '', alimentos: montagem.alimentos, observacao: montagem.observacao };
    });
    return { dia, tipo, refeicoes };
  });

  const variação = ajustarPorcoes(plano, Number(user.calories) || 0);
  const validacao = validarPlanoAlimentar(variação, user);
  const observacoes = [
    'Este plano apresenta sugestões de organização alimentar e não substitui acompanhamento profissional.',
    'Priorize hidratação ao longo do dia e ajuste a ingestão conforme sede, atividade física, clima e orientação profissional.'
  ];

  if (user.athlete && user.athletePhase === 'pré-competição') {
    observacoes.push('⚠️ Estratégias específicas de preparação para competição devem ser acompanhadas por nutricionista e equipe profissional.');
  }

  if (validacao.alertas.length) {
    observacoes.push('⚠️ As sugestões foram adaptadas às informações fornecidas, mas condições de saúde, alergias, intolerâncias e necessidades específicas devem ser avaliadas por um profissional qualificado.');
  }

  return {
    versao: 2,
    usuario: {
      idade: Number(user.age) || 0,
      peso: Number(user.weight) || 0,
      altura: Number(user.height) || 0,
      nivel: user.experience || 'iniciante',
      objetivo: user.goal || 'geral',
      atleta: Boolean(user.athlete),
      diasDisponiveis: Number(user.daysAvailable) || 3,
      refeicoesPorDia: refeicoesPorDia,
      restricoes: toList(user.restricoesAlimentares).concat(toList(user.restrictions)),
      alergias: toList(user.alergias),
      gosta: toList(user.gosta),
      naoGosta: toList(user.naoGosta)
    },
    plano: variação,
    alertas: validacao.alertas,
    problemas: validacao.problemas,
    observacoes,
    sugestoes: validacao.sugestoes,
    validacao,
    hidracao: 'Priorize hidratação ao longo do dia e ajuste a ingestão conforme sede, atividade física, clima e orientação profissional.'
  };
}
function renderNutritionPlan(plan) {
  if (!plan || !plan.plano) return empty('Preencha seu perfil e gere uma sugestão alimentar semanal para visualizar a organização das refeições.');

  const formatDaySummary = (dia) => {
    const totals = dia.refeicoes.reduce((sum, refeicao) => {
      refeicao.alimentos.forEach((alimento) => {
        const snapshot = snapshotDoCardapio(alimento);
        sum.kcal += snapshot.calories;
        sum.protein += snapshot.protein;
        sum.carbs += snapshot.carbs;
        sum.fat += snapshot.fat;
      });
      return sum;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });

    return `
      <div class="day-total">
        <span>Total do dia</span>
        <strong>${num(Math.round(totals.kcal))} kcal</strong>
        <small>${num(Math.round(totals.protein))} g proteína · ${num(Math.round(totals.carbs))} g carbo · ${num(Math.round(totals.fat))} g gordura</small>
      </div>
    `;
  };

  return `<section class="panel nutrition-plan">
    <div class="panel-head"><div><p class="eyebrow orange">ORGANIZAÇÃO ALIMENTAR</p><h3>Planejamento semanal sugerido</h3></div></div>
    ${plan.versao === 2 ? '' : '<p class="notice plan-outdated">Este cardápio foi criado pela versão anterior do gerador. Gere uma nova sugestão para ver as refeições organizadas por horário, com porções e trocas.</p>'}
    <div class="meal-plan-grid">${plan.plano.map((dia) => `
      <article class="meal-day">
        <div class="meal-day-header">
          <div>
            <strong>${esc(dia.dia)}</strong>
            <span>${esc(dia.tipo)}</span>
          </div>
          <small>${esc(dia.refeicoes.length)} refeições</small>
        </div>
        ${formatDaySummary(dia)}
        ${dia.refeicoes.map((refeicao) => `
          <div class="meal-block">
            <div class="meal-block-head">
              <h4>${esc(refeicao.nome)}${refeicao.horario ? ` <small class="meal-time">${esc(refeicao.horario)}</small>` : ''}</h4>
              <span>${num(Math.round(refeicao.alimentos.reduce((sum, item) => sum + snapshotDoCardapio(item).calories, 0)))} kcal</span>
            </div>
            <ul class="meal-list">${refeicao.alimentos.map((alimento) => {
              const snapshot = snapshotDoCardapio(alimento);
              return `<li class="food-row">
                <div>
                  <strong>${esc(alimento.nome)}</strong>
                  <small>Porção · ${esc(descreverPorcao(alimento))}</small>
                  ${alimento.substituicoes?.length ? `<small class="food-swap">Troca: ${alimento.substituicoes.map(item => esc(item)).join(' ou ')}</small>` : ''}
                </div>
                <div class="food-macros">
                  <span>${num(Math.round(snapshot.calories))} kcal</span>
                  <span>${num(Math.round(snapshot.protein))} g prot</span>
                  <span>${num(Math.round(snapshot.fat))} g gord</span>
                </div>
              </li>`;
            }).join('')}</ul>
            <small class="meal-note">${esc(refeicao.observacao || 'Sugestão equilibrada.')}</small>
          </div>
        `).join('')}
      </article>
    `).join('')}</div>
    <div class="hydration-box">
      <strong>Hidratação</strong>
      <p>${esc(plan.hidracao || 'Priorize hidratação ao longo do dia e ajuste a ingestão conforme sede, atividade física, clima e orientação profissional.')}</p>
    </div>
    ${plan.alertas.length ? `<div class="alert-warning">${plan.alertas.map(alert => esc(alert)).join('<br>')}</div>` : ''}
    ${plan.observacoes.length ? `<div class="nutrition-observacoes"><ul>${plan.observacoes.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>` : ''}
  </section>`;
}
function renderPlan(plan) {
  if (!plan || !plan.semana) return empty('Preencha seu perfil e gere uma sugestão de treino semanal.');
  return `<section class="generated-plan" aria-labelledby="generated-plan-title">
  <header class="generated-plan-title">
    <p class="eyebrow orange">PLANO GERADO PARA VOCÊ</p>
    <h2 id="generated-plan-title">Treino inteligente da semana</h2>
    <p>Confira a divisão, os exercícios e as orientações antes de iniciar.</p>
  </header>
  <div class="plan-summary">
    <div class="plan-meta"><strong>Divisão:</strong> ${esc(plan.divisao)}</div>
    <div class="plan-meta"><strong>Foco:</strong> ${esc(plan.foco || 'equilibrado')}</div>
    <div class="plan-meta"><strong>Intensidade:</strong> ${esc(plan.intensidade || 'moderada')}</div>
  </div>
  <div class="plan-grid">${plan.semana.map((day) => `
    <article class="plan-item">
      <div class="plan-header">
        <strong>${esc(day.dia)}</strong>
        <span>${esc(day.treino)}</span>
      </div>
      ${day.exercicios.length ? day.exercicios.map((ex) => `
        <div class="plan-exercise">
          <h4>${esc(ex.nome)}</h4>
          <p>${esc(ex.grupo)} · ${esc(ex.tipo)} · ${esc(ex.equipamento)}</p>
          ${ex.instrucoes ? `<p class="plan-instructions">${esc(ex.instrucoes)}</p>` : ''}
          <small>${esc(ex.series)} séries × ${esc(ex.repeticoes)} repetições<br>Descanso: ${esc(ex.descanso)} · ${esc(ex.intensidade || 'moderada')}</small>
        </div>
      `).join('') : '<div class="plan-exercise"><p>Recuperação ativa e mobilidade.</p></div>'}
    </article>
  `).join('')}</div>
  </section>`;
}
let modalAction = ''; function openModal(action) {
    modalAction = action; let html = '', name = ''; const opts = arr => arr.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join('');
    if (action === 'exercise') {
      name = 'Novo exercício';
      const exerciseNames = [...new Set([...EXERCISE_LIBRARY.map((exercise) => exercise.nome), ...state.exercises.map((exercise) => exercise.name)])].sort((first, second) => first.localeCompare(second, 'pt-BR'));
      const exerciseOptions = '<option value="" selected disabled>Selecione um exercício</option>' + exerciseNames.map((exerciseName) => `<option value="${esc(exerciseName)}">${esc(exerciseName)}</option>`).join('') + '<option value="__other__">Outros</option>';
      const groupOptions = '<option value="" selected disabled>Selecione um grupo muscular</option>' + EXERCISE_GROUPS.map(([value, label]) => `<option value="${value}">${label}</option>`).join('') + '<option value="__other__">Outros</option>';
      html = selectField('exerciseName', 'Nome do exercício', exerciseOptions)
        + '<div id="custom-exercise-name" hidden>' + field('customExerciseName', 'Digite o nome do exercício', 'text', '', 'maxlength="80" disabled') + '</div>'
        + selectField('exerciseGroup', 'Grupo muscular', groupOptions)
        + '<div id="custom-exercise-group" hidden>' + field('customExerciseGroup', 'Digite o grupo muscular', 'text', '', 'maxlength="60" disabled') + '</div>'
        + selectField('type', 'Tipo', '<option value="strength">Força</option><option value="cardio">Cardio</option>');
    }
    if (action === 'workout') { if (!state.exercises.length) { toast('Cadastre um exercício antes de montar um treino.'); openModal('exercise'); return } name = 'Monte sua sequência'; html = field('name', 'Nome do treino', 'text', '', 'maxlength="80"') + '<fieldset><legend>Exercícios</legend>' + state.exercises.map(x => `<label class="check"><input type="checkbox" name="exercises" value="${x.id}">${esc(x.name)}</label>`).join('') + '</fieldset>' }
    if (action === 'execution') { if (!state.exercises.length) { toast('Cadastre o primeiro exercício para registrar sua execução.'); openModal('exercise'); return } name = 'Seu esforço de hoje'; html = selectField('exerciseId', 'Exercício', opts(state.exercises)) + dateField() + '<div id="execution-fields"></div>' }
    if (action === 'food') { name = 'Novo alimento'; html = field('name', 'Nome do alimento', 'text', '', 'maxlength="80" list="food-suggestions" autocomplete="off"') + `<datalist id="food-suggestions">${FOOD_LIBRARY.filter(food => FOOD_MACRO_DB[food.nome.toLowerCase()]?.kcal > 0).map(food => `<option value="${esc(food.nome)}"></option>`).join('')}</datalist>` + '<p class="help">Todos os valores são <strong>por 100 g</strong> do alimento. Escolha um item da lista para preencher automaticamente ou digite os seus. Macronutrientes podem ser zero.</p>' + field('calories', 'Calorias por 100 g (kcal)', 'number', '', 'min="0.1" max="900" step="any"') + '<div class="form-grid">' + field('protein', 'Proteínas por 100 g (g)', 'number', '', 'min="0" max="100" step="any"') + field('carbs', 'Carboidratos por 100 g (g)', 'number', '', 'min="0" max="100" step="any"') + field('fat', 'Gorduras por 100 g (g)', 'number', '', 'min="0" max="100" step="any"') + '</div>' }
    if (action === 'meal') { if (!state.foods.length) { toast('Cadastre um alimento antes de registrar a refeição.'); openModal('food'); return } name = 'O que você comeu?'; html = selectField('foodId', 'Alimento', opts(state.foods)) + selectField('meal', 'Refeição', ['Café da manhã', 'Almoço', 'Lanche', 'Jantar', 'Ceia'].map(m => `<option>${m}</option>`).join('')) + field('time', 'Horário de referência', 'time', '07:00') + field('quantity', 'Quantidade consumida (g)', 'number', '', 'min="1" max="3000" step="any"') + dateField() }
    if (action === 'weight') { name = 'Registre seu peso'; html = field('weight', 'Peso (kg)', 'number', '', 'min="20" max="500" step="any"') + dateField() }
    $('#modal-title').textContent = name; $('#modal-form').innerHTML = html + '<p class="error" id="form-error" role="alert"></p><button class="button" type="submit">Salvar registro</button>'; $('#modal').showModal(); if (action === 'food') { $('#f-name').addEventListener('input', event => { const meta = Object.entries(FOOD_MACRO_DB).find(([nome]) => normalizeName(nome) === normalizeName(event.target.value))?.[1]; if (!meta) return; $('#f-calories').value = meta.kcal; $('#f-protein').value = meta.protein; $('#f-carbs').value = meta.carbs; $('#f-fat').value = meta.fat }) } if (action === 'execution') { const change = () => { const ex = state.exercises.find(x => x.id === $('#f-exerciseId').value); $('#execution-fields').innerHTML = '<div class="form-grid">' + (ex.type === 'strength' ? field('sets', 'Séries', 'number', 3, 'min="1" step="1"') + field('reps', 'Repetições', 'number', 10, 'min="1" step="1"') + field('load', 'Carga (kg)', 'number', '', positive) : field('distance', 'Distância (km)', 'number', '', positive)) + field('minutes', 'Duração do exercício (min)', 'number', '', positive) + '</div>' }; $('#f-exerciseId').onchange = change; change() }
}
$('#modal-form').onsubmit = e => { e.preventDefault(); const fd = new FormData(e.target), id = uid(); try { if (modalAction === 'exercise') { const name = String(fd.get('name')).trim(), group = String(fd.get('group')).trim(); if (!name || !group) throw Error('Preencha o nome e o grupo muscular.'); state.exercises.push({ id, name, group, type: fd.get('type') }) } if (modalAction === 'workout') { const ids = fd.getAll('exercises'), name = String(fd.get('name')).trim(); if (!name || !ids.length) throw Error('Dê um nome ao treino e selecione pelo menos um exercício.'); state.workouts.push({ id, name, exerciseIds: ids }) } if (modalAction === 'execution') { const ex = state.exercises.find(x => x.id === fd.get('exerciseId')); if (!ex) throw Error('Selecione um exercício válido.'); const x = { id, exerciseId: ex.id, name: ex.name, type: ex.type, date: readDate(fd), minutes: readNum(fd, 'minutes'), created: Date.now() }; if (ex.type === 'strength') { x.sets = readNum(fd, 'sets'); x.reps = readNum(fd, 'reps'); x.load = readNum(fd, 'load'); if (!Number.isInteger(x.sets) || !Number.isInteger(x.reps)) throw Error('Séries e repetições precisam ser inteiras.') } else x.distance = readNum(fd, 'distance'); state.executions.push(x) } if (modalAction === 'food') { const name = String(fd.get('name')).trim(); if (!name) throw Error('Informe o nome do alimento.'); state.foods.push({ id, name, calories: readNum(fd, 'calories'), protein: readNum(fd, 'protein', true), carbs: readNum(fd, 'carbs', true), fat: readNum(fd, 'fat', true) }) } if (modalAction === 'meal') { const f = state.foods.find(x => x.id === fd.get('foodId')); if (!f) throw Error('Selecione um alimento válido.'); state.meals.push({ id, foodId: f.id, snapshot: { ...f }, meal: String(fd.get('meal')), quantity: readNum(fd, 'quantity'), date: readDate(fd) }) } if (modalAction === 'weight') { const w = { id, weight: readNum(fd, 'weight'), date: readDate(fd) }; const i = state.weights.findIndex(x => x.date === w.date); if (i >= 0) state.weights[i] = w; else state.weights.push(w) } if (save()) { $('#modal').close(); notify() } } catch (err) { $('#form-error').textContent = err.message } };
function saveSelectedExercise(event) {
  if (event.target.id !== 'modal-form' || modalAction !== 'exercise') return;

  event.preventDefault();
  event.stopImmediatePropagation();
  const formData = new FormData(event.target);
  const selectedName = String(formData.get('exerciseName') || '');
  const selectedGroup = String(formData.get('exerciseGroup') || '');
  const name = selectedName === '__other__'
    ? String(formData.get('customExerciseName') || '').trim()
    : selectedName;
  const group = selectedGroup === '__other__'
    ? String(formData.get('customExerciseGroup') || '').trim()
    : EXERCISE_GROUPS.find(([value]) => value === selectedGroup)?.[1];

  if (!name || !group) {
    $('#form-error').textContent = 'Selecione um exercício e um grupo ou informe os nomes em “Outros”.';
    return;
  }

  const duplicate = state.exercises.some(exercise => normalizeName(exercise.name) === normalizeName(name) && normalizeName(exercise.group) === normalizeName(group));
  if (duplicate) {
    $('#form-error').textContent = 'Esse exercício já está na sua biblioteca com o mesmo grupo muscular.';
    return;
  }

  state.exercises.push({
    id: uid(),
    name,
    group,
    type: String(formData.get('type') || 'strength'),
  });

  if (save()) {
    $('#modal').close();
    notify();
  }
}

document.addEventListener('submit', saveSelectedExercise, true);

function saveMealWithReferenceTime(event) {
  if (event.target.id !== 'modal-form' || modalAction !== 'meal') return;

  event.preventDefault();
  event.stopImmediatePropagation();
  const formData = new FormData(event.target);
  const food = state.foods.find((item) => item.id === formData.get('foodId'));
  const meal = String(formData.get('meal') || '');
  const time = String(formData.get('time') || '');
  const quantity = readNum(formData, 'quantity');
  const date = readDate(formData);

  if (!food) {
    $('#form-error').textContent = 'Selecione um alimento cadastrado.';
    return;
  }
  if (!['Café da manhã', 'Almoço', 'Lanche', 'Jantar', 'Ceia'].includes(meal)) {
    $('#form-error').textContent = 'Selecione o tipo de refeição.';
    return;
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    $('#form-error').textContent = 'Informe um horário válido.';
    return;
  }

  state.meals.push({
    id: uid(),
    foodId: food.id,
    snapshot: { ...food },
    meal,
    time,
    quantity,
    date,
  });

  if (save()) {
    $('#modal').close();
    notify();
  }
}

document.addEventListener('submit', saveMealWithReferenceTime, true);

function demo() { if (!confirm('Carregar exemplos substituirá os registros atuais neste navegador. Continuar?')) return; state = fresh(); state.demo = true; state.profile = { ...fresh().profile, name: 'Atleta', weight: 78.4, target: 75, calories: 2200, age: 28, height: 178, activityLevel: 'moderado', daysAvailable: 4, refeicoesPorDia: 5 }; const e1 = { id: uid(), name: 'Agachamento livre', group: 'Pernas', type: 'strength' }, e2 = { id: uid(), name: 'Supino reto', group: 'Peito', type: 'strength' }, e3 = { id: uid(), name: 'Corrida', group: 'Condicionamento', type: 'cardio' }; state.exercises = [e1, e2, e3]; state.workouts = [{ id: uid(), name: 'Força & consistência', exerciseIds: [e1.id, e2.id] }, { id: uid(), name: 'Cardio essencial', exerciseIds: [e3.id] }]; state.foods = [{ id: uid(), name: 'Arroz cozido', calories: 130, protein: 2.7, carbs: 28, fat: .3 }, { id: uid(), name: 'Frango grelhado', calories: 165, protein: 31, carbs: 0, fat: 3.6 }, { id: uid(), name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: .3 }]; dates(7).forEach((d, i) => { state.weights.push({ id: uid(), date: d, weight: 79.1 - i * .12 }); state.foods.forEach((f, j) => state.meals.push({ id: uid(), foodId: f.id, snapshot: { ...f }, date: d, meal: ['Almoço', 'Jantar', 'Lanche'][j], quantity: j === 0 ? [180, 150, 200, 160, 180, 150, 170][i] : j === 1 ? 150 : 120 })); if (i % 2 === 0) state.executions.push({ id: uid(), exerciseId: e1.id, name: e1.name, type: e1.type, date: d, created: i, minutes: 30, sets: 4, reps: 10, load: 40 + i * 2 }); if (i === 1 || i === 5) state.executions.push({ id: uid(), exerciseId: e3.id, name: e3.name, type: e3.type, date: d, created: i, minutes: 25, distance: i === 1 ? 3 : 3.5 }) }); save(); render(); toast('Demonstração carregada. Explore os módulos.'); }
document.addEventListener('click', e => { const a = e.target.closest('[data-action]'); if (a) { const action = a.dataset.action; if (['exercise', 'workout', 'execution', 'food', 'meal', 'weight'].includes(action)) openModal(action); if (action === 'demo') demo(); if (action === 'generate-plan') { try { const plan = buildSmartWorkoutPlan(); state.generatedPlan = plan; if (save()) { render(); toast('Treino semanal gerado com sucesso.'); } } catch (err) { toast(err.message); } } if (action === 'generate-nutrition-plan') { try { const plan = gerarPlanoAlimentar(state.profile, state.generatedPlan || { semana: [] }); state.nutritionPlan = plan; if (save()) { render(); toast('Plano alimentar gerado com sucesso.'); } } catch (err) { toast(err.message || 'Não foi possível gerar o plano alimentar.'); } } if (action === 'reset' && confirm('Apagar todos os registros deste navegador? Essa ação não pode ser desfeita.')) { state = fresh(); if (save()) { render(); toast('Dados apagados. Comece seus próprios registros.') } } if (action === 'export') { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'forja-registros.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) } } const rem = e.target.closest('[data-remove]'); if (rem) { const [k, id] = rem.dataset.remove.split(':'); if (k === 'foods' && state.meals.some(m => m.foodId === id)) { toast('Este alimento está no histórico. Exclua os registros relacionados antes.'); return } if (k === 'exercises' && (state.executions.some(x => x.exerciseId === id) || state.workouts.some(w => w.exerciseIds.includes(id)))) { toast('Este exercício está em um treino ou histórico. Remova esses vínculos antes.'); return } if (confirm('Excluir este registro?')) { state[k] = state[k].filter(x => x.id !== id); if (save()) { render(); toast('Registro excluído.') } } } });
$('#close-modal').onclick = () => $('#modal').close(); window.addEventListener('hashchange', () => { render(); window.scrollTo({ top: 0, behavior: 'instant' }) }); let ticking = false; window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(() => { const h = document.documentElement.scrollHeight - innerHeight; $('.scroll-progress').style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; const im = $('.hero-photo'); if (im && !matchMedia('(prefers-reduced-motion: reduce)').matches) im.style.transform = `translateY(${Math.min(scrollY * .13, 70)}px) scale(1.08)`; ticking = false }); ticking = true } }, { passive: true });
if (document.modelContext?.registerTool) { try { Promise.resolve(document.modelContext.registerTool({ name: 'read_fitness_summary', description: 'Read the displayed daily nutrition and training summary.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute(input) { if (!input || Object.keys(input).length) throw Error('Expected an empty object'); return { date: today(), nutrition: nutrition(today()), trainingEstimate: expenditure(today()), insight: insight() } } })).catch(() => { }) } catch { } }
