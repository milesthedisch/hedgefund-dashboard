import { useEffect, useState } from "react";

import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import Line from "./lineChart";

const ChartButton = styled(Button)({
  minWidth: "1rem",
  margin: "0 0.5rem",
});

const day = [
  { x: Date.parse("2022-03-17 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-03-18 00:00:00 GMT+11:00"), y: 12 },
  { x: Date.parse("2022-03-19 00:00:00 GMT+11:00"), y: 13 },
  { x: Date.parse("2022-03-20 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-03-21 00:00:00 GMT+11:00"), y: 3 },
  { x: Date.parse("2022-03-22 00:00:00 GMT+11:00"), y: 2 },
  { x: Date.parse("2022-03-23 00:00:00 GMT+11:00"), y: 18 },
];

const week = [
  { x: Date.parse("2022-03-17 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-03-24 00:00:00 GMT+11:00"), y: 12 },
  { x: Date.parse("2022-03-31 00:00:00 GMT+11:00"), y: 20 },
  { x: Date.parse("2022-04-07 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-04-14 00:00:00 GMT+11:00"), y: 3 },
  { x: Date.parse("2022-04-21 00:00:00 GMT+11:00"), y: 2 },
  { x: Date.parse("2022-04-28 00:00:00 GMT+11:00"), y: 1 },
];

const month = [
  { x: Date.parse("2022-04-01 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-05-01 00:00:00 GMT+11:00"), y: 12 },
  { x: Date.parse("2022-06-01 00:00:00 GMT+11:00"), y: 200 },
  { x: Date.parse("2022-07-01 00:00:00 GMT+11:00"), y: 18 },
  { x: Date.parse("2022-08-01 00:00:00 GMT+11:00"), y: 3 },
  { x: Date.parse("2022-09-01 00:00:00 GMT+11:00"), y: 20 },
  { x: Date.parse("2022-10-01 00:00:00 GMT+11:00"), y: 1 },
];

const ranges = {
  "1d": day,
  "1w": week,
  "1m": month,
};

const optionsMapping = {
  "1d": "day",
  "1w": "week",
  "1m": "month",
};

const _options = (theme, range) => ({
  responsive: true,
  interaction: {
    intersect: false,
    axis: "xy",
    mode: "nearest",
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: optionsMapping[range],
      },
      grid: {
        display: false,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
  maintainAspectRation: false,
});

const _data = (theme, range) => {
  return {
    datasets: [
      {
        label: "Unit Price",
        data: ranges[range],
        tension: 0.4,
        borderColor: theme.colors.primary.main,
      },
    ],
  };
};

const AccountBalanceChart = () => {
  const theme = useTheme();

  const [chartData, setData] = useState(_data(theme));
  const [options, setOptions] = useState();
  const [range, setRange] = useState("1d");

  useEffect(() => {
    setOptions(_options(theme, range));
    setData(_data(theme, range));
  }, [theme, range]);

  return (
    <>
      <Line data={chartData} options={options} height="75px" />
      <Box my={1} display="flex">
        <ChartButton
          size="small"
          variant="contained"
          onClick={() => setRange("1d")}
        >
          1D
        </ChartButton>
        <ChartButton
          size="small"
          my={1}
          variant="contained"
          onClick={() => setRange("1w")}
        >
          1W
        </ChartButton>
        <ChartButton
          size="small"
          my={1}
          variant="contained"
          onClick={() => setRange("1m")}
        >
          1Y
        </ChartButton>
      </Box>
    </>
  );
};

export default AccountBalanceChart;
