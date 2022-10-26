import { useState, ChangeEvent } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Label from "../Label";
import { Fund } from "@prisma/client";

import { styled } from "@mui/material/styles";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";

import AccountBalanceChart from "../AccountBalanceChart";

const AccountBalanceChartWrapper = styled(Grid)(
  ({ theme }) => `
width: 100%;
display: flex;
justify-content: center;
padding: ${theme.spacing(4)};
`
);

const AvatarFailure = styled(Avatar)(
  ({ theme }) => `
background-color: ${theme.colors.error.balmoral};
color: ${theme.palette.error.contrastText};
width: ${theme.spacing(8)};
height: ${theme.spacing(8)};
box-shadow: ${theme.colors.shadows.balmoral};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
background-color: ${theme.colors.error.balmoral};
color: ${theme.palette.success.contrastText};
width: ${theme.spacing(8)};
height: ${theme.spacing(8)};
box-shadow: ${theme.colors.shadows.balmoral};
`
);

const DashboardTabs = { ...Fund, ALL: "ALL" };
type DashboardTabs = typeof DashboardTabs;

const audCurrency = (str: number | string) => {
  if (typeof str === "string") {
    return (0).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD"
    });
  }

  return str.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};

const getFundBalance = (fund, userCurrent) => {
  if (!userCurrent) {
    return false;
  }

  if (fund === "ALL") {
    return Number(userCurrent.combinedBalance);
  }

  return Number(userCurrent.funds?.find((_fund) => _fund.fund === fund)
    .currentBalance);
};

// TODO MILES: Probably a better way to send down this data from the backend that doesn't require all this funky stuff.
const getUnits = (fund, userCurrent) => {
  if (!userCurrent) {
    return false;
  }

  if (fund === "ALL") {
    return userCurrent.funds.map((_fund) => _fund.units);
  }

  return userCurrent.funds?.find((_fund) => _fund.fund === fund)
    .units;
}

const getDelta = (fund: string, historicalBalances) => {
  if (!historicalBalances) return 0;

  if (fund === "ALL") {
    if (!Array.isArray(historicalBalances[0])) {
      const mostRecentBalance = historicalBalances.slice(-1);
      const oldestBalance = historicalBalances.slice(0, 1);

      return parseInt(mostRecentBalance[0].accountBalance) - parseInt(oldestBalance[0].accountBalance);
    }

    const mostRecentBalance = historicalBalances
      .map(balances => {
        return balances.reduce((a, b) => {
          return parseInt(a.accountBalance) + parseInt(b.accountBalance);
        })
      })
      .slice(-1);

    const oldestBalance = historicalBalances
      .map(balances => {
        return balances.reduce((a, b) => {
          return parseInt(a.accountBalance) + parseInt(b.accountBalance);
        })
      })
      .slice(0, 1);

    return parseInt(mostRecentBalance) - parseInt(oldestBalance);
  }

  if (historicalBalances) {
    if (!Array.isArray(historicalBalances[0])) {
      if (!historicalBalances.find(x => x.fund === fund)) {
        return "...";
      }

      const mostRecentBalance = historicalBalances.slice(-1);

      const oldestBalance = historicalBalances.slice(0, 1);

      return parseInt(mostRecentBalance[0].accountBalance) - parseInt(oldestBalance[0].accountBalance);
    }

    const fundHistoricalBalances = historicalBalances.map(balances => {
      return balances.filter(balance => {
        return balance.fund === fund;
      })[0];
    });

    const mostRecentBalance = fundHistoricalBalances.slice(-1);

    const oldestBalance = fundHistoricalBalances.slice(0, 1);

    return parseInt(mostRecentBalance[0].accountBalance) - parseInt(oldestBalance[0].accountBalance);
  }

  return 0;
}

// TODO MILES: Probably a better way to send down this data from the backend that doesn't require all this funky stuff.
const getDeltaLastUpdateDateTime = (historicalBalances, selectedFund) => {
  if (!historicalBalances) { return "..."; }

  if (Array.isArray(historicalBalances[0]) && selectedFund !== "ALL") {
    const filteredBalance = historicalBalances[0].find(x => {
      return x.fund === selectedFund;
    });

    if (filteredBalance) {
      return new Date(historicalBalances[0][0].dateTime)
        .toLocaleString("en-AU", { year: "numeric", month: "short", day: "numeric" })
    }


    const dateTime = new Date(filteredBalance.dateTime);
    const formattedDate = dateTime
      .toLocaleString("en-AU", { year: "numeric", month: "short", day: "numeric" });

    return formattedDate;
  }

  if (Array.isArray(historicalBalances[0]) && selectedFund === "ALL") {
    return new Date(historicalBalances[0][0].dateTime)
      .toLocaleString("en-AU", { year: "numeric", month: "short", day: "numeric" })
  }

  if (historicalBalances[0].fund !== selectedFund && selectedFund !== "ALL") return "...";

  return new Date(historicalBalances[0].dateTime)
    .toLocaleString("en-AU", { year: "numeric", month: "short", day: "numeric" })
}

