import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0";

import type { AppProps } from "next/app";
import createEmotionCache from "../src/utility/createEmotionCache";
import CustomThemeProvider from "../src/theme/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { LightTheme } from "../src/theme/schemes/LightTheme";
import Layout from "../src/layouts";
import { SWRConfigurationProvider } from "../src/utility/SWRConfigurationProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CustomThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SWRConfigurationProvider>
          <UserProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserProvider>
        </SWRConfigurationProvider>
      </CustomThemeProvider>
    </CacheProvider>
  );
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default MyApp;
