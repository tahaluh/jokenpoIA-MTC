import {
  Button,
  Grid,
  IconButton,
  Input,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "../components/iconify";
import MarkovIA, { GameMove, statResponse } from "../utils/markov";
import LstmIA from "../utils/lstm";

let markovIA = new MarkovIA();
let markovIA2 = new MarkovIA();
let markovIA3 = new MarkovIA();
let lstmIA = new LstmIA(10);

export default function GamePage() {
  const nJogadas = 500;
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [aiPoints, setAIPoints] = useState<number>(0);
  const [jogadas, setJogadas] = useState<number[][]>([[], [], [], []]);
  const [resultados, setResultados] = useState<number[][]>([[], [], [], []]);
  const [winLoseTie, setWinLoseTie] = useState<number>(0);
  const [stats, setStats] = useState<statResponse[]>([]);

  const [state, setState] = useState<number>(0);
  const [nome, setNome] = useState("");

  const [timer, setTimer] = useState<number>(10);
  const intervalTime = 10;
  // timer

  useEffect(() => {
    if (timer > intervalTime) {
      setTimer(intervalTime);
    } else timer > 0 && setTimeout(() => setTimer((prev) => prev - 1), 1000);
    if (timer == 0) {
      setJogadas((prev) => [...prev]);
    }
  }, [timer]);

  const nextStep = () => {
    setPlayerPoints(0);
    setAIPoints(0);
    setState(state + 1);
    setWinLoseTie(0);
    setTimer(intervalTime);
  };

  const addPlayerPoint = () => {
    setPlayerPoints((prev) => prev + 1);
  };

  const addAiPoint = () => {
    setAIPoints((prev) => prev + 1);
  };

  const addJogada = (jogada: number) => {
    setJogadas((prev) => [
      ...prev.map((prevItem, index) => {
        return index == state ? [...prevItem.concat(jogada)] : [...prevItem];
      }),
    ]);
  };

  const addResultado = (resultado: number) => {
    if (resultado == -1) {
      addAiPoint();
    } else if (resultado == 1) {
      addPlayerPoint();
    }

    setResultados((prev) => [
      ...prev.map((prevItem, index) => {
        return index == state ? [...prevItem.concat(resultado)] : [...prevItem];
      }),
    ]);
  };

  const handlePlay = (jogada: GameMove) => {
    if (state >= 4 || timer > 0) return;
    addJogada(jogada);
    let output;

    if (state == 0) {
      output = markovIA.play(jogada);
    } else if (state == 1) {
      output = markovIA2.play(jogada);
    } else if (state == 2) {
      output = markovIA3.play(jogada);
    } else if (state == 3) {
      output = lstmIA.play(jogada);
    } else {
      return;
    }

    addResultado(output.result);

    if (state >= 2) setWinLoseTie(output.result);

    if (jogadas[state].length + 1 >= nJogadas) {
      let stats: statResponse;
      if (state == 0) {
        stats = markovIA.stats();
      } else if (state == 1) {
        stats = markovIA2.stats();
      } else if (state == 2) {
        stats = markovIA3.stats();
      } else if (state == 3) {
        stats = lstmIA.stats();
      } else {
        return;
      }

      setStats((prev) => prev.concat(stats));

      nextStep();
    }
  };

  const playRock = () => {
    handlePlay(0);
  };
  const playPaper = () => {
    handlePlay(1);
  };
  const playScissors = () => {
    handlePlay(2);
  };

  const handleSubmit = () => {
    let resultList = {
      games: jogadas.map((state, stateIndex) => {
        return {
          rounds: state.map((jogada, jogadaIndex) => {
            return {
              playerMove: jogada,
              result: resultados[stateIndex][jogadaIndex],
            };
          }),
          stats: stats[stateIndex],
        };
      }),
      playerName: nome ? nome : "guest",
    };
    console.log(resultList);
    console.log(nome);
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(resultList));

    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(resultList));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      (nome ? nome : "guest") + ".json"
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    document.documentElement.style.backgroundColor =
      winLoseTie == -1 && state >= 2 && state <= 3
        ? "#d32f2f"
        : winLoseTie === 1 && state >= 2 && state <= 3
        ? "#2e7d32"
        : "white";
  }, [winLoseTie]);

  // utiliza os botões para jogar

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);

    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
    };
  }, [jogadas]);

  const detectKeyDown = (e: any) => {
    if (e.key == 1) {
      playRock();
    } else if (e.key == 2) {
      playPaper();
    } else if (e.key == 3) {
      playScissors();
    } else if (e.key == 8) {
      handleSubmit();
    }
  };

  return (
    <>
      <Helmet>
        <title> Pedra, Papel... e AI?</title>
      </Helmet>
      {(state == 2 || state == 3) && (
        <Grid // contador de pontos
          container
          item
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "fixed",
            top: "0",
          }}
        >
          <Grid item paddingX={3} borderTop={0}>
            <Typography
              color={winLoseTie == 0 ? "black" : "white"}
              padding={1}
              fontSize={20}
              fontFamily={"cursive"}
            >
              Você {`${playerPoints} - ${aiPoints}`} IA
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        spacing={4}
      >
        {state <= 3 && (
          <>
            <Grid
              item
              container
              xs={8}
              md={6}
              lg={4}
              xl={3}
              justifyContent="center"
              flexDirection="row"
            >
              <Typography
                color={winLoseTie == 0 ? "black" : "white"}
                variant="overline"
                fontSize={20}
              >
                {!!timer
                  ? `A ${state + 1}° etapa começa em: ${timer}...`
                  : `Total: ${jogadas[state].length}`}
              </Typography>
            </Grid>
          </>
        )}
        {state <= 3 && (
          <Grid
            item
            container
            xs={6}
            justifyContent="center"
            textAlign="center"
            flexDirection={"column"}
            padding={3}
            paddingTop={0}
            borderRadius={10}
            sx={{
              ...(winLoseTie != 0
                ? { backgroundColor: "rgba(0,0,0,0.50)" }
                : {}),
            }}
          >
            <Typography
              variant="caption"
              fontSize={15}
              color={winLoseTie == 0 ? "black" : "white"}
            >
              {state === 0
                ? `Aperte os botões ${nJogadas} vezes.`
                : state == 1
                ? `Segunda etapa, aperte os botões ${nJogadas} vezes da forma mais aleatória possível.`
                : state == 2
                ? `Terceira etapa, você jogará ${nJogadas} partidas de "pedra, papel tesoura" contra a máquina, tente ganhar ao máximo.`
                : `Quarta etapa, você jogará ${nJogadas} partidas de "pedra, papel tesoura" contra a máquina, tente ganhar ao máximo.`}
            </Typography>
            {state >= 2 && (
              <Typography variant="caption" fontSize={15}>
                <Typography
                  variant="caption"
                  fontSize={15}
                  color={"green"}
                  fontWeight={700}
                >
                  Verde - vitória,{" "}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={15}
                  color={"error"}
                  fontWeight={700}
                >
                  Vermelho - derrota,{" "}
                </Typography>
                <Typography
                  variant="caption"
                  fontSize={15}
                  color={winLoseTie == 0 ? "black" : "white"}
                  fontWeight={700}
                >
                  Branco - empate.
                </Typography>
              </Typography>
            )}
            {state >= 2 && (
              <Typography
                variant="caption"
                fontSize={15}
                color={winLoseTie == 0 ? "black" : "white"}
              >
                {"Teclado numérico - pedra : 1, papel : 2, tesoura: 3"}
              </Typography>
            )}
            {state <= 2 && (
              <Typography
                variant="caption"
                fontSize={15}
                color={winLoseTie == 0 ? "black" : "white"}
              >
                {"Teclado numérico 1, 2, 3"}
              </Typography>
            )}
          </Grid>
        )}
        <Grid
          item
          container
          xs={8}
          md={6}
          justifyContent="center"
          flexDirection="row"
          gap={5}
        >
          {state <= 3 && (
            <>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{
                    border: `1px solid ${winLoseTie == 0 ? "black" : "white"}`,
                  }}
                  onClick={playRock}
                >
                  {(state == 0 || state == 1) && (
                    <Grid
                      container
                      width="75px"
                      height="75px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      1
                    </Grid>
                  )}
                  {(state === 2 || state == 3) && (
                    <Iconify
                      color={winLoseTie == 0 ? "black" : "white"}
                      icon="la:hand-rock-solid"
                      width="75px"
                    />
                  )}
                </IconButton>
              </Grid>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{
                    border: `1px solid ${winLoseTie == 0 ? "black" : "white"}`,
                  }}
                  onClick={playPaper}
                >
                  {(state == 0 || state == 1) && (
                    <Grid
                      container
                      width="75px"
                      height="75px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      2
                    </Grid>
                  )}
                  {(state === 2 || state == 3) && (
                    <Iconify
                      color={winLoseTie == 0 ? "black" : "white"}
                      icon="la:hand-paper-solid"
                      width="75px"
                    />
                  )}
                </IconButton>
              </Grid>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{
                    border: `1px solid ${winLoseTie == 0 ? "black" : "white"}`,
                  }}
                  onClick={playScissors}
                >
                  {(state == 0 || state == 1) && (
                    <Grid
                      container
                      width="75px"
                      height="75px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      3
                    </Grid>
                  )}{" "}
                  {(state === 2 || state == 3) && (
                    <Iconify
                      color={winLoseTie == 0 ? "black" : "white"}
                      icon="la:hand-scissors-solid"
                      width="75px"
                    />
                  )}
                </IconButton>
              </Grid>
            </>
          )}

          {state >= 4 && (
            <>
              <Grid
                item
                container
                xs={8}
                justifyContent="center"
                textAlign="center"
              >
                <Typography variant="caption" fontSize={15}>
                  Por favor, insira seu nome, clique em "Baixar" e envie o
                  arquivo nesse{" "}
                  <Link
                    href="https://forms.gle/SYnaBcQS8rAhTJGA6"
                    variant="overline"
                    fontSize={20}
                    target="_blank"
                  >
                    link
                  </Link>
                </Typography>
              </Grid>
              <Grid item container xs={12} justifyContent="center">
                <TextField
                  fullWidth
                  placeholder="Insira seu nome..."
                  label="Nome"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                  }}
                />
              </Grid>
              <Grid item container xs={12} justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                >
                  Baixar
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
