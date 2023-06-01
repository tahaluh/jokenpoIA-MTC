import { Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "../components/iconify";
import MarkovIA, { GameMove } from "../utils/markov";
import LstmIA from "../utils/lstm";

let markovIA = new MarkovIA();
let lstmIA = new LstmIA(10);
export default function GamePage() {
  const nJogadas = 1000;
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [aiPoints, setAIPoints] = useState<number>(0);
  const [jogadas, setJogadas] = useState<number[][]>([[], [], [], []]);
  const [state, setState] = useState<number>(0);

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

  const handlePlay = (jogada: GameMove) => {
    if (state >= 4) return;
    addJogada(jogada);

    if (jogadas[state].length + 1 >= nJogadas) {
      nextStep();
    }
    console.log("resultado: ", lstmIA.play(jogada).result, "\n\n\n\n\n\n");
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

  useEffect(() => {}, [jogadas]);

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
        </Grid>
      </Grid>
    </>
  );
}
