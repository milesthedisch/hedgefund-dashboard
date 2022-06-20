import Head from "next/head";
import { Container, Grid } from "@mui/material";

import PageHeader from "../../src/components/PageHeader";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import Users from "../../src/components/Users";
import SuspenseLoader from "../../src/components/SuspenseLoader";
import Custom401 from "../401";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import router from "next/router";
import useSWR from "swr";

const ApplicationsTransactions = ({ data }) => (
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
          <Users users={data.users} />
        </Grid>
      </Grid>
    </Container>
    <Footer />
  </>
);

const fetcher = async (uri: string) => {
  const response = await fetch(uri);

  if (response.status > 200) {
    throw response;
  }

  return response.json();
};

export default withPageAuthRequired(function (props) {
  const isAdmin =
    props?.user["https://balmoral-dashboard.vercel.com/roles"].includes(
      "admin"
    );

  const { data, error, isValidating } = useSWR(() => {
    if (isAdmin) {
      return "/api/user";
    } else {
      return false;
    }
  }, fetcher);

  if (!isAdmin || data?.redirect) {
    return <Custom401 />;
  }

  if (data) {
    return <ApplicationsTransactions data={data} />;
  }

  if (!data && isValidating) {
    return (
      <Container
        sx={{ height: "80vh", display: "flex", justifyContent: "center" }}
      >
        {/* The default value size is 64 */}
        <SuspenseLoader size={64 * 1.5} />
      </Container>
    );
  }

  return null;
});
