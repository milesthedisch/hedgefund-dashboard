import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Snackbar from "@mui/material/Snackbar";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import type { AlertColor } from "@mui/lab";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import SuspenseLoader from "../../src/components/SuspenseLoader";
import Link from "../../src/components/Link";

import Head from "next/head";
import useSWR from "swr";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Snackbar {
  open: boolean;
  severity?: AlertColor;
  message?: string;
}

const SubAccount = (props: { href?; account: { nickname: string } }) => {
  return (
    <Card>
      <Link size="medium" href={`/account/${props.account.nickname}`}>
        {props.account.nickname}
      </Link>
    </Card>
  );
};

const Audit = () => {
  const [snackbar, setSnackbar] = useState<Snackbar>({
    open: false,
  });

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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false })}
        message="Note archived"
      >
        <Alert
          onClose={() => setSnackbar({ open: false })}
          severity={snackbar?.severity || "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default Audit;
