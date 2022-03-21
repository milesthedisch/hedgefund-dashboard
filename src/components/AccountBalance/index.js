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

import AccountBalanceChart from "../AccountBalanceChart";
import Text from "../Text";
import SuspenseLoader from "../SuspenseLoader";

const AccountBalanceChartWrapper = styled(AccountBalanceChart)(
  () => `
      width: 100%;
      height: 100%;
`
);
const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.sucess};
`
);

function AccountBalance({ userData, isValidating, refreshInterval }) {
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
                ${userData.balance}
                <Box
                  sx={{ ml: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {isValidating ? (
                    <CircularProgress size={"2rem"} />
                  ) : (
                    <CircularProgress size={0} />
                  )}
                </Box>
                {/*
                 */}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                {userData.shares} Units
              </Typography>
              <Box display="flex" sx={{ py: 4 }} alignItems="center">
                <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ $3,594.00</Typography>
                  <Typography variant="subtitle2" noWrap>
                    this month
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
            <AccountBalanceChart />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