function AccountBalance({
  userCurrent,
  userHistorical,
}: {
  userCurrent: any;
  userHistorical: any;
}) {

  const [selectedFund, setSelectedFund] = useState<Fund | "ALL">("ALL");

  const tabs = Object.keys(DashboardTabs)
    .map((key) => {
      return {
        label: key,
        value:
          key[0].toUpperCase() + key.split("").splice(1).join("").toLowerCase(),
      };
    })
    .reverse();

  const handleTabsChange = (_event: ChangeEvent<{}>, value: Fund): void => {
    setSelectedFund(value);
  };

  const handleFundChange = (_event: SelectChangeEvent, value: Fund): void => {
    setSelectedFund(_event.target.value as any);
  };

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6} lg={5}>
          <Box p={4}>
            <Box
              sx={{ pb: 3 }}
              display="flex"
              alignItems="center"
              justifyItems="center"
            >
              <FormControl
                sx={{
                  "& legend": { display: "none" },
                  "& fieldset": { top: 0 },
                }}
                size="small"
              >
                <Typography variant="h5" sx={{ pb: 1 }}>
                  Account Balance
                </Typography>
                <Select
                  variant="outlined"
                  value={selectedFund as any}
                  onChange={handleFundChange}
                >
                  {tabs.map((tab) => {
                    return (
                      <MenuItem key={tab.value} value={tab.label}>
                        {tab.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography
                sx={{ pb: 2 }}
                variant="h1"
                display="flex"
                alignItems="center"
              >
                {!userCurrent ? (
                  <CircularProgress size={"2rem"} />
                ) : (
                  audCurrency(getFundBalance(selectedFund, userCurrent) || "") || "No Funds"
                )}
              </Typography>
              {selectedFund === "ALL" ? (
                Object.keys(Fund || {}).map((fund) => (
                  <Typography
                    key={fund}
                    sx={{ pb: 1 }}
                    fontWeight="normal"
                    color="text.secondary"
                  >
                    <Label sx={{ mr: 1 }}>{fund} </Label>
                    {getUnits(fund, userCurrent)} Units
                  </Typography>
                ))
              ) : (
                <Typography
                  variant="h4"
                  fontWeight="normal"
                  color="text.secondary"
                >
                  <Label sx={{ mr: 1 }}>{selectedFund} </Label>
                  {getUnits(selectedFund, userCurrent) || "..."} Units
                </Typography>
              )}
              <Box display="flex" sx={{ py: 2 }} alignItems="center">
                {
                  getDelta(selectedFund, userHistorical?.historicalBalances) < 0 ? (
                    <AvatarFailure sx={{ mr: 2 }} variant="rounded">
                      <TrendingDown fontSize="large" />
                    </AvatarFailure>
                  ) : (
                    <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                      <TrendingUp fontSize="large" />
                    </AvatarSuccess>
                  )
                }
                <Box>
                  {
                    !userHistorical ? (
                      <CircularProgress size={"2rem"} />
                    ) : (
                      <Typography variant="h4">
                        {audCurrency(getDelta(selectedFund, userHistorical?.historicalBalances))}
                      </Typography>
                    )
                  }
                  <Typography variant="subtitle2" noWrap>
                    since: {getDeltaLastUpdateDateTime(userHistorical?.historicalBalances, selectedFund)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          display="flex"
          alignItems="center"
          justifyContent="center"
          item
          xs={12}
          md={6}
          lg={7}
        >
          <AccountBalanceChartWrapper height="300px">
            {!userHistorical ? (
              <CircularProgress sx={{ alignSelf: "center" }} />
            ) : (
              <AccountBalanceChart
                userHistorical={
                  userHistorical
                }
                selectedFund={selectedFund}
              />
            )}
          </AccountBalanceChartWrapper>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
