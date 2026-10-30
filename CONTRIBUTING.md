# Como contribuir

Este documento define o fluxo de trabalho actual do projecto Verde Sow — Web Institucional.

## Antes de começar

1. Parte da branch `main` actualizada.
2. Cria uma branch curta para uma única tarefa.
3. Não alteres o visual nem o comportamento sem aprovação prévia.
4. Não adiciones dependências sem justificar a necessidade e obter aprovação.
5. Nunca adicionas credenciais, chaves ou ficheiros `.env` ao Git.

## Branches

Usamos branches curtas a partir de `main`, sem branch `develop` neste momento.

Prefixos permitidos:

- `feat/` para funcionalidades;
- `fix/` para correcções;
- `refactor/` para reorganização sem mudança de comportamento;
- `docs/` para documentação;
- `chore/` para manutenção e configuração;
- `test/` para testes.

Exemplo:

```bash
git switch main
git pull --ff-only
git switch -c refactor/partials-header-footer
```

Não são permitidos commits directos em `main`.

## Alterações

- Reaproveita o código existente; não reescrevas do zero sem aprovação.
- Mantém cada alteração pequena e com uma única finalidade.
- Não mistures movimentos de ficheiros com mudanças de conteúdo no mesmo commit.
- Para mover ou apagar mais de três ficheiros, apresenta primeiro o plano e espera por aprovação.
- Mantém caminhos, nomes e responsabilidades consistentes.
- Usa nomes em `kebab-case`, sem espaços, acentos ou sufixos como `final`, `novo` e `v2`.

## Validação local

Antes de cada commit, executa:

```bash
npm run lint
npm run build
```

Confirma também que:

- não existem avisos novos;
- as páginas afectadas abrem correctamente;
- não foram introduzidos links, imagens ou caminhos quebrados;
- não foi introduzida duplicação;
- a documentação foi actualizada quando necessário.

## Commits

As mensagens seguem Conventional Commits, em português, com uma descrição curta no imperativo:

```text
tipo(âmbito): descrição curta
```

Exemplos:

```text
docs(projeto): documenta instalação e contribuições
fix(css): remove carregamento duplicado dos produtos
refactor(js): extrai utilitários de validação
```

Faz um commit por avanço lógico e garante que esse commit passa nas validações.

## Pull requests

Cada pull request deve indicar:

- o que mudou;
- por que mudou;
- como validar;
- capturas de ecrã, caso exista uma mudança visual aprovada;
- riscos ou pontos ainda pendentes.

Não faças merge sem aprovação. A branch `main` deve permanecer estável e pronta para deploy.

## Revisão da interface

Qualquer alteração que possa afectar cores, tipografia, espaçamento, componentes, responsividade, conteúdo visível ou interacções deve ser apresentada antes da implementação. A ausência de Figma ou manual de marca não autoriza decisões visuais novas.
