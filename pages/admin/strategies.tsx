import { useState, useEffect, forwardRef } from "react";

import {
  Divider,
  CardContent,
  CardHeader,
  Card,
  Box,
  Container,
  Grid,
  Snackbar,
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

import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format, parseISO, parse } from "date-fns";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface snackbar {
  open: boolean;
  severity: AlertColor;
  message?: string;
}

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

const updateStrategies = async (mutate, strategyBalances = {}, setSnackbar) => {
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
};

export default withPageAuthRequired(function (props) {
  const { mutate } = useSWRConfig();

  const snackbarInital: snackbar = {
    open: false,
    severity: "success",
    message: "Successful Update",
  };

  const [strategyBalances, setStrategyBalances] = useState([]);
  const [snackbar, setSnackbar] = useState(snackbarInital);

  const { data, error, isValidating } = useSWR("/api/strategies", fetcher);
  const { data: unitPriceData, error: unitPriceError } = useSWR(
    "/api/calcPrice",
    fetcher
  );

  if (error) {
    setSnackbar({ open: true, severity: "error", message: error });
  }

  let strategies;

  if (data) {
    console.log(data);
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
        <title>Transactions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading="Strategies"
            subHeading="Balances for each strategy"
            noDoc={true}
          />
          <Card>
            <CardHeader
              title="Unit Price"
              subheader={
                unitPriceError
                  ? "Unavailable"
                  : `${currencyUSD.format(unitPriceData || 0)}`
              }
            ></CardHeader>
          </Card>
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
            strategies
          ) : (
            <Box>
              <SuspenseLoader size={64} />
            </Box>
          )}
        </Grid>
        <LoadingButton
          loading={false}
          sx={{ width: "10rem", my: 3 }}
          variant="contained"
          onClick={() =>
            updateStrategies(mutate, strategyBalances, setSnackbar)
          }
        >
          UPDATE
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
