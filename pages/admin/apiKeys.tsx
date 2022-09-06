import { Container, Grid } from "@mui/material";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import SuspenseLoader from "../../src/components/SuspenseLoader";
import ApiKeyTable from "../../src/components/ApiKeyTable";

import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format } from "date-fns";
import type { ApiKey } from "@prisma/client";

const fetcher = async (uri: string) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(function () {
  const { data, error, isValidating } = useSWR("/api/apiKeys", fetcher);

  if (isValidating) {
    return (
      <Container
        sx={{ height: "80vh", display: "flex", justifyContent: "center" }}
      >
        {/* The default value size is 64 */}
        <SuspenseLoader size={64 * 1.5} />
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Api Keys</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          sx={{ width: "auto" }}
          heading="API Keys"
          subHeading="List of API Keys"
          noDoc={true}
        />
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
          <Grid item xs={12}>
            <ApiKeyTable apiKeys={data} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
});
