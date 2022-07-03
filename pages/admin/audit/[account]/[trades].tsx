import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import PageTitle from "../../../../src/components/PageTitle";
import PageTitleWrapper from "../../../../src/components/PageTitleWrapper";
import Footer from "../../../../src/components/Footer";
import SuspenseLoader from "../../../../src/components/SuspenseLoader";
import TradesTable from "../../../../src/components/TradesTable";

import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

const Sub = (props) => {
  const router = useRouter();

  const { account, trades, tickers } = router.query;

  const { data, error, isValidating } = useSWR(
    account ? `/api/ftx/${account}/${trades}?tickers=${tickers}` : null,
    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  return (
    <>
      <Head>
        <title>Sub Account {`${account}`}</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading={`Audit - ${account}`}
            subHeading="Positions"
            noDoc={true}
          />
        </Box>
      </PageTitleWrapper>
      <Container>
        <Grid
          container
          direction="row-reverse"
          rowSpacing={{ xs: 3, lg: "auto" }}
          columnSpacing={3}
          justifyContent={"center"}
        >
          {isValidating || (!data && !error) ? (
            <SuspenseLoader size={64} />
          ) : data?.results ? (
            <TradesTable data={data} />
          ) : (
            ""
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Sub;
