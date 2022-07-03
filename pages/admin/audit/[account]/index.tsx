import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import PageTitle from "../../../../src/components/PageTitle";
import PageTitleWrapper from "../../../../src/components/PageTitleWrapper";
import Footer from "../../../../src/components/Footer";
import SuspenseLoader from "../../../../src/components/SuspenseLoader";
import Link from "../../../../src/components/Link";

import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import { useTheme } from "@mui/material/styles";

const BasisTrade = (props) => {
  const theme = useTheme();

  return (
    <Card sx={{ width: "auto" }}>
      <Link
        sx={{ width: "100%" }}
        href={`/admin/audit/${props.account}/${
          props.tradeName
        }?tickers=${props.positions.map((p) => p.future).join(",")}`}
      >
        {props.tradeName}
      </Link>
      <Grid direction="row" container>
        {props.positions.map((p, id) => {
          return (
            <Grid key={props.tradeName + "-trade-" + id} item>
              <CardHeader subheader={p.future} />
              <CardHeader title={p.size} subheader="Position size" />
              <CardHeader
                title={p.side === "buy" ? "long" : "short"}
                sx={{
                  color:
                    p.side === "buy"
                      ? theme.colors.success.main
                      : theme.colors.error.main,
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      ;
    </Card>
  );
};

const Sub = (props) => {
  const router = useRouter();
  const { account } = router.query;

  const { data, error, isValidating } = useSWR(
    account ? `/api/ftx/${account}/positions` : null,
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
          ) : data?.result ? (
            Object.keys(data.result).map((key: string, id: number) => {
              return (
                <Grid item key={key + id} xs={12} md={6} lg={"auto"}>
                  <BasisTrade
                    account={account}
                    tradeName={key}
                    positions={data.result[key]}
                  />
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

export default Sub;
