import { useState, forwardRef } from "react";
import {
  CardContent,
  CardHeader,
  Card,
  Box,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import type { AlertColor } from "@mui/lab";
import LoadingButton from "@mui/lab/LoadingButton";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import StrategyForm from "../../src/components/StrategyForm";
import SuspenseLoader from "../../src/components/SuspenseLoader";
import { useTheme } from "@mui/material/styles";

import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format } from "date-fns";
import { Strategies, StrategyTransactions } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Snackbar {
  open: boolean;
  severity: AlertColor;
  message?: string;
}

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

const updateStrategies = async (
  mutate,
  strategyBalances = {},
  setSnackbar,
  setLoadingState
) => {
  setLoadingState(true);

  const uri = "/api/strategyTransactions/createMany";

  let response;

  try {
    response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(strategyBalances),
    });
  } catch (e) {
    return setSnackbar({
      open: true,
      severity: "error",
      message: e.message,
    });
  }

  const { count } = await response.json();

  setSnackbar({
    open: true,
    severity: "success",
    message: `${count} Strategies updated successfully`,
  });

  mutate("/api/strategies");
  mutate("/api/calcPrice");
  return setLoadingState(false);
};

const publishLiveSharePrice = async (
  sharePrice: number,
  setSnackbar: Function,
  setSharePriceLoading: Function,
  mutate: Function
) => {
  setSharePriceLoading(true);

  let response: any;

  try {
    response = await fetch("/api/sharePrice/create", {
      method: "POST",
      body: JSON.stringify({ sharePrice }),
    });
  } catch (e) {
    return setSnackbar({
      open: true,
      severity: "error",
      message: e,
    });
  }

  const res = await response.json();

  if (res.success) {
    mutate("/api/sharePrice?latest=true");
    setSharePriceLoading(false);

    return setSnackbar({
      open: true,
      severity: "success",
      message: `Share price successfully published`,
    });
  }

  return setSnackbar({
    open: true,
    severity: "error",
    message: res.message,
  });
};

export default withPageAuthRequired(function (props) {
  const { mutate } = useSWRConfig();
  const theme = useTheme();

  const snackbarInital: Snackbar = {
    open: false,
    severity: "success",
    message: "Successful Update",
  };

  const [strategyBalances, setStrategyBalances] = useState([]);
  const [snackbar, setSnackbar] = useState(snackbarInital);
  const [strategiesLoading, setStrategiesLoading] = useState(false);
  const [sharePriceLoading, setSharePriceLoading] = useState(false);
  const [newSharePrice, setNewSharePrice] = useState(1);

  type StrategyData = (Strategies & {
    strategyTransactions: StrategyTransactions[];
  } & { updateOn: Date | String; balance: Decimal | number })[];

  const {
    data,
    error,
    isValidating,
  }: { data?: StrategyData; error?: any; isValidating?: boolean } = useSWR(
    "/api/strategies",
    fetcher
  );

  const {
    data: unitPriceData,
    error: unitPriceError,
    isValidating: uPriceIsValidating,
  } = useSWR("/api/calcPrice", fetcher);

  const {
    data: pPriceData,
    error: pPriceError,
    isValidating: pPriceIsValidating,
  } = useSWR("/api/sharePrice?latest=true", fetcher);

  if (error) {
    setSnackbar({ open: true, severity: "error", message: error });
  }

  let strategies;

  if (data?.length) {
    strategies = data.map((strat) => {
      if (strat.strategyTransactions.length) {
        const time = strat.strategyTransactions[0]?.datetime;
        strat.updateOn = format(new Date(time), "PPpp");
        strat.balance = strat.strategyTransactions[0]?.balance;
        return StrategyForm(strat, setStrategyBalances);
      }
    });
  }

  const currencyUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <Head>
        <title>Strategies</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading="Strategies"
            subHeading="Balances for each strategy"
            noDoc={true}
          />
          <Box
            display="flex"
            sx={{ flexGrow: 0.05, justifyContent: "space-between" }}
          >
            <Card>
              <CardHeader
                sx={{ textAlign: "right" }}
                title="Calculated Share Price"
                subheader={
                  uPriceIsValidating ? (
                    "..."
                  ) : (
                    <Typography>
                      {unitPriceError
                        ? "Unavailable"
                        : `${currencyUSD.format(unitPriceData || 0)}`}
                    </Typography>
                  )
                }
              ></CardHeader>
            </Card>
            <Card>
              <CardHeader
                sx={{ textAlign: "right" }}
                title="Live Share Price"
                subheader={
                  pPriceIsValidating ? (
                    "..."
                  ) : (
                    <Typography>
                      {unitPriceError
                        ? "Unavailable"
                        : `${currencyUSD.format(pPriceData?.price || 0)}`}
                    </Typography>
                  )
                }
              ></CardHeader>
            </Card>
          </Box>
        </Box>
      </PageTitleWrapper>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxWidth="lg"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {!isValidating ? (
            <>
              {strategies}
              <Grid
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                xs={12}
              >
                <Grid item xs={12} sm={4}>
                  <Card sx={{ textAlign: "center" }}>
                    <CardHeader title="Live Share Price" />
                    <CardContent>
                      <TextField
                        sx={{ width: "100%" }}
                        label="Insert new share price"
                        onChange={(e) => setNewSharePrice(+e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <LoadingButton
                              onClick={() => {
                                publishLiveSharePrice(
                                  newSharePrice,
                                  setSnackbar,
                                  setSharePriceLoading,
                                  mutate
                                );
                              }}
                              loading={sharePriceLoading}
                            >
                              Publish
                            </LoadingButton>
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box>
              <SuspenseLoader size={64} />
            </Box>
          )}
        </Grid>
        <LoadingButton
          loading={strategiesLoading}
          sx={{ my: 3 }}
          variant="contained"
          onClick={() =>
            updateStrategies(
              mutate,
              strategyBalances,
              setSnackbar,
              setStrategiesLoading
            )
          }
        >
          UPDATE STRATAGIES
        </LoadingButton>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ open: false, severity: "success" })}
          message="Note archived"
        >
          <Alert
            onClose={() => setSnackbar({ open: false, severity: "success" })}
            severity={snackbar?.severity || "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
});
