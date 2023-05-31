import random
import numpy as np

# Pedra = 0
# Papel = 1
# Tesoura = 20

matrizTransicaoVitoria = np.ones((3, 3), dtype=int)
matrizTransicaoDerrota = np.ones((3, 3), dtype=int)
matrizTransicaoEmpate = np.ones((3, 3), dtype=int)


def markov():
    probabilidadesPPT = [1/3, 1/3, 1/3]
    opcoes = ["Pedra", "Papel", "Tesoura"]
    continuarJogando = True
    jogadaAnterior = ""
    jogada = 3

    jogada = recebeJogada()
    jogadaIA = random.randint(0, 2)
    resultado = verificaResultado(jogada, jogadaIA)
    print("Sua jogada %s" % opcoes[jogada])
    print("Jogada da IA %s" % opcoes[jogadaIA])
    print("Você %s \n\n" % resultado)

    jogadaAnterior = jogada

    while (continuarJogando):
        jogada = recebeJogada()

        if (jogada == -1):
            finalizaJogo()
            continuarJogando = False
        else:
            probabilidadesPPT = retornaProbabilidades(
                resultado, jogadaAnterior)
            jogadaIA = random.randint(1, 100)
            rangeR = probabilidadesPPT[0] * 100
            rangeP = probabilidadesPPT[1] * 100 + rangeR
            if (jogadaIA <= rangeR):
                jogadaIA = 1
            elif (jogadaIA <= rangeP):
                jogadaIA = 2
            else:
                jogadaIA = 0

            atualizaMatriz(resultado, jogada, jogadaAnterior)
            jogadaAnterior = jogada
            resultado = verificaResultado(jogada, jogadaIA)

            print("Você escolheu %s" % opcoes[jogada])
            print("A IA escolheu %s" % opcoes[jogadaIA])
            print("Você %s" % resultado)


def recebeJogada(primeiraJogada=False):
    while (True):
        try:
            if (primeiraJogada):
                jogada = int(input("0: Pedra, 1: Papel, 2: Tesoura \n"))
                if (jogada > 2 or jogada < 0):
                    print("Você deve informar um número de 0 a 2\n")
                else:
                    return jogada
            else:
                jogada = int(
                    input("0: Pedra, 1: Papel, 2: Tesoura, -1: FINALIZAR \n"))
                if ((jogada > 2 or jogada < 0) and jogada != -1):
                    print(
                        "Você deve informar um número de 0 a 2 OU -1 para finalizar \n")
                else:
                    return jogada
        except ValueError:
            print("Você deve informar um inteiro \n")


def finalizaJogo():
    print("Você ganhou %d vezes!" % int(numeroVitorias))
    print("Você perdeu %d vezes!" % int(numeroDerrotas))
    print("Você empatou %d vezes!" % int(numeroEmpates))
    porcentagemVitoria = "{percent:.2%}".format(
        percent=(numeroVitorias / (numeroVitorias+numeroDerrotas+numeroEmpates)))
    print("Sua taxa de vitória é %s em %d partidas" %
          (porcentagemVitoria, int(numeroVitorias+numeroDerrotas+numeroEmpates)))
    continuarJogando = False

    print("Sua matriz de transição em vitórias é:\nr: %s\np: %s\ns: %s\n" %
          (matrizTransicaoVitoria[0], matrizTransicaoVitoria[1], matrizTransicaoVitoria[2]))
    print("Sua matriz de transição em derrotas é:\nr: %s\np: %s\ns: %s\n" %
          (matrizTransicaoDerrota[0], matrizTransicaoDerrota[1], matrizTransicaoDerrota[2]))
    print("Sua matriz de transição em empates é:\nr: %s\np: %s\ns: %s\n" %
          (matrizTransicaoEmpate[0], matrizTransicaoEmpate[1], matrizTransicaoEmpate[2]))


def retornaProbabilidades(resultadoAnterior, jogadaAnterior):
    matrizResultadoAnterior = []

    if resultadoAnterior == 'Ganhou!':
        matrizResultadoAnterior = matrizTransicaoVitoria
    elif resultadoAnterior == 'Empatou!':
        matrizResultadoAnterior = matrizTransicaoEmpate
    else:
        matrizResultadoAnterior = matrizTransicaoDerrota

    return calculaProbabilidades(matrizResultadoAnterior, jogadaAnterior)


def calculaProbabilidades(matrizTransicao, jogadaAnterior):
    probabilidadesPPT = [1/3, 1/3, 1/3]
    soma = sum(matrizTransicao[jogadaAnterior])
    for i in range(3):
        probabilidadesPPT[i] = matrizTransicao[jogadaAnterior][i] / soma
    return probabilidadesPPT


def atualizaMatriz(resultadoAnterior, jogada, jogadaAnterior):
    # 'Ganhou!', 'Perdeu!', 'Empatou!'
    if resultadoAnterior == 'Ganhou!':
        matrizTransicaoVitoria[jogadaAnterior][jogada] += 1
    elif resultadoAnterior == 'Empatou!':
        matrizTransicaoEmpate[jogadaAnterior][jogada] += 1
    else:
        matrizTransicaoDerrota[jogadaAnterior][jogada] += 1
    return


def verificaResultado(jogador, ia):
    resultado = 0

    if (jogador == ia):
        resultado = 0
    elif ((jogador == 0 and ia == 2) or (jogador == 1 and ia == 0) or (jogador == 2 and ia == 1)):
        resultado = 1
    else:
        resultado = -1

    contaResultado(resultado)

    match resultado:
        case 1:
            return "Ganhou!"
        case -1:
            return "Perdeu!"
        case 0:
            return "Empatou!"


numeroVitorias, numeroDerrotas, numeroEmpates = 0.0, 0.0, 0.0


def contaResultado(resultado):
    global numeroVitorias
    global numeroDerrotas
    global numeroEmpates

    if (resultado == 1):
        numeroVitorias += 1
    elif (resultado == -1):
        numeroDerrotas += 1
    else:
        numeroEmpates += 1


markov()
