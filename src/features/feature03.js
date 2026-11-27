// Funcionalidade 03: Calculadora de acréscimo.
// Objetivo: Aplica acréscimo percentual a um valor.
// Exemplo de entrada: { valor: 100, acrescimo: 12 } -> { total: 112 }
// Política de arredondamento: o total é arredondado para 2 casas decimais
// (padrão monetário), evitando resíduos de ponto flutuante como 11.550000000000001.

const implemented = true;

// Verifica se o campo é um número finito e não negativo.
function validarNumero(nome, valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new Error(`O campo "${nome}" é obrigatório e deve ser um número finito.`);
  }
  if (valor < 0) {
    throw new Error(`O campo "${nome}" não pode ser negativo.`);
  }
}

// Aplica o acréscimo percentual sem modificar o objeto de entrada.
function execute(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Informe um objeto com os campos valor e acrescimo.");
  }
  const { valor, acrescimo } = input;
  validarNumero("valor", valor);
  validarNumero("acrescimo", acrescimo);

  const total = Math.round(valor * (1 + acrescimo / 100) * 100) / 100;
  return { total };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 3,
  name: "Calculadora de acréscimo",
  description: "Aplica acréscimo percentual a um valor.",
  implemented,
  execute,
};
