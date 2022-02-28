import * as React from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CircularProgress,
  Anchor,
  Button,
} from "@mui/material";
import Head from "next/head";
import SignInOther from "../src/components/SignIn/auth0";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

export default function Index() {
  const { user, error, isLoading } = useUser();

  const router = useRouter();

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
            {user ? (
              <Button
                component={Anchor}
                href="/api/auth/logout"
                fullWidth
                variant="outlined"
              >
                Log Out
              </Button>
            ) : (
              <SignInOther />
            )}
          </Box>
        </Container>
      </Card>
    </Container>
  );
}
