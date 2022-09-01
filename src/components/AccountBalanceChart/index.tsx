import { useTheme } from "@mui/material";
import Line from "./lineChart";
import type { Theme } from "@mui/material/styles";

const _options = (theme: Theme, range?: any) => ({
  maintainAspectRatio: false,
  resposive: true,
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
});

const _data = (theme: Theme, range) => {
  return {
    datasets: [
      {
        label: "Price Per Unit",
        data: range,
        tension: 0.4,
        borderColor: theme.graphs.line.border,
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

  return <Line data={_data(theme, data)} options={_options(theme)} />;
};

export default AccountBalanceChart;
