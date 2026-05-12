# 🏰 Torre de Londres

Aplicação web **single-page** inspirada na tarefa cognitiva **Torre de Londres** (*Tower of London*): três hastes com capacidades diferentes e três bolas coloridas (**verde**, **vermelho**, **azul**). O objetivo é reproduzir o **estado-alvo** exibido no topo da tela, partindo sempre do **mesmo estado inicial**, com o mínimo de movimentos possível.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss)

---

## 📸 Preview

<img width="1374" height="1272" alt="Captura de tela 2026-05-12 202554" src="https://github.com/user-attachments/assets/ff462547-dc82-4c6c-b172-f55edab74280" />


---

## ✨ Funcionalidades

- **Campanha com 35 níveis** — Sequência fixa de alvos definida em `src/exercises.js` (protocolo inspirado na figura de referência da tarefa).
- **Meta visível no topo** — Você compara a arena com o objetivo do nível atual em tempo real.
- **Mínimo de movimentos (BFS)** — Busca em largura no grafo de estados a partir do estado inicial até o alvo; a UI exibe esse mínimo e uma **eficiência** em relação aos seus movimentos atuais.
- **Capacidades por haste** — Esquerda até **3** bolas, centro **2**, direita **1**; só o **topo** de cada haste pode ser movido.
- **Controles de fluxo** — **Jogar nível** (seletor), **Reiniciar nível**, **Nível anterior** (ajusta o histórico) e **Reiniciar campanha**.
- **Feedback imediato** — Toasts com `react-hot-toast` ao acertar; overlay curto (~1 s) na transição para o próximo nível.
- **Tela de conclusão** — Ao terminar todos os exercícios, pontuação **0–100%** e lista **seus movimentos / mínimo** por nível.
- **Interface responsiva** — Mobile (`100dvh`, safe areas) e desktop; tema escuro com acentos ciano / violeta / esmeralda.
- **Ajuda in-app** — Seção colapsável **“Como funciona”** com as regras resumidas.

---

## 🎯 Regras em resumo

| Regra | Descrição |
|------|-----------|
| **Origem** | Só é possível pegar a bola do **topo** de uma haste não vazia. |
| **Destino** | Só é permitido empilhar numa haste que ainda tenha **vaga** (abaixo do limite). |
| **Capacidades** | Esquerda **3**, centro **2**, direita **1** bola. |
| **Vitória** | As três hastes ficam **iguais** ao alvo do nível (ordem das cores: **de baixo para cima** no código e na meta). |
| **Diferença vs. Hanói** | Não há restrição de “disco menor sobre maior”; as peças são identificadas por **cor**. |

---

## 🛠️ Tecnologias

