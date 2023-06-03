import { Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { GameMove, gameResult } from "../utils/markov";
import { GameResultsChart } from "../components/charts/gameResultsChart";

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

export default function PlaygroundPage() {
  const [reports, setReports] = useState<generalReport[]>([]);
  const [selectedData, setSelectedData] = useState<number>(-1);
  const [updateSignal, setUpdateSignal] = useState<boolean>(true);

  // https://api.github.com/repos/tahaluh/jokenpoIA-MTC/contents/database

  const handleImportDate = async () => {
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

  const sendUpdateSignal = () => {
    setUpdateSignal((prev) => !prev);
  };

  useEffect(() => {
    sendUpdateSignal();
    console.log("sinal");
  }, [reports, selectedData]);
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
          <Button variant="outlined" size="large" onClick={handleImportDate}>
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
              <Typography>Média {reports.length}</Typography>
              <Select defaultValue={-1} onChange={handleSelectData}>
                <MenuItem value={-1}>Média</MenuItem>
                {reports.map((report, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {report.playerName}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid
              item
              container
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <Grid item container xs={12} minHeight={"40vh"}>
                <GameResultsChart
                  nOfRounds={
                    selectedData >= 0
                      ? reports[selectedData].games[0].stats.nOfRounds
                      : 0
                  }
                  results={
                    selectedData >= 0
                      ? reports[selectedData].games[0].rounds.map(
                          (round) => round.result
                        )
                      : []
                  }
                  updateSignal={updateSignal}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
