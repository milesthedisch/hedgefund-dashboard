import Head from "next/head";
import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import { Container, Grid } from "@mui/material";
import Footer from "../src/components/Footer";

import AccountBalance from "../src/components/AccountBalance";
import AccountSecurity from "../src/components/AccountSecurity";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useSWR from "swr";
import refreshInterval from "../src/utility/refreshInterval";

const fetcher = async (uri) => {
  const response = await fetch(uri);

  const json = await response.json();

  if (response.status > 200) {
    throw response;
  }

  return json;
};

const Dashboard = ({ userTotalUnits, sharePriceData, isValidating }) => (
  <>
    <Head>
      <title>Crypto Dashboard</title>
    </Head>
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
            sharePriceData={sharePriceData}
            userTotalUnits={userTotalUnits}
            isValidating={isValidating}
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

function DashboardCrypto() {
  const router = useRouter();

  const {
    data: userData,
    error: userError,
    isValidating: userIsValidating,
  } = useSWR(`/api/user/txs`, fetcher, {
    refreshInterval: refreshInterval(),
  });

  const {
    data: sharePriceData,
    error: sharePriceError,
    isValidating: sharePriceIsValidating,
  } = useSWR(`/api/sharePrice`, fetcher, {
    refreshInterval: refreshInterval(),
  });

  const userHasError =
    (userData?.result !== 0 && !userData?.result && !userIsValidating) ||
    !!userError;

  console.log(userHasError);

  const sharePriceHasError =
    (!sharePriceData && !sharePriceIsValidating) ||
    (!sharePriceData?.length && !sharePriceIsValidating) ||
    !!sharePriceError;

  useEffect(() => {
    (async () => {
      if (userHasError || sharePriceHasError) {
        await router.push("/404");
      }
    })();
  }, [userHasError, sharePriceHasError, router]);

  if (userHasError || sharePriceHasError) {
    return <p>Redirecting...</p>;
  }

  return (
    <Dashboard
      userTotalUnits={userData?.result}
      sharePriceData={sharePriceData}
      isValidating={userIsValidating || sharePriceIsValidating}
    />
  );
}

export default withPageAuthRequired(DashboardCrypto);
