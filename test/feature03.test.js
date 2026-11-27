// Testes automatizados – Feature 03 (Calculadora de acréscimo)
// Execute com: npm test  ou  node --test test/feature03.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const feature = require("../src/features/feature03");

test("contrato do módulo preservado", () => {
  assert.equal(feature.id, 3);
  assert.equal(feature.name, "Calculadora de acréscimo");
  assert.equal(feature.implemented, true);
  assert.equal(typeof feature.execute, "function");
});

test("caso típico: aplica acréscimo de 12% sobre 100", () => {
  assert.deepEqual(feature.execute({ valor: 100, acrescimo: 12 }), { total: 112 });
});

test("limites: acréscimo zero, valor zero e decimais", () => {
  assert.equal(feature.execute({ valor: 50, acrescimo: 0 }).total, 50);
  assert.equal(feature.execute({ valor: 0, acrescimo: 20 }).total, 0);
  assert.equal(feature.execute({ valor: 10.5, acrescimo: 10 }).total, 11.55);
  assert.equal(feature.execute({ valor: 100, acrescimo: 100 }).total, 200);
});

test("arredonda o total para duas casas decimais", () => {
  assert.equal(feature.execute({ valor: 10, acrescimo: 33.333 }).total, 13.33);
});

test("não modifica o objeto de entrada", () => {
  const entrada = { valor: 100, acrescimo: 12 };
  feature.execute(entrada);
  assert.deepEqual(entrada, { valor: 100, acrescimo: 12 });
});

test("rejeita negativos, campos ausentes, strings e não finitos", () => {
  for (const input of [
    { valor: -1, acrescimo: 2 },
    { valor: 10, acrescimo: -1 },
    { valor: 10 },
    { acrescimo: 10 },
    { valor: "10", acrescimo: 2 },
    { valor: 10, acrescimo: "12" },
    { valor: 10, acrescimo: Infinity },
    { valor: NaN, acrescimo: 5 },
  ]) {
    assert.throws(() => feature.execute(input), { name: "Error" });
  }
});

test("rejeita entrada que não seja objeto", () => {
  for (const input of [null, undefined, 10, "texto", [100, 12]]) {
    assert.throws(() => feature.execute(input), /Informe um objeto/);
  }
});
