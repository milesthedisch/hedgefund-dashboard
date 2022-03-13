import Head from "next/head";
import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import { Container, Grid } from "@mui/material";
import Footer from "../src/components/Footer";

import AccountBalance from "../src/components/AccountBalance";
import AccountSecurity from "../src/components/AccountSecurity";
import SuspenseLoader from "../src/components/SuspenseLoader";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import { useRouter } from "next/router";

const REFRESH_INTERVAL = 10000;

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

const Dashboard = ({ data, refreshInterval, isValidating }) => (
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
            data={data}
            refreshInterval={refreshInterval}
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

  const { data, error, isValidating } = useSWR("/api/sheets/user", fetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  if (data == 404) {
    return router.push("/404");
  }

  if (error) {
    return router.push("/404");
  }

  if (!isValidating) {
    return (
      <Dashboard
        data={data}
        isValidating={isValidating}
        refreshInterval={REFRESH_INTERVAL}
      />
    );
  }

  return (
    <Container
      sx={{ height: "80vh", display: "flex", justifyContent: "center" }}
    >
      {/* The default value size is 64 */}
      <SuspenseLoader size={64 * 1.5} />
    </Container>
  );
}

export default withPageAuthRequired(DashboardCrypto);
