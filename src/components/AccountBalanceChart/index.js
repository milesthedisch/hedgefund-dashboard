import { useTheme } from "@mui/material";
import Line from "./lineChart";

const _options = (theme, range) => ({
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

  return <Line data={_data(theme, data)} options={_options(theme)} />;
};

export default AccountBalanceChart;
