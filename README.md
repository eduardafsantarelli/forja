# FORJA — Treino & Nutrição

![CI](https://github.com/eduardafsantarelli/forja/actions/workflows/ci.yml/badge.svg)

Aplicação web para acompanhar **treinos, alimentação e evolução de peso** em um só lugar, com login de usuário via Firebase. Projeto desenvolvido para um hackathon.

## Funcionalidades

- **Conta de usuário** com Firebase Authentication: cadastro, login e recuperação de senha por e-mail
- **Perfil** com peso, altura, idade, nível de atividade, objetivo e preferências de treino
- **Dashboard** com IMC calculado e sua classificação, além de metas diárias editáveis (título, descrição e valor)
- **Treinos:** mapa muscular interativo, cadastro de exercícios e rotinas, histórico de treinos e sugestão semanal gerada pelo app
- **Alimentação:** cadastro de alimentos (valores por 100 g, com preenchimento automático para alimentos comuns), registro de refeições e cardápio semanal por horário com porções e trocas
- **Evolução:** histórico de peso e comparação semanal entre treino e variação de peso
- **Tema claro e escuro**, com a preferência salva no navegador
- **Treino ao vivo:** registro série por série com cronômetro de descanso, som e vibração; o treino em andamento sobrevive a recarregar a página
- **Demonstrações animadas** de todos os exercícios da biblioteca
- **Tabela TACO** (UNICAMP) com 591 alimentos para preencher calorias e macros automaticamente
- **Lista de compras** gerada do cardápio da semana, com quantidades somadas, para copiar ou imprimir
- **Hábitos:** água do dia com meta ajustável, sequência de dias ativos, 10 conquistas e resumo mensal em imagem para compartilhar
- **Medidas corporais** (cintura, quadril, peito, braço e coxa) com histórico e gráfico
- **Funciona sem internet** (service worker) e mostra um tour de boas-vindas no primeiro acesso
- **Privacidade:** política em linguagem simples e consentimento no cadastro, como pede a LGPD para dados de saúde
- **Dados de demonstração** (com confirmação antes de substituir os registros atuais) para explorar o app rapidamente
- **Backup e privacidade:** exportar os registros em JSON e apagar os dados da conta em **Meu perfil**
- **Sincronização entre aparelhos** pelo Cloud Firestore, quando ativado no projeto
- Pode ser **instalado no celular** (manifesto e ícones)

## Tecnologias

HTML5 · CSS3 · JavaScript · Firebase Authentication · Cloud Firestore · Firebase Analytics · localStorage · Netlify

## Como executar

O app é estático: basta servir a pasta por HTTP, porque o login do Firebase não funciona abrindo o arquivo direto (`file://`).

```bash
git clone https://github.com/eduardafsantarelli/forja.git
cd forja
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` e crie uma conta no primeiro acesso.

### Usando o seu próprio projeto Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e adicione um app Web
2. Substitua os valores de `firebaseConfig` em `firebase.js` pelos do seu projeto
3. Em **Authentication > Sign-in method**, habilite **E-mail/senha**
4. Em **Authentication > Settings > Authorized domains**, adicione o domínio onde o app será publicado
5. Para sincronizar entre aparelhos, crie o banco em **Firestore Database** e publique as regras do arquivo `firestore.rules` (aba **Regras**). Sem o banco, o app continua funcionando só com os dados do navegador

> A configuração web do Firebase não é uma senha: ela é feita para ficar no navegador. A proteção vem das regras do Firebase e da restrição da chave aos domínios do projeto no Google Cloud Console.

## Como os dados funcionam

- O **login** é validado pelo Firebase e funciona em qualquer navegador
- **Perfil, treinos, refeições e preferências** ficam no `localStorage` do navegador, separados pelo ID de cada usuário
- Com o Firestore ativo, uma cópia de cada conta fica em `usuarios/{uid}` e vale a versão alterada por último. As regras permitem que cada pessoa leia e grave apenas o próprio documento
- Em **Meu perfil > Backup e privacidade**, você exporta os registros ou apaga os dados da conta

## Testes

Os testes usam apenas o Node.js (versão 20 ou mais nova), sem dependências:

```bash
npm test        # cardápio, gerador de treino, gráficos, TACO, animações e hábitos
npm run check   # confere a sintaxe de todos os scripts
```

Os mesmos testes rodam automaticamente no GitHub Actions a cada envio (selo no topo).

## Cálculos usados

- **Gasto estimado do treino:** força 4 kcal/min e cardio 7 kcal/min
- **Balanço calórico:** consumo comparado com a meta diária somada ao gasto estimado
- **Progressão:** compara execuções do mesmo exercício. Força usa carga × repetições × séries; cardio usa distância

Os insights descrevem os registros e não substituem orientação profissional.

## Estrutura

```text
forja/
├── index.html      # estrutura da página e janelas de login
├── style.css       # estilos, temas claro/escuro e responsividade
├── app.js          # dados, cálculos e geradores de treino e cardápio
├── experience.js   # telas, interações e sincronização da interface
├── storage.js      # persistência local separada por usuário
├── firebase.js     # autenticação, sincronização (Firestore) e Analytics
├── firestore.rules # regras de acesso do banco
├── manifest.webmanifest # instalação no celular
├── privacidade.html # Política de Privacidade
├── sw.js           # funcionamento offline
├── js/             # recursos extras (treino ao vivo, animações, hábitos, alimentação, privacidade, tour)
├── data/taco.js    # Tabela Brasileira de Composição de Alimentos
├── tests/          # testes automatizados (node --test)
├── netlify.toml    # publicação e cabeçalhos de segurança
└── img/            # imagens (WebP) e ícones
```

## Créditos

Foto de treino: [Strength Per Second](https://strengthpersecond.com/).

Composição de alimentos: TACO, 4ª edição (NEPA/UNICAMP), a partir dos dados organizados em [isaquetdiniz/taco-api](https://github.com/isaquetdiniz/taco-api) (MIT).
