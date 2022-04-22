import Head from "next/head";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  TextField,
} from "@mui/material";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import StrategyForm from "../../src/components/StrategyForm";

import useSWR from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format, parseISO, parse } from "date-fns";

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

// Fetch all strategies
// Display balances
// Update balance

export default withPageAuthRequired(function (props) {
  const isAdmin =
    props?.user["https://balmoral-dashboard.vercel.com/roles"].includes(
      "admin"
    );

  const { data, error, isValidating } = useSWR(() => {
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
      return StrategyForm(strat);
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
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {strategies}
        </Grid>
      </Container>
      <Footer />
    </>
  );
});
