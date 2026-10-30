# Verde Sow — Web Institucional

Site institucional multi-página da Verde Sow, empresa angolana de fornecimento alimentar, processamento de pescado e procurement. O conteúdo e a interface estão actualmente em português de Angola (`pt-AO`).

## Estado do projecto

O projecto está em reorganização incremental. O visual e o comportamento existentes são a referência actual e não devem ser alterados sem aprovação prévia.

Stack actual:

- HTML;
- CSS;
- JavaScript com ES Modules;
- Vite 7.

Não existe backend ligado ao formulário de contacto neste momento.

## Requisitos

- Node.js compatível com o Vite 7;
- npm.

## Instalação

```bash
npm ci
```

## Comandos

```bash
# Servidor de desenvolvimento
npm run dev

# Validação de JavaScript, CSS e formatação
npm run lint

# Build de produção
npm run build

# Pré-visualização local do build
npm run preview
```

O resultado do build é criado em `dist/`. Esta pasta é gerada automaticamente e não deve ser adicionada ao Git.

## Estrutura actual

```text
.
├── assets/
│   ├── css/        # estilos globais, layouts, componentes e páginas
│   ├── images/     # imagens organizadas por categoria
│   └── js/         # entrada principal e módulos JavaScript
├── docs/           # documentação do projecto
├── public/         # ficheiros públicos do Vite
├── *.html          # páginas do site
├── package.json
└── vite.config.js
```

A estrutura será revista numa fase posterior. Enquanto isso, os movimentos de ficheiros devem ser pequenos, aprovados e acompanhados pela actualização dos respectivos caminhos.

## Páginas incluídas no build actual

- `index.html`;
- `quem-somos.html`;
- `servicos.html`;
- `produtos.html`;
- `contactos.html`.

As páginas legais, o guia de estilo e a página 404 ainda não estão configurados como entradas do build.

## Como contribuir

O fluxo de trabalho, as regras de branches e os critérios de validação estão em [CONTRIBUTING.md](CONTRIBUTING.md).

## Idioma e referências visuais

- Idioma actual: português de Angola (`pt-AO`);
- não existe Figma final nem manual de marca disponível;
- o código actual é a referência visual até existir uma referência aprovada;
- alterações visuais ou de comportamento exigem autorização prévia.

## Deploy

O fornecedor de alojamento e o domínio ainda estão em pesquisa. Não existe neste momento um processo de deploy documentado e confirmado.
