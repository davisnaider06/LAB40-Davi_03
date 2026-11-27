# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20 ou superior.
- npm.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:
```bash
curl -X POST http://localhost:3000/api/features/1 -H "Content-Type: application/json" -d '{"valor":200,"percentual":15}'
```

## Estrutura
```text
lab40/
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Importante
Este repositório é entregue intencionalmente sem testes automatizados, análise estática, workflow de CI, build ou configuração de deploy. O estudante deverá criar e justificar esses elementos durante a avaliação.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.

---

## Entrega – Enunciado 03: Calculadora de acréscimo

Arquivo implementado: `src/features/feature03.js`

- Entrada: `{ "valor": number, "acrescimo": number }`
- Saída: `{ "total": number }` com `total = valor × (1 + acrescimo / 100)`
- Validação: `valor` e `acrescimo` obrigatórios, números finitos e não negativos. Strings, `NaN`, `Infinity`, campos ausentes ou entrada que não seja objeto lançam `Error` (a API responde HTTP 400).
- Política de arredondamento: `total` é arredondado para 2 casas decimais (padrão monetário).
- O objeto de entrada não é modificado.

### Comandos

```bash
npm ci                 # instalação reproduzível
npm start              # http://localhost:3000
npm test               # testes automatizados (node:test)
npm run test:spec      # testes com relatório detalhado
npm run test:smoke     # smoke test: /health, /api/features e feature 03
npm run lint           # análise estática (ESLint)
npm run format:check   # verificação de formatação (Prettier)
npm audit --audit-level=high   # auditoria de dependências
```

### Roteiro de testes manuais

1. `npm start` e abrir http://localhost:3000.
2. Acessar http://localhost:3000/health → `{"status":"ok","application":"LAB40"}`.
3. Acessar http://localhost:3000/api/features → item 3 com `implemented: true`.
4. Na interface, selecionar o cartão 03, enviar `{"valor":100,"acrescimo":12}` → `total: 112`.
5. Via PowerShell:
   ```powershell
   $body = @{ valor = 100; acrescimo = 12 } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/features/3 -ContentType "application/json" -Body $body
   ```
6. Enviar `{"valor":-1,"acrescimo":12}` → HTTP 400 com mensagem `O campo "valor" não pode ser negativo.`
7. Enviar `{"valor":10.5,"acrescimo":10}` → `total: 11.55` (limite com decimais).

### Docker

```bash
docker build --pull -t lab40:feature03 .
docker run -d --name lab40-container -p 3000:3000 lab40:feature03
docker ps
curl --fail http://localhost:3000/health
curl --fail -X POST http://localhost:3000/api/features/3 -H "Content-Type: application/json" -d '{"valor":100,"acrescimo":12}'
docker logs lab40-container
docker stop lab40-container && docker rm lab40-container
docker save lab40:feature03 -o lab40-feature03.tar
```

### CI/CD

- `.github/workflows/ci.yml` (push e pull_request): `npm ci` → Prettier → ESLint → testes → smoke test → `npm audit` → build da imagem `lab40:feature03-<sha>` → container efêmero testando `/health` e a feature 03 → imagem `.tar` salva como artefato.
- `.github/workflows/cd.yml` (push na main): repete as verificações, constrói a imagem, exporta `.tar` e gera `deployment-record.txt` (repositório, referência, SHA, tag), publicados no artefato `lab40-delivery-record`.

### Auditoria de dependências

`npm audit --audit-level=high` → `found 0 vulnerabilities`. As únicas dependências adicionadas são de desenvolvimento (`eslint`, `@eslint/js`, `prettier`), e a imagem Docker instala apenas dependências de produção (nenhuma).
