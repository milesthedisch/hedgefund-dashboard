import { useEffect, useState } from "react";

import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import Line from "./lineChart";

const ChartButton = styled(Button)({
  minWidth: "1rem",
  margin: "0 0.5rem",
});

const _options = (theme, range) => ({
  responsive: true,
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "week",
        display: false,
      },
    },
    y: {
      min: 0.98,
      beginAtZero: true,
    },
  },
  maintainAspectRation: false,
});

const _data = (theme, range) => {
  return {
    datasets: [
      {
        label: "Price Per Unit",
        data: range,
        tension: 0.4,
        borderColor: theme.colors.primary.main,
      },
    ],
  };
};

const AccountBalanceChart = ({ sharePrices }) => {
  const theme = useTheme();

  const data = (sharePrices = sharePrices.map((s) => ({
    x: s.datetime,
    y: parseFloat(s.price),
  })));

  return (
    <>
      <Line data={_data(theme, data)} options={_options(theme)} height="75px" />
    </>
  );
};

export default AccountBalanceChart;
