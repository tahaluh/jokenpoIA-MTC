import { blue, red } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface coordinates {
  x: number;
  y: number;
}

interface Props {
  id?: string;
  dp: number; // distância de proteção (ponto onde a altura limite chega a 0)
  R: number; // raio da esfera classificada
  h: number; // altura do spda
  hpFc: number; // altura do plano ficticio
  rpFc: number; // raio do plano ficticio
  h1: number; // altura da estrutura
  l1: number; // largura da estrutura
  d1: number; // distância limite da estrutura
  h1Ae: number; // largura da estrutura com área explosiva
  d1Ae: number; // distância limite da estrutura com área explosiva
  hcAux: number; // altura do centro do círculo
  dpc: number; // distância de proteção complementar
}

//f: y=-sqrt(25-(x-5)^(2))+5

export const CoverageCalcChart = ({
  id,
  dp,
  R,
  h,
  hpFc,
  rpFc,
  h1,
  l1,
  d1,
  h1Ae,
  d1Ae,
  hcAux,
  dpc,
}: Props) => {
  let curveLineData: coordinates[] = [];

  // centro do circulo
  // y = hc_aux
  // x = dp+dpc

  let y;
  let xInicial = -Math.sqrt(R ** 2 - (h - hcAux) ** 2) + dp + dpc; // define o ponto 0 do gráfico o ponto onde está o spda
  for (let x = xInicial; true; x += 0.1) {
    // mapeia os pontos para a curva de proteção a cada 0.1 em x
    y = -Math.sqrt(R ** 2 - (x - dp - dpc) ** 2) + hcAux;
    if (curveLineData.length >= 1 && curveLineData[curveLineData.length - 1].y < y) break;
    curveLineData.push({ x: x - xInicial, y: y });
  }

  // let hpFcIntersection = -Math.sqrt(R ** 2 - (hpFc - R) ** 2) + R - xInicial;
  let hpFcLineData: coordinates[] = []; // cordenadas da linha do plano ficticio
  hpFcLineData.push({ x: 0, y: hpFc }, { x: rpFc, y: hpFc });

  let structureData: coordinates[] = []; // cordenadas para a área da estrutura
  structureData.push({ x: d1 - l1, y: h1 }, { x: d1, y: h1 });

  let h1Scatter = [];
  if (d1Ae && h1Ae)
    h1Scatter.push({
      name: 'h1(ha)',
      type: 'scatter',
      data: [{ x: d1Ae, y: h1Ae }],
      color: red[400],
    });
  const [series, setSeries] = useState<any>([
    {
      name: 'R',
      type: 'line',
      data: curveLineData,
      color: blue[400],
    },
    {
      name: 'h(pFc)',
      type: 'line',
      data: hpFcLineData,
      color: red[400],
    },
    {
      name: 'Estrutura',
      type: 'area',
      data: structureData,
      color: '#497EB2',
    },
    {
      name: 'h1(Lim)',
      type: 'scatter',
      data: [{ x: d1, y: h1 }],
      color: '#000',
    },
    ...h1Scatter,
  ]);
  const [options, setOptions] = useState<any>({
    markers: {
      size: [0, 0, 0, 6, 5],
    },
    chart: {
      id: id || 'coverageChart',
      zoom: { enabled: false },
      toolbar: { show: false },

      ...(id
        ? {
            animations: {
              enabled: false,
              easing: 'easeinout',
              speed: 99999,
              animateGradually: {
                enabled: false,
                delay: 0,
              },
              dynamicAnimation: {
                enabled: false,
                speed: 9999,
              },
            },
          }
        : {}),
    },
    xaxis: {
      labels: {
        floating: false,
        show: true,
        formatter(value: any) {
          return value ? value.toFixed(1) : 0;
        },
      },
      axisTicks: {
        show: true,
      },
      floating: false,
      tickAmount: dp ? +dp.toFixed() : 0,
      min: 0,
      max: dp,
      title: {
        text: 'd(m)',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '400',
        },
      },
      decimalsInFloat: 1,
    },
    yaxis: {
      min: 0,
      max: h,
      floating: false,
      decimalsInFloat: 1,
      title: {
        floating: false,
        text: 'h(m)',
        style: {
          fontSize: '16px',
          fontWeight: '400',
        },
      },
    },
    stroke: {
      width: 3,
    },
    tooltip: {
      enabled: true,
      y: {
        title: {
          formatter: function (seriesName: any) {
            if (seriesName == 'R') {
              return 'R (h):';
            }
            return seriesName;
          },
        },
        formatter: function (value: any, { series, seriesIndex, dataPointIndex, w }: any) {
          return value ? value.toFixed(2) : 0;
        },
      },
      x: {
        formatter: function (value: any, { series, seriesIndex, dataPointIndex, w }: any) {
          if (seriesIndex == 0) {
            return `R (d): ${value ? value.toFixed(2) : 0}`;
          }
          return value ? value.toFixed(2) : 0;
        },
      },
    },
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  });

  useEffect(() => {
    let h1Scatter = [];
    if (d1Ae && h1Ae)
      h1Scatter.push({
        name: 'h1(ha)',
        type: 'scatter',
        data: [{ x: d1Ae, y: h1Ae }],
        color: red[400],
      });
    setSeries([
      {
        name: 'R',
        type: 'line',
        data: curveLineData,
        color: blue[400],
      },
      {
        name: 'h(pFc)',
        type: 'line',
        data: hpFcLineData,
        color: red[400],
      },
      {
        name: 'Estrutura',
        type: 'area',
        data: structureData,
        color: '#497EB2',
      },
      {
        name: 'h1(Lim)',
        type: 'scatter',
        data: [{ x: d1, y: h1 }],
        color: '#000',
      },
      ...h1Scatter,
    ]);

    setOptions({
      markers: {
        size: [0, 0, 0, 6, 5],
      },
      chart: {
        id: id || 'coverageChart',
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      xaxis: {
        labels: {
          floating: false,
          show: true,
          formatter(value: any) {
            return value ? value.toFixed(1) : 0;
          },
        },
        axisTicks: {
          show: true,
        },
        floating: false,
        tickAmount: dp ? +dp.toFixed() : 0,
        min: 0,
        max: dp,
        title: {
          text: 'd(m)',
          align: 'left',
          style: {
            fontSize: '16px',
            fontWeight: '400',
          },
        },
        decimalsInFloat: 1,
      },
      yaxis: {
        min: 0,
        max: h,
        floating: false,
        decimalsInFloat: 1,
        title: {
          floating: false,
          text: 'h(m)',
          style: {
            fontSize: '16px',
            fontWeight: '400',
          },
        },
      },
      stroke: {
        width: 3,
      },
      tooltip: {
        enabled: true,
        y: {
          title: {
            formatter: function (seriesName: any) {
              if (seriesName == 'R') {
                return 'R (h):';
              }
              return seriesName;
            },
          },
          formatter: function (value: any, { series, seriesIndex, dataPointIndex, w }: any) {
            return value ? value.toFixed(2) : 0;
          },
        },
        x: {
          formatter: function (value: any, { series, seriesIndex, dataPointIndex, w }: any) {
            if (seriesIndex == 0) {
              return `R (d): ${value ? value.toFixed(2) : 0}`;
            }
            return value ? value.toFixed(2) : 0;
          },
        },
      },
      legend: {
        onItemClick: {
          toggleDataSeries: false,
        },
      },
    });
  }, [dp, R, h, hpFc, rpFc, h1, l1, d1, h1Ae, d1Ae, hcAux, dpc]); // quando os props atualizarem o gráfico é atualizado

  return <ReactApexChart options={options} series={series} />;
};
