import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import PageTitle from "../../../../src/components/PageTitle";
import PageTitleWrapper from "../../../../src/components/PageTitleWrapper";
import Footer from "../../../../src/components/Footer";
import SuspenseLoader from "../../../../src/components/SuspenseLoader";
import TradesTable from "../../../../src/components/TradesTable";
import DateTimeRangePicker from "../../../../src/components/DateTimeRangePicker";

import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

const fetchOrders = async (account, trades, tickers, startTime, endTime) => {
  const url =
    `/api/ftx/${account}/${trades}` +
    `?tickers=${tickers}` +
    `&startTime=${startTime}&endTime=${endTime}`;

  const res = await fetch(url);
  return res.json();
};

const TradeTableWrapper = (props) => {
  if (props.isValidating || !props?.data) {
    return <SuspenseLoader size={64} />;
  } else if (props?.data?.results.length === 1) {
    return (
      <TradesTable
        notHedged={true}
        empty={props.empty}
        sx={{ paddingTop: "auto", marginTop: "auto" }}
        data={props.data}
      />
    );
  }
  return (
    <TradesTable
      empty={props.empty}
      sx={{ paddingTop: "auto", marginTop: "auto" }}
      data={props.data}
    />
  );
};

const Sub = (props) => {
  const router = useRouter();

  const { account, trades, tickers, future } = router.query;
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [timeRange, setTimeRange] = useState({
    startTime: null,
    endTime: null,
  });

  const { data, error, isValidating, mutate } = useSWR(
    account
      ? `/api/ftx/${account}/${trades}` +
          `?tickers=${tickers}` +
          `&startTime=${timeRange.startTime}&endTime=${timeRange.endTime}`
      : null,

    async (url) => {
      const res = await fetch(url);
      return await res.json();
    }
  );

  useEffect(() => {
    (async () => {
      if (error) {
        await router.push("/500");
      }
    })();
  }, [error, router]);

  return (
    <>
      <Head>
        <title>Sub Account {`${account}`}</title>
      </Head>
      <PageTitleWrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PageTitle
            sx={{ width: "auto" }}
            heading={`Audit - ${account}`}
            subHeading="Positions"
            noDoc={true}
          />
        </Box>
      </PageTitleWrapper>
      <Container>
        <Paper>
          <Box
            display="flex"
            width="100%"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 2, marginBottom: 4 }}
          >
            <DateTimeRangePicker
              loading={isValidating || !data}
              handleSubmit={(val: [string, string]) => {
                setTimeRange({
                  startTime: val[0],
                  endTime: val[1],
                });
              }}
            />
          </Box>
        </Paper>
        <TradeTableWrapper empty={empty} data={data} />
      </Container>
      <Footer />
    </>
  );
};

export default Sub;
