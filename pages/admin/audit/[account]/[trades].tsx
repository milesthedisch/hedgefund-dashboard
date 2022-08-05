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

const TradeTableWrapper = (props) => {
  if (props.isValidating || !props?.data) {
    return <SuspenseLoader size={64} />;
  } else if (props?.data?.orders?.length === 1) {
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
      tickers={props.tickers}
      summedBorrowing={props.summedBorrowing}
      summedFunding={props.summedFunding}
      summedOrders={props.summedOrders}
      summedFundingA={props.summedFundingA}
      summedFundingB={props.summedFundingB}
    />
  );
};

const Sub = (props) => {
  const router = useRouter();

  const { account, trades, tickers, future } = router.query;
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

  let summedFundingA = 0;
  let summedFundingB = 0;
  let summedOrders = 0;
  let summedFunding = 0;
  let summedBorrowing = 0;

  if (data) {
    summedOrders = data.orders.map((ord) => {
      if (ord.length === 1) {
        return ord[0].side === "buy" ? ord[0].size : ord[0].size * -1;
      }

      if (ord.length > 0) {
        return ord.reduce((p, n, i) => {
          if (i === 1) {
            return p.side === "buy" ? p.size : p.size * -1;
          }

          let nextTrade = n.side === "buy" ? n.size : n.size * -1;
          return p + nextTrade;
        });
      }

      return 0;
    });

    if (data.fundingA && data.fundingB) {
      if (data.fundingA.result.length > 0) {
        summedFundingA = data.fundingA.result
          .map((x) => x.payment)
          .reduce((fp, fn) => {
            return fp + fn;
          });
      }

      if (data.fundingB.result.length > 0) {
        summedFundingB = data.fundingB.result
          .map((x) => x.payment)
          .reduce((fp, fn) => {
            return fp + fn;
          });
      }
    } else {
      summedFunding =
        data.funding.length > 0
          ? data.funding
              .map((x) => x.payment)
              .reduce((fp, fn) => {
                return fp + fn;
              })
          : 0;
    }

    if (data.spotMargin && data.spotMargin.result.length > 0) {
      summedBorrowing = data.spotMargin
        ? data.spotMargin?.result
            .map((x) => x.feeUsd)
            .reduce((fp, fn) => {
              return fp + fn;
            })
        : undefined;
    } else {
      summedBorrowing = 0;
    }
  }

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
        <TradeTableWrapper
          data={data}
          summedBorrowing={summedBorrowing}
          summedFunding={summedFunding}
          summedOrders={summedOrders}
          summedFundingA={summedFundingA}
          summedFundingB={summedFundingB}
          tickers={tickers}
        />
      </Container>
      <Footer />
    </>
  );
};

export default Sub;
