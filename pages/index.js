import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProTip from "../src/ProTip";
import Link from "../src/components/Link";
import Head from "next/head";
import Copyright from "../src/Copyright";
import { Button } from "@mui/material";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Head>
        <title>index</title>
      </Head>
      <Box sx={{ my: 4 }}>
        <Button component={Link} href="/dashboard">
          Dashboard
        </Button>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
