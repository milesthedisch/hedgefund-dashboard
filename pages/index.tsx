import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
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
    const roles: any = user["https://app.balmoral.digital/roles"];

    console.log(roles);
    if (roles?.includes("admin")) {
      router.push("/admin/strategies");
    } else if (roles?.includes("audit")) {
      router.push("/admin/audit");
    } else {
      router.push("/dashboard");
    }
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
