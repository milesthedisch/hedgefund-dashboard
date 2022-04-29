import * as React from "react";
const useState = React.useState;
import { Box, Container, Grid, Snackbar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import StrategyForm from "../../src/components/StrategyForm";
import SuspenseLoader from "../../src/components/SuspenseLoader";

import Head from "next/head";

import useSWR from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format, parseISO, parse } from "date-fns";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

// Fetch all strategies Done
// Display balances Done
// Create new startegy balance

const updateStrategies = async (mutate, body) => {
  const uri = "/api/startegyBalance/create";

  let response;

  console.log(body);

  throw body;

  try {
    response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw e;
  } finally {
    const data = response.json();
    mutate(data);
  }
};

export default withPageAuthRequired(function (props) {
  const [strategyBalances, setStrategyBalances] = useState({});
  const [snackbar, setSnackbar] = useState(false);

  const isAdmin =
    props?.user["https://balmoral-dashboard.vercel.com/roles"].includes(
      "admin"
    );

  const { data, error, isValidating, mutate } = useSWR(() => {
    if (isAdmin) {
      return "/api/strategies";
    } else {
      return false;
    }
  }, fetcher);

  let strategies;

  if (data) {
    strategies = data.map((strat) => {
      const time = strat.strategyTransactions[0].datetime;
      strat.updateOn = format(new Date(time), "PPpp");
      strat.balance = strat.strategyTransactions[0].balance;
      return StrategyForm(strat, setStrategyBalances);
    });
  }

  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Strategies"
          subHeading="Balances for each strategy"
          noDoc={true}
        />
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
          {!isValidating ? strategies : <SuspenseLoader />}
        </Grid>
        <LoadingButton
          loading={false}
          sx={{ width: "10rem", my: 3 }}
          variant="contained"
          onClick={() => updateStrategies(mutate, strategyBalances)}
        >
          UPDATE
        </LoadingButton>
        <Snackbar
          open={false}
          autoHideDuration={6000}
          onClose={() => setSnackbar(false)}
          message="Note archived"
        >
          <Alert
            onClose={() => setSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            This is a success message!
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
});