- **React 19** — Interface e estado com hooks; composição em `App.jsx` e hook `useTowerGame`.
- **JavaScript (ES modules)** — Sem TypeScript neste repositório; arquivos `.jsx`.
- **Vite** — Servidor de desenvolvimento, HMR e build de produção (`@vitejs/plugin-react`).
- **Tailwind CSS 4** — Estilização via `@tailwindcss/vite`.
- **react-hot-toast** — Notificações ao concluir níveis.
- **ESLint** — Lint do código (configuração flat, plugins React Hooks e React Refresh).

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (recomendado alinhar à versão suportada pelo **Vite 8**; LTS 20.x ou 22.x é uma boa base).
- [npm](https://www.npmjs.com/) (vem com o Node) ou outro cliente compatível (`pnpm`, `yarn`).

---

## 🚀 Instalação

```bash
# Clone o repositório (substitua pela URL do seu fork/repositório)
git clone <URL_DO_SEU_REPOSITORIO>

# Entre na pasta do projeto
cd TorredeLondres

# Instale as dependências
npm install
```

---

## ▶️ Executando o projeto

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

Abra o endereço indicado no terminal (em geral `http://localhost:5173`).

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Gera o build otimizado em `dist/` |
| `npm run preview` | Serve localmente o conteúdo de `dist/` |
| `npm run lint` | Executa o ESLint no projeto |

---

## 📁 Estrutura do projeto

```
TorredeLondres/
├── index.html
├── package.json
├── vite.config.js          # React + Tailwind
├── eslint.config.js
├── public/                 # Assets estáticos (ex.: favicon)
└── src/
    ├── main.jsx            # createRoot + StrictMode
    ├── index.css           # Estilos globais / tema do jogo
    ├── App.jsx             # Layout: header, progresso, meta, arena, ajuda, overlay
    ├── exercises.js        # EXERCISES (35 alvos), EXERCISE_COUNT
    ├── constants/
    │   └── towerConstants.js   # INITIAL_STATE, PEG_LIMITS, PEG_VISUAL
    ├── utils/
    │   └── towerGameLogic.js   # Movimentos válidos, applyMove, BFS findMinimumMoves
    ├── hooks/
    │   └── useTowerGame.js     # Estado, pontuação, transições entre níveis
    └── components/
        ├── GameHeader.jsx
        ├── CampaignProgress.jsx
        ├── TargetObjectiveSection.jsx
        ├── GameArena.jsx
        ├── ArenaStats.jsx
        ├── GameHelp.jsx
        ├── CampaignCompleteScreen.jsx
        └── tower/                # Peg, PegRow, Ball, LevelTransitionOverlay
```

---

## 🎮 Como usar

1. Leia a **meta** no topo e compare com a **arena** (três hastes).
2. **Primeiro clique** numa haste com bola: seleciona a origem (topo). **Segundo clique** em outra haste: tenta mover (se houver vaga). **Mesma haste**: cancela a seleção.
3. Use **Jogar nível** para pular para um exercício (o histórico é ajustado), **Reiniciar nível** para o estado inicial do nível atual, **Nível anterior** para voltar um passo na campanha, ou **Reiniciar campanha** para zerar tudo.
4. Ao **acertar** o alvo, o jogo avança sozinho (com toast e overlay); no **último nível**, abre a tela **Campanha concluída** com sua **pontuação %** e o detalhe por nível.
5. Abra **“Como funciona”** no rodapé da tela para relembrar as regras sem sair do app.

**Estado inicial de cada nível:** esquerda — verde embaixo, vermelho no topo; centro — azul; direita — vazia (`INITIAL_STATE` em `towerConstants.js`).

---

## 🧮 Pontuação e histórico

A **pontuação final (0–100%)** é a média, por exercício concluído, de `mínimo ÷ max(movimentos do jogador, 1)`, vezes 100, arredondada. **100%** = cada nível resolvido com o **número mínimo** de movimentos.

Ao voltar com **Nível anterior** ou ao escolher um nível menor no seletor, entradas do histórico “à frente” do progresso são removidas.

---

## 📦 Build, deploy e contribuição

- A pasta **`dist/`** após `npm run build` pode ir para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, etc.).
- Se o app não ficar na **raiz** do domínio, ajuste a opção [`base`](https://vite.dev/config/shared-options.html#base) no Vite.
- Para estender o protocolo, edite **`src/exercises.js`** mantendo a ordem se o uso pedagógico depender dela. Limites e estado inicial: **`src/constants/towerConstants.js`**. Rode **`npm run lint`** antes de enviar alterações.

---

## 📄 Licença

Este projeto é de uso **pessoal/educacional**. O `package.json` pode estar como `private`; defina uma licença explícita (por exemplo MIT) se tornar o repositório público.

---

## 👩‍💻 Autora

Hi! 👋 I'm Andresa Alves Ribeiro, a Front-end/Full-Stack developer and Information Systems student. I love creating solutions to complex problems and am always excited to learn new technologies.

Este projeto (**Torre de Londres**) foi desenvolvido como implementação web da tarefa cognitiva com React, Vite e Tailwind.

### Connect with me

<p align="center">
  <a href="mailto:andresa_15ga@hotmail.com"><img src="https://img.shields.io/static/v1?logoWidth=15&logoColor=ff69b4&logo=gmail&label=Email&message=andresa_15ga@hotmail.com&color=ff69b4" target="_blank"></a>
  <a href="https://www.linkedin.com/in/andresa-alves-ribeiro/"><img alt="LinkedIn Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=0A66C2&logo=LinkedIn&label=LinkedIn&message=andresa-alves-ribeiro&color=0A66C2"></a>
  <a href="https://www.instagram.com/dresa.alves/"><img alt="Instagram Profile" src="https://img.shields.io/static/v1?logoWidth=15&logoColor=E4405F&logo=Instagram&label=Instagram&message=@dresa.alves&color=E4405F"></a>
</p>
