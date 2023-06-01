import {
  Button,
  Grid,
  IconButton,
  Input,
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
  const nJogadas = 50;
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [aiPoints, setAIPoints] = useState<number>(0);
  const [jogadas, setJogadas] = useState<number[][]>([[], [], [], []]);
  const [resultados, setResultados] = useState<number[][]>([[], [], [], []]);
  const [winLoseTie, setWinLoseTie] = useState<number>(0);
  const [stats, setStats] = useState<statResponse[]>([]);

  const [state, setState] = useState<number>(0);
  const [nome, setNome] = useState("");

  const nextStep = () => {
    setPlayerPoints(0);
    setAIPoints(0);
    setState(state + 1);
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
    setResultados((prev) => [
      ...prev.map((prevItem, index) => {
        return index == state ? [...prevItem.concat(resultado)] : [...prevItem];
      }),
    ]);
  };

  const handlePlay = (jogada: GameMove) => {
    if (state >= 4) return;
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
    setWinLoseTie(output.result);

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
    document.getRootNode();
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
            <Typography padding={1} fontSize={20} fontFamily={"cursive"}>
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
        spacing={6}
        sx={{
          backgroundColor:
            winLoseTie == -1 && state >= 2 && state <= 3
              ? "red"
              : winLoseTie === 1 && state >= 2 && state <= 3
              ? "green"
              : "white",
        }}
      >
        {state <= 3 && (
          <Grid
            item
            container
            xs={8}
            md={6}
            lg={4}
            xl={3}
            justifyContent="center"
            flexDirection="row"
            gap={5}
          >
            <Typography>Total: {jogadas[state].length}</Typography>
          </Grid>
        )}
        <Grid
          item
          container
          xs={8}
          md={6}
          lg={4}
          xl={3}
          justifyContent="center"
          flexDirection="row"
          gap={5}
        >
          {state <= 3 && (
            <>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{ border: "1px solid black" }}
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
                    <Iconify icon="la:hand-rock-solid" width="75px" />
                  )}
                </IconButton>
              </Grid>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{ border: "1px solid black" }}
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
                    <Iconify icon="la:hand-paper-solid" width="75px" />
                  )}
                </IconButton>
              </Grid>
              <Grid item justifyContent="center">
                <IconButton
                  color="inherit"
                  sx={{ border: "1px solid black" }}
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
                    <Iconify icon="la:hand-scissors-solid" width="75px" />
                  )}
                </IconButton>
              </Grid>
            </>
          )}

          {state >= 4 && (
            <>
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
