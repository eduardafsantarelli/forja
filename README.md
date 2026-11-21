# FORJA — Treino & Nutrição

Aplicação web para acompanhar **treinos, alimentação e evolução de peso** em um só lugar, com login de usuário via Firebase. Projeto desenvolvido para um hackathon.

## Funcionalidades

- **Conta de usuário** com Firebase Authentication: cadastro, login e recuperação de senha por e-mail
- **Perfil** com peso, altura, idade, nível de atividade, objetivo e preferências de treino
- **Dashboard** com IMC calculado e sua classificação, além de checklist de metas diárias
- **Treinos:** cadastro de exercícios e rotinas, ou sugestão semanal gerada pelo app
- **Alimentação:** cadastro de alimentos (valores por 100 g) e registro de refeições com a quantidade consumida
- **Evolução:** histórico de peso e comparação semanal entre treino e variação de peso
- **Tema claro e escuro**, com a preferência salva no navegador
- **Dados de demonstração** (com confirmação antes de substituir os registros atuais) para explorar o app rapidamente

## Tecnologias

HTML5 · CSS3 · JavaScript · Firebase Authentication · Firebase Analytics · localStorage · Netlify

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

> A configuração web do Firebase não é uma senha: ela é feita para ficar no navegador. A proteção vem das regras do Firebase e da restrição da chave aos domínios do projeto no Google Cloud Console.

## Como os dados funcionam

- O **login** é validado pelo Firebase e funciona em qualquer navegador
- **Perfil, treinos, refeições e preferências** ficam no `localStorage` do navegador, separados pelo ID de cada usuário, e não são sincronizados entre dispositivos
- Em **Meu perfil > Apagar dados**, você limpa os registros da conta atual neste dispositivo

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
├── app.js          # lógica de treino, nutrição, evolução e perfil
├── experience.js   # interações e animações da interface
├── storage.js      # persistência local separada por usuário
├── firebase.js     # autenticação e Analytics
├── netlify.toml    # publicação e cabeçalhos de segurança
├── assets/         # imagem de destaque
└── img/            # imagens usadas no app
```

## Créditos

Foto de treino em `assets/strength.webp`: [Strength Per Second](https://strengthpersecond.com/).
