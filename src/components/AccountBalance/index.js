import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  Hidden,
  Avatar,
  Divider,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";

import { useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";

import AccountBalanceChart from "../AccountBalanceChart";
import Text from "../Text";
import SuspenseLoader from "../SuspenseLoader";

const AccountBalanceChartWrapper = styled(AccountBalanceChart)(
  () => `
      width: 100%;
      height: 100%;
`
);

const AvatarFailure = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.error.success};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

function AccountBalance({
  userTotalUnits,
  sharePriceData = [0],
  isValidating,
}) {
  const latestPrice = parseFloat(sharePriceData?.slice(-1)[0].price);
  const currentBalance = userTotalUnits * latestPrice;

  const weekPercentDelta =
    parseFloat(sharePriceData?.slice(-1)[0].price) -
    parseFloat(sharePriceData?.slice(-2)[0].price);

  const roundedTwoDecimals = +(Math.round(currentBalance + "e+2") + "e-2"); // Round to two decimal places

  const oneWeekDollarsDelta = weekPercentDelta * roundedTwoDecimals;

  const oneWeekDollarsDeltaFormatted = oneWeekDollarsDelta.toLocaleString(
    "en-AU",
    {
      style: "currency",
      currency: "AUD",
    }
  );

  const currencyNumber = currentBalance.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });

  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6} lg={5}>
          <Box p={4}>
            <Typography sx={{ pb: 3 }} variant="h4">
              Account Balance
            </Typography>
            <Box>
              <Typography
                variant="h1"
                gutterBottom
                display="flex"
                alignItems="center"
              >
                {isValidating ? (
                  <CircularProgress size={"2rem"} />
                ) : userTotalUnits && latestPrice ? (
                  currencyNumber
                ) : (
                  "No Funds"
                )}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                {userTotalUnits || "..."} Units
              </Typography>
              <Box display="flex" sx={{ py: 4 }} alignItems="center">
                {oneWeekDollarsDelta < 0 ? (
                  <AvatarFailure sx={{ mr: 2 }} variant="rounded">
                    <TrendingDown fontSize="large" />
                  </AvatarFailure>
                ) : (
                  <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                    <TrendingUp fontSize="large" />
                  </AvatarSuccess>
                )}
                <Box>
                  {isValidating ? (
                    <CircularProgress size={"2rem"} />
                  ) : (
                    <Typography variant="h4">
                      {oneWeekDollarsDeltaFormatted}
                    </Typography>
                  )}
                  <Typography variant="subtitle2" noWrap>
                    this week
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
          <Box p={4} width="100%" justifyContent="center">
            {isValidating ? (
              <CircularProgress size={100} />
            ) : (
              <AccountBalanceChart sharePrices={sharePriceData} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
