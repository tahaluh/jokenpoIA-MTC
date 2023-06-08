import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import MarkovIA, { GameMove, gameResult } from "../utils/markov";
import LstmIA from "../utils/lstm";
import { GameResultsChart } from "../components/charts/gameResultsChart";
import Jokenpo from "../utils/jokenpo";

interface gameRound {
  playerMove: GameMove;
  result: gameResult;
}

interface gameReportStats {
  iaWinRate: number;
  playerWinRate: number;
  tieRate: number;
  nOfLoser: number;
  nOfTies: number;
  nOfWins: number;
  nOfRounds: number;
}

interface gameReport {
  rounds: gameRound[];
  stats: gameReportStats;
}

interface generalReport {
  games: gameReport[];
  playerName: string;
}

type model = "Original" | "Markov1" | "Markov3" | "LSTM";

export default function PlaygroundPage() {
  const [reports, setReports] = useState<generalReport[]>([]);
  const [selectedData, setSelectedData] = useState<number>(-1);
  const [selectedModel, setSelectedModel] = useState<model>("Original");

  // https://api.github.com/repos/tahaluh/jokenpoIA-MTC/contents/database

  const handleImportData = async () => {
    const response = await (
      await fetch(
        "https://api.github.com/repos/tahaluh/jokenpoIA-MTC/contents/database",
        { method: "GET" }
      )
    ).json();
    const jsonUrls: string[] = response.map(
      (jsonFile: { git_url: string }) => jsonFile.git_url
    );

    const generalReports: generalReport[] = await Promise.all(
      jsonUrls.map(async (jsonUrl: string, index) => {
        const decodedBase64 = decodeURIComponent(
          escape(
            atob(
              (await (await fetch(jsonUrl, { method: "GET" })).json()).content
            )
          )
        );
        const jsonFile = JSON.parse(decodedBase64);
        return {
          ...jsonFile,
          playerName: response[index].name.substring(
            // remove .json extension
            0,
            response[index].name.length - 5
          ),
        };
      })
    );

    setReports(generalReports);
  };

  const handleSelectData = (e: any) => {
    setSelectedData(e.target.value);
  };

  const handleSelectModel = (e: any) => {
    setSelectedModel(e.target.value);
  };

  const handleTrainModel = (gameRounds: gameRound[]): gameResult[] => {
    let iaModel: MarkovIA | LstmIA;
    let model = selectedModel;

    console.log(`treinando pra ${model}`);

    if (model === "Markov1") {
      iaModel = new MarkovIA(1);
    } else if (model === "Markov3") {
      iaModel = new MarkovIA();
    } else if (model === "LSTM") {
      iaModel = new LstmIA(10);
    } else {
      console.log("Invalid IA");
      return [];
    }

    let gameResult: gameResult[] = gameRounds.map((gameRound) => {
      return iaModel.play(gameRound.playerMove, gameRound.result).result;
    });

    return gameResult;
  };

  const handleGetSequences = (games: gameRound[][]) => {
    const jokenpo = new Jokenpo(5);

    games.forEach((gameRounds) => {
      gameRounds.forEach((gameRound) => {
        jokenpo.play(gameRound.playerMove);
      });
    });

    console.log(jokenpo.stats(5));

    return JSON.stringify("jokenpo.stats()");
  };

  return (
    <>
      <Helmet>
        <title> Playground </title>
      </Helmet>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        spacing={4}
      >
        <Grid
          item
          container
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Typography>
            Total de relatórios importados: {reports.length}
          </Typography>
          <Button variant="outlined" size="large" onClick={handleImportData}>
            Importar arquivos JSON
          </Button>
        </Grid>

        {reports.length > 0 && (
          <>
            <Grid
              item
              container
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <InputLabel id="selectSubjectLabel">
                <Typography variant="button" color="black">
                  Dados em análise:{" "}
                </Typography>
                <Select
                  labelId="selectSubjectLabel"
                  defaultValue={-1}
                  onChange={handleSelectData}
                >
                  <MenuItem value={-1}>Média</MenuItem>
                  {reports.map((report, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {report.playerName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </InputLabel>
            </Grid>
            <Grid
              item
              container
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <InputLabel id="selectModelLabel">
                <Typography variant="button" color="black">
                  Modelo de predição:
                </Typography>
                <Select
                  labelId="selectModelLabel"
                  defaultValue="Original"
                  onChange={handleSelectModel}
                >
                  <MenuItem value="Original">Original</MenuItem>
                  <MenuItem value="Markov1">Markov1</MenuItem>
                  <MenuItem value="Markov3">Markov3</MenuItem>
                  <MenuItem value="LSTM">LSTM</MenuItem>
                </Select>
              </InputLabel>
            </Grid>
            {selectedModel == "Original" && (
              <Grid
                item
                container
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                rowGap={10}
                columnGap={2}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="center"
                  marginTop={3}
                >
                  <Typography variant="h3">
                    Gráficos de Resultados por Partida
                  </Typography>
                </Grid>
                <Grid item xs={5.5} container justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da primeira etapa x Markov`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[0].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              reports[selectedData].games[0].rounds.map(
                                (round) => round.result
                              ),
                            ]
                          : reports.map((report) =>
                              report.games[0].rounds.map(
                                (round) => round.result
                              )
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da segunda etapa (seja aleatório) x Markov`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[1].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              reports[selectedData].games[1].rounds.map(
                                (round) => round.result
                              ),
                            ]
                          : reports.map((report) =>
                              report.games[1].rounds.map(
                                (round) => round.result
                              )
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da terceira etapa x Markov`}
                  </Typography>

                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[2].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              reports[selectedData].games[2].rounds.map(
                                (round) => round.result
                              ),
                            ]
                          : reports.map((report) =>
                              report.games[2].rounds.map(
                                (round) => round.result
                              )
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da quarta etapa x LTSM`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[3].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              reports[selectedData].games[3].rounds.map(
                                (round) => round.result
                              ),
                            ]
                          : reports.map((report) =>
                              report.games[3].rounds.map(
                                (round) => round.result
                              )
                            )
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {selectedModel != "Original" && (
              <Grid
                item
                container
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                rowGap={10}
                columnGap={2}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="center"
                  marginTop={3}
                >
                  <Typography variant="h3">Gráficos</Typography>
                </Grid>
                <Grid item xs={5.5} container justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da primeira etapa x ${selectedModel}`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[0].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              handleTrainModel(
                                reports[selectedData].games[0].rounds
                              ),
                            ]
                          : reports.map((report) =>
                              handleTrainModel(report.games[0].rounds)
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da segunda etapa (seja aleatório) x ${selectedModel}`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[1].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              handleTrainModel(
                                reports[selectedData].games[1].rounds
                              ),
                            ]
                          : reports.map((report) =>
                              handleTrainModel(report.games[1].rounds)
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da terceira etapa x ${selectedModel}`}
                  </Typography>

                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[2].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              handleTrainModel(
                                reports[selectedData].games[2].rounds
                              ),
                            ]
                          : reports.map((report) =>
                              handleTrainModel(report.games[2].rounds)
                            )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico da quarta etapa x ${selectedModel}`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <GameResultsChart
                      nOfRounds={
                        selectedData >= 0
                          ? reports[selectedData].games[3].stats.nOfRounds
                          : 500
                      }
                      resultsArray={
                        selectedData >= 0
                          ? [
                              handleTrainModel(
                                reports[selectedData].games[3].rounds
                              ),
                            ]
                          : reports.map((report) =>
                              handleTrainModel(report.games[3].rounds)
                            )
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            {true && (
              <Grid
                item
                container
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                rowGap={10}
                columnGap={2}
              >
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="center"
                  marginTop={3}
                >
                  <Typography variant="h3">Gráficos de sequências</Typography>
                </Grid>
                <Grid item xs={5.5} container justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico de sequências da primeira etapa`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {handleGetSequences(
                      selectedData >= 0
                        ? [reports[selectedData].games[0].rounds]
                        : reports.map((report) => report.games[0].rounds)
                    )}
                  </Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico de sequências da segunda etapa`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  ></Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico de sequências da terceira etapa`}
                  </Typography>

                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  ></Grid>
                </Grid>

                <Grid item container xs={5.5} justifyContent="center">
                  <Typography variant="caption">
                    {`Gráfico de sequências da quarta etapa`}
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  ></Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </>
  );
}
