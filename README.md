# Torre de Londres

Aplicação web **single-page** inspirada na tarefa cognitiva **Torre de Londres** (*Tower of London*): três hastes com capacidades diferentes e três bolas coloridas (**verde**, **vermelho**, **azul**). O objetivo é reproduzir o **estado-alvo** exibido no topo da tela, partindo sempre do **mesmo estado inicial**, com o mínimo de movimentos possível.

---

## Sumário

- [Visão geral](#visão-geral)
- [Regras do jogo](#regras-do-jogo)
- [Campanha e pontuação](#campanha-e-pontuação)
- [Stack técnica](#stack-técnica)
- [Requisitos](#requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts npm](#scripts-npm)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Arquitetura da lógica](#arquitetura-da-lógica)
- [Acessibilidade e UI](#acessibilidade-e-ui)
- [Build e deploy](#build-e-deploy)
- [Licença](#licença)

---

## Visão geral

| Aspecto | Detalhe |
|--------|---------|
| **Tipo** | Puzzle / treino cognitivo no navegador |
| **Níveis** | **35 exercícios** sequenciais (ordem fixa, definida em código) |
| **Estado inicial** | Esquerda: verde embaixo, vermelho no topo; centro: azul; direita: vazia |
| **Dica de desempenho** | Interface mostra o **mínimo teórico de movimentos** (BFS) e uma **eficiência** em relação aos seus movimentos atuais |
| **Feedback** | Toasts (`react-hot-toast`) ao concluir níveis; overlay breve na transição entre níveis |

Fluxo principal: **campanha linear** com opção de **pular para um nível** via seletor, **reiniciar nível**, **nível anterior** (com ajuste do histórico) e **reiniciar campanha** do zero.

---

## Regras do jogo

1. **Seleção de bola**: só pode mover a bola do **topo** de cada haste.
2. **Destino**: só pode colocar numa haste que ainda tenha **vaga** (abaixo do limite).
3. **Capacidades** (esquerda → centro → direita): **3**, **2** e **1** bola(s), respectivamente.
4. **Vitória**: a disposição das três hastes fica **idêntica** ao alvo do nível atual (bolas listadas de **baixo para cima** em cada haste no código e na meta visual).
5. Não há regra clássica de “só disco menor sobre maior”: aqui as peças são **identificadas por cor**; o motor trata só **topo da pilha** e **limite de vagas**.

O mínimo de movimentos é calculado por **busca em largura (BFS)** no grafo de estados alcançáveis a partir do estado inicial fixo até coincidir com o alvo (`src/utils/towerGameLogic.js`).

---

## Campanha e pontuação

- Cada nível corresponde a um array-alvo em `src/exercises.js` (comentário no arquivo: protocolo com **35 alvos** na ordem da figura de referência).
- Ao terminar o **último** exercício, abre-se a tela **“Campanha concluída”** com histórico **movimentos do jogador / mínimo** por nível.

**Pontuação final (0–100%)** — média, por exercício concluído, de `mínimo ÷ max(movimentos do jogador, 1)`, multiplicada por 100 e arredondada (`useTowerGame.js`). **100%** significa que **cada** nível foi resolvido com o **número mínimo** de movimentos.

Ao voltar para um nível anterior ou saltar no seletor, o histórico é **filtrado** para não manter entradas “à frente” do progresso atual.

---

## Stack técnica

| Camada | Tecnologia |
|--------|------------|
| UI | **React 19** (`react`, `react-dom`) |
| Build / dev | **Vite 8** |
| Estilo | **Tailwind CSS 4** via `@tailwindcss/vite` |
| Notificações | **react-hot-toast** |
| Qualidade | **ESLint 10** + plugins React Hooks e React Refresh |
| Linguagem | **JavaScript (ES modules)** — componentes `.jsx` |

Plugins Vite: `@vitejs/plugin-react`, `@tailwindcss/vite` (`vite.config.js`).

---

## Requisitos

- **Node.js** compatível com Vite 8 e dependências atuais (recomendado: **LTS recente**, por exemplo 20.x ou 22.x).
- **npm** (ou outro gerenciador compatível com `package-lock.json`).

---

## Como rodar localmente

```bash
git clone <url-do-repositório>
cd TorredeLondres
npm install
npm run dev
```

O Vite imprime no terminal a URL local (em geral `http://localhost:5173`). Abra no navegador para jogar.

---

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com HMR (Hot Module Replacement) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Servidor estático que serve o conteúdo de `dist/` (após `build`) |
| `npm run lint` | ESLint em todo o projeto (`eslint .`) |

---

## Estrutura do repositório

```
TorredeLondres/
├── index.html              # Entrada HTML, título "Torre de Londres", viewport + safe-area
├── package.json
├── vite.config.js          # React + Tailwind (Vite plugin)
├── eslint.config.js
├── public/                 # Assets estáticos (ex.: favicon)
└── src/
    ├── main.jsx            # createRoot + StrictMode
    ├── index.css           # Estilos globais + utilitários do jogo
    ├── App.jsx             # Composição: header, progresso, meta, arena, ajuda, overlay
    ├── exercises.js        # Lista EXERCISES e EXERCISE_COUNT
    ├── constants/
    │   └── towerConstants.js   # INITIAL_STATE, PEG_LIMITS, PEG_VISUAL (layout hastes)
    ├── utils/
    │   └── towerGameLogic.js   # cloneState, applyMove, getValidMoves, BFS findMinimumMoves
    ├── hooks/
    │   └── useTowerGame.js     # Estado global do jogo, callbacks, score, transições
    └── components/
        ├── GameHeader.jsx
        ├── CampaignProgress.jsx
        ├── TargetObjectiveSection.jsx
        ├── GameArena.jsx
        ├── ArenaStats.jsx
        ├── GameHelp.jsx
        ├── CampaignCompleteScreen.jsx
        └── tower/            # Peças visuais: Peg, PegRow, Ball, LevelTransitionOverlay
```

---

## Arquitetura da lógica

- **Estado do tabuleiro**: array de 3 hastes; cada haste é um array de strings de cor (`"green"`, `"red"`, `"blue"`), ordem = fundo → topo.
- **INITIAL_STATE** (`towerConstants.js`): `[["green", "red"], ["blue"], []]` — alinhado ao início de cada nível após vitória ou reinício.
- **Interação**: clique na haste — primeiro clique **seleciona** a origem (se não vazia); segundo clique em outra haste tenta **mover** (respeitando limite); clique na mesma haste **cancela** seleção.
- **Transição de nível**: após vitória, overlay de carregamento ~1 s e avanço automático; último nível marca `finished` e exibe a tela de conclusão.

Arquivos-chave para alterar **níveis**: `src/exercises.js`. Para **limites visuais ou iniciais**: `src/constants/towerConstants.js`.

---

## Acessibilidade e UI

- Layout pensado para **mobile** (`100dvh`, `safe-area-inset`, paddings responsivos) e **desktop**.
- Seção **“Como funciona”** (`GameHelp.jsx`): `<details>` reutilizável com instruções in-app.
- Tema escuro com acentos **ciano / violeta / esmeralda** (gradientes e bordas semitransparentes).

---

## Build e deploy

```bash
npm run build
npm run preview   # testar localmente a pasta dist/
```

A saída estática em `dist/` pode ser publicada em qualquer hospedagem de sites estáticos (GitHub Pages, Netlify, Vercel, S3, etc.). Configure a URL base se o app não estiver na raiz do domínio (consulte [base](https://vite.dev/config/shared-options.html#base) no Vite).

---

## Licença

O projeto está marcado como `private` no `package.json`. Defina aqui a licença desejada (por exemplo MIT) se o código for tornado público.

---

## Referência rápida — estado inicial vs metas

- **Início de cada nível**: esquerda 2 bolas (verde embaixo, vermelho no topo), centro 1 bola (azul), direita vazia; limites 3 / 2 / 1.
- **Meta**: variável por nível — reproduza exatamente as **três hastes** mostradas na área de objetivo.

Para contribuir ou estender: rode `npm run lint` antes de enviar alterações e mantenha a ordem dos exercícios em `exercises.js` se o protocolo pedagógico depender da sequência fixa.
