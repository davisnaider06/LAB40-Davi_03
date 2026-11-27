// Smoke test: sobe a aplicação em porta livre e verifica as rotas principais.
// Uso: npm run test:smoke  (ou BASE_URL=http://localhost:3000 para testar um servidor já em execução)
const { createServer } = require("node:http");
const assert = require("node:assert/strict");
const app = require("../src/app");

async function check(baseUrl) {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200, "/health deve responder 200");
  assert.equal((await health.json()).status, "ok");
  console.log("OK  GET /health");

  const catalogo = await fetch(`${baseUrl}/api/features`);
  assert.equal(catalogo.status, 200);
  const lista = await catalogo.json();
  assert.equal(lista.total, 40);
  console.log("OK  GET /api/features (40 funcionalidades)");

  const ok = await fetch(`${baseUrl}/api/features/3`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor: 100, acrescimo: 12 }),
  });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).result.total, 112);
  console.log("OK  POST /api/features/3 -> total 112");

  const invalido = await fetch(`${baseUrl}/api/features/3`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor: -1, acrescimo: 12 }),
  });
  assert.equal(invalido.status, 400);
  console.log("OK  POST /api/features/3 inválido -> 400");
}

async function main() {
  if (process.env.BASE_URL) return check(process.env.BASE_URL);
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await check(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

main()
  .then(() => console.log("Smoke test aprovado."))
  .catch((error) => {
    console.error("Smoke test falhou:", error.message);
    process.exit(1);
  });
