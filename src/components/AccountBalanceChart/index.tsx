import { useTheme } from "@mui/material";
import Line from "./lineChart";
import type { Theme } from "@mui/material/styles";
import { AccessibleOutlined } from "@mui/icons-material";
import PropTypes from "prop-types";

const _options = (theme: Theme, range?: any) => ({
  type: "line",
  maintainAspectRatio: false,
  resposive: true,
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    grid: { display: false },
    x: {
      type: "time",
      time: {
        unit: "week",
        display: false,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
});

const _data = ({ historicalBalances }: any, theme: Theme, selectedFund: string) => {
  const sharePriceLineColors = [
    theme.colors.primary.balmoral,
    theme.graphs.line.border,
  ];

  if (historicalBalances) {

    if (selectedFund === "ALL") {

      if (!Array.isArray(historicalBalances[0])) {
        const data = historicalBalances.map(bal => {
          return { x: bal.dateTime, y: bal.accountBalance }
        })

        return {
          datasets: [{
            data,
            borderColor: sharePriceLineColors[0],
          }]
        }
      }

      const combinedBalances = historicalBalances
        .map(balances => {
          return balances.reduce((a, b) => {
            return {
              x: a.dateTime,
              y: parseInt(a.accountBalance) + parseInt(b.accountBalance)
            }
          })
        });

      return {
        datasets: [{
          data: combinedBalances,
          borderColor: sharePriceLineColors[0],
        }]
      }
    }


    if (!Array.isArray(historicalBalances[0])) {

      if (historicalBalances[0].fund !== selectedFund) return { datasets: [{ x: 0, y: 0 }] };

      const data = historicalBalances.map(b => {
        return {
          x: b.dateTime,
          y: b.accountBalance
        }
      });

      return {
        datasets: [
          {
            data,
            borderColor: sharePriceLineColors[0]
          }
        ]
      }
    }

    const data = historicalBalances.map(b => {
      const filteredFund = b.filter(_b => _b.fund === selectedFund)[0];

      return {
        x: filteredFund.dateTime,
        y: filteredFund.accountBalance
      }
    });

    return {
      datasets: [
        {
          data,
          borderColor: sharePriceLineColors[0]
        }
      ]
    }
  }

  // if (sharePrices?.accountBalanceTimeSeries) {
  //   let data = sharePrices.accountBalanceTimeSeries.map(data => {
  //     return {
  //       x: new Date(data.dateTime),
  //       y: ~~data.accountBalance
  //     }
  //   });

  //   datasets = [{
  //     label: "Historical Balance",
  //     data,
  //     tension: 0.4,
  //     borderColor: sharePriceLineColors[0],
  //   }];
  // }

  // if (currentFund !== "ALL") {
  //   datasets = sharePrices.map((share, i) => {
  //     return {
  //       label: "Price Per Unit -" + share[0].fund,
  //       data: share.map(price => ({
  //         x: price.datetime,
  //         y: parseFloat(price.price)
  //       })),
  //       tension: 0.4,
  //       borderColor: sharePriceLineColors[i],
  //     }
  //   });
  // }


};

const AccountBalanceChart = ({ userHistorical, selectedFund }) => {
  const theme = useTheme();
  return <Line data={_data(userHistorical, theme, selectedFund)} options={_options(theme)} />;
};

AccountBalanceChart.propTypes = {
  userHistorical: PropTypes.oneOf([PropTypes.array, PropTypes.arrayOf(PropTypes.object)]),
  selectedFund: PropTypes.string
}

export default AccountBalanceChart;
