import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { GameMove, gameResult } from "../utils/markov";

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
}

interface gameReport {
  rounds: gameRound;
  stats: gameReportStats;
}

interface generalReport {
  games: gameReport[];
  playerName: string;
}

export default function PlaygroundPage() {
  const [reports, setReports] = useState();

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

    console.log(generalReports);
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
        <Button variant="outlined" size="large" onClick={handleImportDate}>
          Importar arquivos JSON
        </Button>
      </Grid>
    </>
  );
}
