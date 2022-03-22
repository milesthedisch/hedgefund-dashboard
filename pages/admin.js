import Head from "next/head";
import { Container, Grid } from "@mui/material";

import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import Footer from "../src/components/Footer";
import RecentOrders from "../src/components/RecentOrders";
import SuspenseLoader from "../src/components/SuspenseLoader";
import Custom401 from "./401";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import router from "next/router";
import useSWR from "swr";

const ApplicationsTransactions = ({ users }) => (
  <>
    <Head>
      <title>Transactions - Applications</title>
    </Head>
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
          <RecentOrders users={users} />
        </Grid>
      </Grid>
    </Container>
    <Footer />
  </>
);

export default withPageAuthRequired(function (props) {
  const fetcher = async (uri) => {
    const response = await fetch(uri);
    return response.json();
  };

  const { data, error, isValidating } = useSWR("/api/sheets", fetcher);

  if (data?.redirect) {
    return <Custom401 />;
  }

  if (data) {
    return <ApplicationsTransactions users={data} />;
  }

  if (!data && isValidating) {
    return (
      <Container
        sx={{ height: "80vh", display: "flex", justifyContent: "center" }}
      >
        {/* The default value size is 64 */}
        <SuspenseLoader size={64 * 1.5} />
      </Container>
    );
  }

  return null;
});
