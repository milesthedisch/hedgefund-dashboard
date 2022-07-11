import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import SuspenseLoader from "../../../../src/components/SuspenseLoader";
import PageTitle from "../../../../src/components/PageTitle";
import PageTitleWrapper from "../../../../src/components/PageTitleWrapper";
import Footer from "../../../../src/components/Footer";
import CurrentPositions from "../../../../src/components/CurrentPositions";
import Link from "../../../../src/components/Link";

import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

const Sub = () => {
  const router = useRouter();
  const { account } = router.query;

  const { data, error, isValidating } = useSWR(
    account ? `/api/ftx/${account}/positions` : null,
    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  const { data: bData, error: bError } = useSWR(
    data ? `/api/ftx/${account}/balances` : null,
    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  console.log(data);
  const noPositions = data?.result?.length === 0;

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
        <Stack alignItems="center" justifyContent="center">
          <Typography
            textAlign="center"
            justifyContent="center"
            sx={{ p: 2, m: 2 }}
            variant="h2"
          >
            {data && noPositions ? "No Current Positions" : "Current Positions"}
          </Typography>

          <CurrentPositions
            data={data}
            error={error}
            isValidating={isValidating}
            account={account}
          />
          {noPositions && data ? (
            <Link
              variant="outlined"
              href="/"
              size="large"
              sx={{ width: "200px" }}
            >
              Get All Orders
            </Link>
          ) : (
            ""
          )}

          <Typography
            textAlign="center"
            justifyContent="center"
            sx={{ p: 2, m: 2 }}
            variant="h2"
          >
            Current Balances
          </Typography>

          {!bData ? (
            <SuspenseLoader size={64} />
          ) : (
            <Grid container spacing={3} justifyContent="space-between">
              {bData?.balances?.result.map((balance) => {
                return (
                  <Grid sm={6} key={balance.coin} item>
                    <Paper>
                      <Card>
                        <CardHeader
                          title={balance.coin}
                          subheader={balance.total}
                        />
                      </Card>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Container>

      <Footer />
    </>
  );
};

export default Sub;
