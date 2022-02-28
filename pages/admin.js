import Head from "next/head";
import { Container, Grid } from "@mui/material";

import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import Footer from "../src/components/Footer";
import RecentOrders from "../src/components/RecentOrders";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";

function ApplicationsTransactions() {
  return (
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
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default withPageAuthRequired(ApplicationsTransactions);
