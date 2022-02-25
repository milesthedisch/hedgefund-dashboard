import * as React from "react";
import { Typography, Container, Box, Card } from "@mui/material";
import Link from "../src/components/Link";
import Head from "next/head";
import Copyright from "../src/components/Copyright";
import SignInOther from "../src/components/SignIn/auth0";
import SignIn from "../src/components/SignIn";
import { Button } from "@mui/material";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Head>
        <title>index</title>
      </Head>
      <Card sx={{ my: 10 }}>
        <Container>
          <SignInOther />
          <SignIn />
        </Container>
      </Card>
    </Container>
  );
}
