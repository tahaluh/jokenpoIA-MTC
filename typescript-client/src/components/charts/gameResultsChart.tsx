import { green, red, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { gameResult } from "../../utils/markov";

interface PropsInterface {
  nOfRounds: number;
  results: gameResult[];
  updateSignal: boolean;
}

interface Coordinates {
  x: number;
  y: number;
}

export const GameResultsChart = ({
  nOfRounds,
  results,
  updateSignal,
}: PropsInterface) => {
  let winLineData: Coordinates[] = [];
  let loseLineData: Coordinates[] = [];
  let tieLineData: Coordinates[] = [];
  console.log("renderizou gamesulrtasda");

  useEffect(() => {
    let tempWinLineData: Coordinates[] = [];
    results.forEach((value, index) => {
      if (index == 0 || index == results.length - 1 || value == 1)
        tempWinLineData.push({
          x: index,
          y:
            tempWinLineData.length > 0
              ? tempWinLineData[tempWinLineData.length - 1].y + 1
              : 0,
        });
    }, 0);
    winLineData = tempWinLineData;

    let tempLoseLineData: Coordinates[] = [];
    results.forEach((value, index) => {
      if (index == 0 || index == results.length - 1 || value == -1)
        tempLoseLineData.push({
          x: index,
          y:
            tempLoseLineData.length > 0
              ? tempLoseLineData[tempLoseLineData.length - 1].y + 1
              : 0,
        });
    }, 0);
    loseLineData = tempLoseLineData;

    let tempTieLineData: Coordinates[] = [];
    results.forEach((value, index) => {
      if (index == 0 || index == results.length - 1 || value == 0)
        tempTieLineData.push({
          x: index,
          y:
            tempTieLineData.length > 0
              ? tempTieLineData[tempTieLineData.length - 1].y + 1
              : 0,
        });
    }, 0);
    tieLineData = tempTieLineData;
  }, [updateSignal]);

  const [options, setOptions] = useState<any>({
    chart: {
      id: "gameResultChart",
      zoom: { enabled: false },
      toolbar: { show: false },
      width: "100%",
    },
    xaxis: {
      labels: {
        floating: false,
        show: true,
      },
      axisTicks: {
        show: true,
      },
      floating: false,
      tickAmount: nOfRounds >= 10 ? 10 : nOfRounds,
      min: 0,
      max: nOfRounds,
      title: {
        text: "Round",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "400",
        },
      },
      decimalsInFloat: 0,
    },
    yaxis: {
      min: 0,
      max: nOfRounds,
      tickAmount: nOfRounds >= 10 ? 10 : nOfRounds,
      floating: false,
      decimalsInFloat: 0,
      title: {
        floating: false,
        text: "Quantidade",
        style: {
          fontSize: "16px",
          fontWeight: "400",
        },
      },
    },
    stroke: {
      width: 3,
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  });
  const [series, setSeries] = useState<any>([
    {
      name: "Vitórias",
      type: "line",
      data: winLineData,
      color: green[800],
    },
    {
      name: "Derrotas",
      type: "line",
      data: loseLineData,
      color: red[800],
    },
    {
      name: "Empates",
      type: "line",
      data: tieLineData,
      color: yellow[800],
    },
  ]);

  useEffect(() => {
    setSeries([
      {
        name: "Vitórias",
        type: "line",
        data: winLineData,
        color: green[800],
      },
      {
        name: "Derrotas",
        type: "line",
        data: loseLineData,
        color: red[800],
      },
      {
        name: "Empates",
        type: "line",
        data: tieLineData,
        color: yellow[800],
      },
    ]);

    setOptions({
      chart: {
        id: "gameResultChart",
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      xaxis: {
        labels: {
          floating: false,
          show: true,
        },
        axisTicks: {
          show: true,
        },
        floating: false,
        tickAmount: nOfRounds >= 10 ? 10 : nOfRounds,
        min: 0,
        max: nOfRounds,
        title: {
          text: "Round",
          align: "left",
          style: {
            fontSize: "16px",
            fontWeight: "400",
          },
        },
        decimalsInFloat: 0,
      },
      yaxis: {
        min: 0,
        max: nOfRounds,
        tickAmount: nOfRounds >= 10 ? 10 : nOfRounds,
        floating: false,
        decimalsInFloat: 0,
        title: {
          floating: false,
          text: "Quantidade",
          style: {
            fontSize: "16px",
            fontWeight: "400",
          },
        },
      },
      stroke: {
        width: 3,
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        onItemClick: {
          toggleDataSeries: false,
        },
      },
    });
  }, [updateSignal]);

  return <ReactApexChart options={options} series={series} width={1000} />;
};
