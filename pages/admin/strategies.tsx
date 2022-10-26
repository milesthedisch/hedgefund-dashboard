import { useState, useEffect, forwardRef, ChangeEvent } from "react";
import {
  CardContent,
  CardHeader,
  Card,
  Box,
  Container,
  Grid,
  Snackbar,
  TextField,
  Tab,
  Tabs,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import type { AlertColor } from "@mui/lab";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTheme, styled } from "@mui/material/styles";

import PageTitle from "../../src/components/PageTitle";
import PageTitleWrapper from "../../src/components/PageTitleWrapper";
import Footer from "../../src/components/Footer";
import StrategyForm from "../../src/components/StrategyForm";
import SuspenseLoader from "../../src/components/SuspenseLoader";
import StrategyHeader from "../../src/components/StrategyHeader";

import Head from "next/head";

import useSWR, { useSWRConfig } from "swr";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format } from "date-fns";

import { Strategies, StrategyTransactions } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { Fund } from "@prisma/client";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TabsWrapper = styled(Tabs)(
  () => `
  .MuiTabs-scrollableX {
    overflow-x: auto !important;
  }
`
);

interface Snackbar {
  open: boolean;
  severity: AlertColor;
  message?: string;
}

const fetcher = async (uri: string) => {
  const response = await fetch(uri);

  if (response.status !== 200) {
    throw await response.json();
  }

  return response.json();
};

const updateStrategies = async (
  mutateStrategy: Function,
  mutateCalcPrice: Function,
  strategyBalances = {},
  setSnackbar: Function,
  setLoadingState: Function
) => {
  setLoadingState(true);

  const uri = "/api/strategyTransactions/createMany";

  let response;

  try {
    response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(strategyBalances),
    });
  } catch (e) {
    return setSnackbar({
      open: true,
      severity: "error",
      message: e.message,
    });
  }

  const { count } = await response.json();

  setSnackbar({
    open: true,
    severity: "success",
    message: `${count} Strategies updated successfully`,
  });

  mutateStrategy();
  mutateCalcPrice();
  return setLoadingState(false);
};

const publishLiveSharePrice = async (
  sharePrice: number,
  setSnackbar: Function,
  setSharePriceLoading: Function,
  mutateLivePrice: Function,
  fund: Fund
) => {
  setSharePriceLoading(true);

  let response: any;

  try {
    response = await fetch("/api/sharePrice/create?fund=" + fund, {
      method: "POST",
      body: JSON.stringify({ sharePrice }),
    });
  } catch (e) {
    return setSnackbar({
      open: true,
      severity: "error",
      message: e,
    });
  }

  const res = await response.json();

  if (res.success) {
    mutateLivePrice();
    setSharePriceLoading(false);

    return setSnackbar({
      open: true,
      severity: "success",
      message: `Share price successfully published`,
    });
  }

  return setSnackbar({
    open: true,
    severity: "error",
    message: res.message,
  });
};

export default withPageAuthRequired(function(props) {
  const { mutate } = useSWRConfig();
  const theme = useTheme();

  const snackbarInital: Snackbar = {
    open: false,
    severity: "success",
    message: "Successful Update",
  };

  const [strategyBalances, setStrategyBalances] = useState([]);
  const [snackbar, setSnackbar] = useState(snackbarInital);
  const [strategiesLoading, setStrategiesLoading] = useState(false);
  const [sharePriceLoading, setSharePriceLoading] = useState(false);
  const [currentFund, setCurrentFund] = useState<Fund>(Fund.NEUTRAL);
  const [newSharePrice, setNewSharePrice] = useState(1);

  const tabs = Object.entries(Fund)
    .map(([key, value]) => ({
      label: key[0].toUpperCase() + key.split("").splice(1).join(""),
      value,
    }))
    .reverse();

  const handleTabsChange = (_event: ChangeEvent<{}>, value: Fund): void => {
    setCurrentFund(value);
  };

  type StrategyData = (Strategies & {
    strategyTransactions: StrategyTransactions[];
  } & { updateOn: Date | String; balance: Decimal | number })[];

  const {
    data,
    error,
    isValidating,
    mutate: mutateStrategy,
  } = useSWR("/api/strategies?fund=" + currentFund, fetcher);

  const {
    data: calcPrice,
    error: calcPriceError,
    isValidating: calcPriceIsValidating,
    mutate: mutateCalcPrice,
  } = useSWR("/api/calcPrice?fund=" + currentFund, fetcher);

  const {
    data: livePrice,
    error: livePriceError,
    isValidating: livePriceIsValidating,
    mutate: mutateLivePrice,
  } = useSWR("/api/sharePrice?latest=true&fund=" + currentFund, fetcher);

  useEffect(() => {
    if (livePriceError || calcPriceError) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `${livePriceError?.message || ""} ${calcPriceError?.message || ""
          }`,
      });
    }
  }, [livePriceError, calcPriceError]);

  let strategies: React.ElementType[];

  if (data?.length) {
    strategies = data.map((strat) => {
      if (strat.strategyTransactions.length) {
        const time = strat.strategyTransactions[0]?.datetime;
        strat.updateOn = format(new Date(time), "PPpp");
        strat.balance = strat.strategyTransactions[0]?.balance;
        return (
          <StrategyForm
            key={strat.id}
            {...strat}
            setStrategyBalances={setStrategyBalances}
          />
        );
      }
    });
  }

  return (
    <>
      <Head>
        <title>Strategies</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading={
              <TabsWrapper
                onChange={handleTabsChange}
                value={currentFund}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </TabsWrapper>
            }
            subHeading="Balances for each strategy"
            noDoc={true}
          />
          <StrategyHeader
            prices={{
              calc: calcPrice,
              live: livePrice?.price,
              validating: calcPriceIsValidating || livePriceIsValidating,
            }}
            name={currentFund}
          />
        </Box>
      </PageTitleWrapper>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxWidth="lg"
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {!isValidating ? (
            <>
              {strategies}
              <Grid
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
                xs={12}
              >
                <Grid item xs={12} sm={4}>
                  <Card sx={{ textAlign: "center" }}>
                    <CardHeader title="Live Share Price" />
                    <CardContent>
                      <TextField
                        sx={{ width: "100%" }}
                        label="Insert new share price"
                        onChange={(e) => setNewSharePrice(+e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <LoadingButton
                              onClick={() => {
                                publishLiveSharePrice(
                                  newSharePrice,
                                  setSnackbar,
                                  setSharePriceLoading,
                                  mutateLivePrice,
                                  currentFund
                                );
                              }}
                              loading={sharePriceLoading}
                            >
                              Publish
                            </LoadingButton>
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box>
              <SuspenseLoader size={64} />
            </Box>
          )}
        </Grid>
        <LoadingButton
          loading={strategiesLoading}
          sx={{ my: 3 }}
          variant="contained"
          onClick={() =>
            updateStrategies(
              mutateStrategy,
              mutateCalcPrice,
              strategyBalances,
              setSnackbar,
              setStrategiesLoading
            )
          }
        >
          UPDATE STRATAGIES
        </LoadingButton>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ open: false, severity: "success" })}
          message="Note archived"
        >
          <Alert
            onClose={() => setSnackbar({ open: false, severity: "success" })}
            severity={snackbar?.severity || "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
});
