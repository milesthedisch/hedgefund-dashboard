import Head from "next/head";
import PageHeader from "../src/components/PageHeader";
import PageTitleWrapper from "../src/components/PageTitleWrapper";
import { Container, Grid } from "@mui/material";
import Footer from "../src/components/Footer";

import AccountBalance from "../src/components/AccountBalance";
import AccountSecurity from "../src/components/AccountSecurity";

function DashboardCrypto() {
  return (
    <Container>
      <Head>
        <title>Crypto Dashboard</title>
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
            <AccountBalance />
          </Grid>
          <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Container>
  );
}

export default DashboardCrypto;
