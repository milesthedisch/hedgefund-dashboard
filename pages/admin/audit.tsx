import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import SuspenseLoader from "../../src/components/SuspenseLoader";

import Head from "next/head";

const Audit = () => {
  return (
    <>
      <Head>
        <title>Audit</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading="Audit"
            subHeading="Accounts and Trades"
            noDoc={true}
          />
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
          <Box>
            <SuspenseLoader size={64} />
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Audit;
