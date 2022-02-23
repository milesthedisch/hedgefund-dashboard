import * as React from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ProTip from "../src/ProTip";
import Link from "../src/components/Link";
import Copyright from "../src/Copyright";
import { ThemeContext } from "../src/theme/ThemeProvider";

export default function About() {
  const { setThemeName, themeName } = React.useContext(ThemeContext);

  return (
    <Container maxWidth="sm">
      <Head>
        <title>about</title>
      </Head>

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Button component={Link} noLinkStyle href="/">
          Go to the main page
        </Button>
        <Button onClick={() => setThemeName("DarkTheme")}>Dark Theme</Button>
        <Button onClick={() => setThemeName("LightTheme")}>Light Theme</Button>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
