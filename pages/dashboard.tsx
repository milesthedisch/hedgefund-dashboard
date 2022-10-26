import Head from "next/head";

import { Container, Grid } from "@mui/material";

import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import Footer from "../src/components/Footer";
import AccountBalance from "../src/components/AccountBalance";
import AccountSecurity from "../src/components/AccountSecurity";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useSWR from "swr";
import refreshInterval from "../src/utility/refreshInterval";

const audCurrency = (str) => {
  return str.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};

const fetcher = async (uri) => {
  const response = await fetch(uri);

  const json = await response.json();

  if (response.status > 200) {
    throw response;
  }

  return json;
};

function DashboardCrypto() {
  const router = useRouter();

  const {
    data: userCurrentData,
    error: userCurrentError,
    isValidating: userCurrentIsValidating,
  } = useSWR(`/api/user/currentBalance?fund=NEUTRAL&fund=MOMENTUM`, fetcher, {
    refreshInterval: refreshInterval(),
  });

  const {
    data: userHistoricalBalance,
    error: userHistoricalError,
    isValidating: userHistoricalValidating,
  } = useSWR(`/api/historicalAccountBalance?TIME_INTERVAL=MONTH`, fetcher, {
    refreshInterval: refreshInterval(),
  });

  useEffect(() => {
    (async () => {
      if (userCurrentError || userHistoricalError) {
        console.error(userCurrentError, userHistoricalError);
        await router.push("/404");
      }
    })();
  }, [userCurrentError, userHistoricalError, router]);

  if (userCurrentError || userHistoricalError) {
    return <p>Redirecting...</p>;
  }

  return (
    <>
      < Head >
        <title>Crypto Dashboard</title>
      </Head >
      <style jsx global>{`
      #__next {
        height: 100%;
        width: 100%;
      }
    `}</style>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AccountBalance
              userHistorical={userHistoricalBalance}
              userCurrent={userCurrentData}
            />
          </Grid>
          <Grid item lg={12} xs={12}>
            <AccountSecurity />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default withPageAuthRequired(DashboardCrypto);
