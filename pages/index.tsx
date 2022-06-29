import * as React from "react";
import { Container, Box, Card, Button } from "@mui/material";
import Head from "next/head";
import SignIn from "../src/components/SignIn";
import LinkButton from "../src/components/Link";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

export default function Index() {
  const { user, error, isLoading } = useUser();

  const router = useRouter();

  if (error) {
    router.push("/500");
  }

  if (user) {
    router.push("/dashboard");
  }

  return (
    <Container maxWidth="sm">
      <Head>
        <title>index</title>
      </Head>
      <Card sx={{ my: 10 }}>
        <Container>
          <Box sx={{ my: 10 }}>
            <SignIn />
          </Box>
        </Container>
      </Card>
    </Container>
  );
}
