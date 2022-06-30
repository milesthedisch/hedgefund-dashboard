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

const ApplicationsTransactions = ({
  userData,
  calcPrice,
  productionUnitPrice,
}) => (
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
          <Users
            userData={userData}
            calcPrice={calcPrice}
            productionUnitPrice={productionUnitPrice}
          />
        </Grid>
      </Grid>
    </Container>
    <Footer />
  </>
);

const fetcher = async (uri: string, bodyData: object) => {
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

  const {
    data: userData,
    error: uError,
    isValidating: uIsValidating,
  } = useSWR(() => {
    if (isAdmin) {
      return "/api/user";
    } else {
      return false;
    }
  }, fetcher);

  const {
    data: productionUnitPrice,
    error: pError,
    isValidating: pIsValidating,
  } = useSWR(`/api/sharePrice?latest=true`, fetcher);

  const {
    data: calcPrice,
    error: cError,
    isValidating: cIsValidating,
  } = useSWR(`/api/calcPrice`, fetcher);

  if (!isAdmin || userData?.redirect) {
    return <Custom401 />;
  }

  if ((!userData && uIsValidating) || cIsValidating || pIsValidating) {
    return (
      <Container
        sx={{ height: "80vh", display: "flex", justifyContent: "center" }}
      >
        {/* The default value size is 64 */}
        <SuspenseLoader size={64 * 1.5} />
      </Container>
    );
  }

  if (userData && productionUnitPrice && calcPrice) {
    if (userData.users.length) {
      userData.users.forEach((u) => {
        if (u.transactions.length) {
          const purchased = u.transactions
            .filter((tx) => {
              return tx.type === "PURCHASE";
            })
            .map((tx) => tx.units)
            .map(parseFloat)
            .reduce((a, b) => a + b);

          let redeemed = u.transactions.filter((tx) => {
            return tx.type === "REDEMPTION";
          });

          if (!redeemed.length) {
            redeemed = 0;
          } else {
            redeemed = redeemed
              .map((tx) => tx.units)
              .map(parseFloat)
              .reduce((a, b) => a + b);
          }

          u.totalUnits = purchased - redeemed;
        }
      });
    }

    return (
      <ApplicationsTransactions
        userData={userData}
        productionUnitPrice={productionUnitPrice.price}
        calcPrice={calcPrice}
      />
    );
  }

  return null;
});
