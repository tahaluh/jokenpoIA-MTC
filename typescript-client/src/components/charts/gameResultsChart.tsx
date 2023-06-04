import { green, red, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { gameResult } from "../../utils/markov";

interface PropsInterface {
  nOfRounds: number;
  resultsArray: gameResult[][];
}

interface Coordinates {
  x: number;
  y: number;
}

export const GameResultsChart = ({
  nOfRounds,
  resultsArray,
}: PropsInterface) => {
  let winLineData: Coordinates[] = [];
  let loseLineData: Coordinates[] = [];
  let tieLineData: Coordinates[] = [];

  useEffect(() => {
    let tempWinLineData: Coordinates[] = [];
    let tempLoseLineData: Coordinates[] = [];
    let tempTieLineData: Coordinates[] = [];

    resultsArray.forEach((results, resultsIndex) => {
      let somou = 0;
      results.forEach((value, index) => {
        if (resultsIndex == 0) {
          tempWinLineData.push({
            x: index,
            y:
              value == 1
                ? index > 0
                  ? tempWinLineData[tempWinLineData.length - 1].y + 1
                  : 1
                : index > 0
                ? tempWinLineData[tempWinLineData.length - 1].y
                : 0,
          });
        } else {
          if (value == 1) {
            somou += 1;
          }
          tempWinLineData[index].y = tempWinLineData[index].y + somou;
        }
      });

      somou = 0;
      results.forEach((value, index) => {
        if (resultsIndex == 0) {
          tempLoseLineData.push({
            x: index,
            y:
              tempLoseLineData.length > 0
                ? value == -1
                  ? tempLoseLineData[tempLoseLineData.length - 1].y + 1
                  : tempLoseLineData[tempLoseLineData.length - 1].y
                : 0,
          });
        } else {
          if (value == -1) {
            somou += 1;
          }
          tempLoseLineData[index].y = tempLoseLineData[index].y + somou;
        }
      });

      somou = 0;
      results.forEach((value, index) => {
        if (resultsIndex == 0) {
          tempTieLineData.push({
            x: index,
            y:
              tempTieLineData.length > 0
                ? value == 0
                  ? tempTieLineData[tempTieLineData.length - 1].y + 1
                  : tempTieLineData[tempTieLineData.length - 1].y
                : 0,
          });
        } else {
          if (value == 0) {
            somou += 1;
          }
          tempTieLineData[index].y = tempTieLineData[index].y + somou;
        }
      });
    });

    winLineData = tempWinLineData.map((data) => ({
      x: data.x,
      y: data.y / resultsArray.length,
    }));
    loseLineData = tempLoseLineData.map((data) => ({
      x: data.x,
      y: data.y / resultsArray.length,
    }));
    tieLineData = tempTieLineData.map((data) => ({
      x: data.x,
      y: data.y / resultsArray.length,
    }));
  }, [resultsArray]);

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
  }, [resultsArray]);

  return <ReactApexChart options={options} series={series} width="100%" />;
};
