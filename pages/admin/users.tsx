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

import userTotalUnits from "../../util/userTotalUnits";
import { ProductionSharePrice } from "@prisma/client";

const ApplicationsTransactions = ({
  userData,
  calcPrice,
  productionUnitPrice,
}) => (
  <>
    <Head>
      <title>Users</title>
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
    props?.user["https://app.balmoral.digital/roles"].includes("admin");

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
  } = useSWR<ProductionSharePrice[]>(
    `/api/sharePrice?latest=true&fund=NEUTRAL&fund=MOMENTUM`,
    fetcher
  );

  const {
    data: calcPrice,
    error: cError,
    isValidating: cIsValidating,
  } = useSWR(`/api/calcPrice?fund=NEUTRAL&fund=MOMENTUM`, fetcher);

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
      // Mutating the user object so our dumb components can have the correctly formatted data
      userData.users.forEach((u) => {
        u.totalUnits = {
          momentum: userTotalUnits(u, "MOMENTUM"),
          neutral: userTotalUnits(u, "NEUTRAL"),
        };
      });
    }

    return (
      <ApplicationsTransactions
        userData={userData}
        productionUnitPrice={productionUnitPrice}
        calcPrice={calcPrice}
      />
    );
  }

  return null;
});
