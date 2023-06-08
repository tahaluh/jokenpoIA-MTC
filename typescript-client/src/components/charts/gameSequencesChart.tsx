import { blue, green, red, yellow } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { gameResult } from "../../utils/markov";
import { ApexOptions } from "apexcharts";
import { sequencesStats } from "../../utils/jokenpo";

interface PropsInterface {
  sequencesStats: sequencesStats[];
}

export const GameSequencesChart = ({ sequencesStats }: PropsInterface) => {
  let rock: number[] = [];
  let paper: number[] = [];
  let scissors: number[] = [];
  let categories: string[] = [];

  useEffect(() => {
    let tempRock: number[] = [];
    let tempPaper: number[] = [];
    let tempScissors: number[] = [];
    let tempCategories: string[] = [];
    sequencesStats.forEach((sequenceStats) => {
      tempCategories.push(
        sequenceStats.prevSequence + ` - (${sequenceStats.total})`
      );
      tempRock.push(sequenceStats.occurrences.r);
      tempPaper.push(sequenceStats.occurrences.p);
      tempScissors.push(sequenceStats.occurrences.s);
    });

    categories = tempCategories;
    rock = tempRock;
    paper = tempPaper;
    scissors = tempScissors;
  }, [sequencesStats]);

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
  }, [sequencesStats]);

  return (
    <ReactApexChart type="bar" options={options} series={series} width="100%" />
  );
};
