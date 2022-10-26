import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/system";

import PageTitle from "../../../src/components/PageTitle";
import PageTitleWrapper from "../../../src/components/PageTitleWrapper";
import Footer from "../../../src/components/Footer";
import SuspenseLoader from "../../../src/components/SuspenseLoader";
import Link from "../../../src/components/Link";

import Head from "next/head";
import useSWR, { useSWRConfig } from "swr";

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
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { mutate } = useSWRConfig();

  const { data, error, isValidating } = useSWR(
    "/api/ftx/accounts",
    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  const {
    data: aggrData,
    error: aggrError,
    isValidating: aggrIsValidating,
  } = useSWR(loading ? "/api/ftx/accounts/aggregatePnl" : null, async (uri) => {
    const res = await fetch(uri);
    try {
      if (res.status === 200) {
        return await res.json();
      } else {
        throw await res.json();
      }
    } catch (e) {
      console.error(e);
      throw res;
    }
  });

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
          {isValidating || (!data && !error) || aggrIsValidating ? (
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
        <Grid
          container
          rowSpacing={{ xs: 3, lg: "auto" }}
          columnSpacing={3}
          justifyContent="center"
          sx={{ py: 6 }}
        >
          <Grid item>
            <LoadingButton
              loading={aggrIsValidating}
              variant="contained"
              onClick={() => setLoading(!loading)}
            >
              Get Aggregate PNL 2022
            </LoadingButton>
          </Grid>
        </Grid>
        <Grid
          container
          rowSpacing={{ xs: 3, lg: "auto" }}
          columnSpacing={3}
          justifyContent="center"
          sx={{ py: 6 }}
        >
          {!aggrIsValidating && aggrData
            ? aggrData.results.map((aggr) => {
              const profit = aggr.summedFundings * -1 - aggr.borrows;

              return (
                <Grid item key={aggr.subAccount} xs={12} md={6} lg={"auto"}>
                  <Card>
                    <CardHeader title={aggr.subAccount}></CardHeader>
                    <CardContent>
                      <Typography sx={{ p: 1 }}>
                        Funding: {aggr.summedFundings * -1}
                      </Typography>
                      <Typography sx={{ p: 1 }}>
                        Borrowed: {aggr.borrows}
                      </Typography>
                      {profit > 0 ? (
                        <Typography sx={{ color: "green", p: 1 }}>
                          PnL: {profit}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "red", p: 1 }}>
                          PnL: {profit}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
            : ""}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Audit;
