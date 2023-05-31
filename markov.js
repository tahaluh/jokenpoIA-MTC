let matrizTransicaoVitoria = Array.from({ length: 3 }, () => Array(3).fill(1));
let matrizTransicaoDerrota = Array.from({ length: 3 }, () => Array(3).fill(1));
let matrizTransicaoEmpate = Array.from({ length: 3 }, () => Array(3).fill(1));

function markov() {
  let probabilidadesPPT = [1/3, 1/3, 1/3];
  let opcoes = ["Pedra", "Papel", "Tesoura"];
  let continuarJogando = true;
  let jogadaAnterior = "";
  let jogada = 3;

  jogada = recebeJogada();
  let jogadaIA = Math.floor(Math.random() * 3);
  let resultado = verificaResultado(jogada, jogadaIA);
  console.log("Sua jogada: " + opcoes[jogada]);
  console.log("Jogada da IA: " + opcoes[jogadaIA]);
  console.log("Você: " + resultado + "\n\n");

  jogadaAnterior = jogada;

  while (continuarJogando) {
    jogada = recebeJogada();

    if (jogada === -1) {
      finalizaJogo();
      continuarJogando = false;
    } else {
      probabilidadesPPT = retornaProbabilidades(resultado, jogadaAnterior);
      jogadaIA = Math.floor(Math.random() * 100) + 1;
      let rangeR = probabilidadesPPT[0] * 100;
      let rangeP = probabilidadesPPT[1] * 100 + rangeR;
      
      if (jogadaIA <= rangeR) {
        jogadaIA = 1;
      } else if (jogadaIA <= rangeP) {
        jogadaIA = 2;
      } else {
        jogadaIA = 0;
      }

      atualizaMatriz(resultado, jogada, jogadaAnterior);
      jogadaAnterior = jogada;
      resultado = verificaResultado(jogada, jogadaIA);

      console.log("Você escolheu: " + opcoes[jogada]);
      console.log("A IA escolheu: " + opcoes[jogadaIA]);
      console.log("Você: " + resultado);
    }
  }
}

function recebeJogada(primeiraJogada = false) {
  while (true) {
    try {
      if (primeiraJogada) {
        let jogada = parseInt(prompt("0: Pedra, 1: Papel, 2: Tesoura \n"));
        if (jogada > 2 || jogada < 0 || isNaN(jogada)) {
          console.log("Você deve informar um número de 0 a 2\n");
        } else {
          return jogada;
        }
      } else {
        let jogada = parseInt(prompt("0: Pedra, 1: Papel, 2: Tesoura, -1: FINALIZAR \n"));
        if ((jogada > 2 || jogada < 0) && jogada !== -1 || isNaN(jogada)) {
          console.log("Você deve informar um número de 0 a 2 OU -1 para finalizar \n");
        } else {
          return jogada;
        }
      }
    } catch (error) {
      console.log("Você deve informar um número inteiro \n");
    }
  }
}

function finalizaJogo() {
  console.log("Você ganhou " + parseInt(numeroVitorias) + " vezes!");
  console.log("Você perdeu " + parseInt(numeroDerrotas) + " vezes!");
  console.log("Você empatou " + parseInt(numeroEmpates) + " vezes!");

  let porcentagemVitoria = (numeroVitorias / (numeroVitorias + numeroDerrotas + numeroEmpates)) * 100;
  console.log("Sua taxa de vitória é " + porcentagemVitoria.toFixed(2) + "% em " + parseInt(numeroVitorias + numeroDerrotas + numeroEmpates) + " partidas");
  continuarJogando = false;

  console.log("Sua matriz de transição em vitórias é:\n");
  console.log("r: " + matrizTransicaoVitoria[0]);
  console.log("p: " + matrizTransicaoVitoria[1]);
  console.log("s: " + matrizTransicaoVitoria[2]);

  console.log("Sua matriz de transição em derrotas é:\n");
  console.log("r: " + matrizTransicaoDerrota[0]);
  console.log("p: " + matrizTransicaoDerrota[1]);
  console.log("s: " + matrizTransicaoDerrota[2]);

  console.log("Sua matriz de transição em empates é:\n");
  console.log("r: " + matrizTransicaoEmpate[0]);
  console.log("p: " + matrizTransicaoEmpate[1]);
  console.log("s: " + matrizTransicaoEmpate[2]);
}

function retornaProbabilidades(resultadoAnterior, jogadaAnterior) {
  let matrizResultadoAnterior = [];

  if (resultadoAnterior === 'Ganhou!') {
    matrizResultadoAnterior = matrizTransicaoVitoria;
  } else if (resultadoAnterior === 'Empatou!') {
    matrizResultadoAnterior = matrizTransicaoEmpate;
  } else {
    matrizResultadoAnterior = matrizTransicaoDerrota;
  }

  return calculaProbabilidades(matrizResultadoAnterior, jogadaAnterior);
}

function calculaProbabilidades(matrizTransicao, jogadaAnterior) {
  let probabilidadesPPT = [1/3, 1/3, 1/3];
  let soma = matrizTransicao[jogadaAnterior].reduce((a, b) => a + b, 0);
  
  for (let i = 0; i < 3; i++) {
    probabilidadesPPT[i] = matrizTransicao[jogadaAnterior][i] / soma;
  }
  
  return probabilidadesPPT;
}

function atualizaMatriz(resultadoAnterior, jogada, jogadaAnterior) {
  if (resultadoAnterior === 'Ganhou!') {
    matrizTransicaoVitoria[jogadaAnterior][jogada] += 1;
  } else if (resultadoAnterior === 'Empatou!') {
    matrizTransicaoEmpate[jogadaAnterior][jogada] += 1;
  } else {
    matrizTransicaoDerrota[jogadaAnterior][jogada] += 1;
  }
}

function verificaResultado(jogador, ia) {
  let resultado = 0;

  if (jogador === ia) {
    resultado = 0;
  } else if ((jogador === 0 && ia === 2) || (jogador === 1 && ia === 0) || (jogador === 2 && ia === 1)) {
    resultado = 1;
  } else {
    resultado = -1;
  }

  contaResultado(resultado);

  switch(resultado) {
    case 1:
      return "Ganhou!";
    case -1:
      return "Perdeu!";
    case 0:
      return "Empatou!";
  }
}

let numeroVitorias = 0.0;
let numeroDerrotas = 0.0;
let numeroEmpates = 0.0;

function contaResultado(resultado) {
  if (resultado === 1) {
    numeroVitorias += 1;
  } else if (resultado === -1) {
    numeroDerrotas += 1;
  } else {
    numeroEmpates += 1;
  }
}

markov();
