import { blue, green, red, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  TransitionMatrixResponse,
  gameResult,
  stringGameMove,
} from "../../utils/markov";
import { ApexOptions } from "apexcharts";
import { sequencesStats } from "../../utils/jokenpo";

interface PropsInterface {
  transitionMatrix: TransitionMatrixResponse;
}

export const GameTransitionMatrixChart = ({
  transitionMatrix,
}: PropsInterface) => {
  let rock: number[] = [];
  let paper: number[] = [];
  let scissors: number[] = [];
  let categories = [
    "win - r",
    "win - p",
    "win - s",
    "lose - r",
    "lose - p",
    "lose - s",
    "tie - r",
    "tie - p",
    "tie - s",
  ];

  useEffect(() => {
    let tempRock: number[] = [];
    let tempPaper: number[] = [];
    let tempScissors: number[] = [];

    Object.keys(transitionMatrix).forEach((resultKey) => {
      Object.keys(
        transitionMatrix[resultKey as keyof TransitionMatrixResponse]
      ).forEach((preMove) => {
        tempRock.push(
          transitionMatrix[resultKey as keyof TransitionMatrixResponse][
            preMove as stringGameMove
          ].r
        );
        tempPaper.push(
          transitionMatrix[resultKey as keyof TransitionMatrixResponse][
            preMove as stringGameMove
          ].p
        );
        tempScissors.push(
          transitionMatrix[resultKey as keyof TransitionMatrixResponse][
            preMove as stringGameMove
          ].s
        );
      });
    });

    rock = tempRock;
    paper = tempPaper;
    scissors = tempScissors;
  }, [transitionMatrix]);

  const [options, setOptions] = useState<any>({
    chart: {
      id: "gameResultChart",
      zoom: { enabled: false },
      toolbar: { show: true, tools: { download: true } },
      title: { text: "test" },

      type: "bar",
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [...categories],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  });
  const [series, setSeries] = useState<ApexOptions["series"]>([
    {
      name: "Pedra",
      data: [...rock],
      color: blue[800],
    },
    {
      name: "Papel",
      data: [...paper],
      color: red[800],
    },
    {
      name: "Tesoura",
      data: [...scissors],
      color: yellow[800],
    },
  ]);

  useEffect(() => {
    setSeries([
      {
        name: "Pedra",
        data: [...rock],
        color: yellow[800],
      },
      {
        name: "Papel",
        data: [...paper],
        color: blue[800],
      },
      {
        name: "Tesoura",
        data: [...scissors],
        color: red[800],
      },
    ]);

    setOptions({
      chart: {
        id: "gameResultChart",
        zoom: { enabled: false },
        toolbar: { show: true, tools: { download: true } },
        title: { text: "test" },

        type: "bar",
        stacked: true,
        stackType: "100%",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [...categories],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    });
  }, [transitionMatrix]);

  return (
    <ReactApexChart type="bar" options={options} series={series} width="100%" />
  );
};
