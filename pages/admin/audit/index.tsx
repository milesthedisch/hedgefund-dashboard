import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import PageTitle from "../../../src/components/PageTitle";
import PageTitleWrapper from "../../../src/components/PageTitleWrapper";
import Footer from "../../../src/components/Footer";
import SuspenseLoader from "../../../src/components/SuspenseLoader";
import Link from "../../../src/components/Link";

import Head from "next/head";
import useSWR from "swr";

const SubAccount = (props: { href?; account: { nickname: string } }) => {
  return (
    <Card>
      <Link size="medium" href={`/admin/audit/${props.account.nickname}`}>
        {props.account.nickname}
      </Link>
    </Card>
  );
};

const Audit = () => {
  const { data, error, isValidating } = useSWR(
    "/api/ftx/accounts",
    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

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
          ) : data?.result?.length ? (
            data.result.map((acc: { nickname: string }, id: number) => {
              return (
                <Grid item key={acc.nickname + id} xs={12} md={6} lg={"auto"}>
                  <SubAccount account={acc} />
                </Grid>
              );
            })
          ) : (
            ""
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Audit;
