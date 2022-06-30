import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

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
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.error.main};
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
  sharePriceData = [{ price: 0 }],
  isValidating,
}: {
  sharePriceData: any;
  isValidating;
  userTotalUnits;
}) {
  const latestPrice = parseFloat(sharePriceData?.slice(-1)[0]?.price);
  const currentBalance: number = userTotalUnits * latestPrice;

  const weekPercentDelta = ((parseFloat(
    sharePriceData?.slice(-1)[0].price
  ) as any) - parseFloat(sharePriceData?.slice(-2)[0].price)) as any;

  const roundedTwoDecimals = +Math.round(
    (currentBalance + "e+2" + "e-2") as any
  );

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
          <AccountBalanceChartWrapper height="300px">
            {isValidating ? (
              <CircularProgress sx={{ alignSelf: "center" }} />
            ) : (
              <AccountBalanceChart sharePrices={sharePriceData} />
            )}
          </AccountBalanceChartWrapper>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
