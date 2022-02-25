import * as React from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CircularProgress,
} from "@mui/material";
import Head from "next/head";
import SignInOther from "../src/components/SignIn/auth0";
import SignIn from "../src/components/SignIn";
import SuspenseLoader from "../src/components/SuspenseLoader";
import { useUser } from "@auth0/nextjs-auth0";

export default function Index() {
  const { user, error, isLoading } = useUser();

  console.log(user, error, isLoading);

  return (
    <Container maxWidth="sm">
      <Head>
        <title>index</title>
      </Head>
      <Card sx={{ my: 10 }}>
        <Container>
          <Box sx={{ my: 10 }}>
            {isLoading ? (
              <Box
                sx={{ width: "100%", height: "100%" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress size={64} thickness={3} />
              </Box>
            ) : (
              ""
            )}
            {!isLoading && user ? (
              <a href="/api/auth/logout">logout</a>
            ) : (
              <SignInOther />
            )}
          </Box>
        </Container>
      </Card>
    </Container>
  );
}
