import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

import PageTitle from "../../../../src/components/PageTitle";
import PageTitleWrapper from "../../../../src/components/PageTitleWrapper";
import Footer from "../../../../src/components/Footer";
import SuspenseLoader from "../../../../src/components/SuspenseLoader";
import TradesTable from "../../../../src/components/TradesTable";
import DateAndTimePicker from "../../../../src/components/DateAndTimePicker";

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
const StyledSearchIcon = styled(SearchIcon)(
  ({ theme }) => `
    margin-right: 0px;
    margin-left: 0px;
`
);

const SearchButton = styled(LoadingButton)(
  ({ theme }) => `
    .MuiButtonBase-root > span {
      margin: 0;
    }

    .MuiButton-startIcon {
      margin:0
    }
`
);

const Sub = (props) => {
  const router = useRouter();

  const { account, trades, tickers } = router.query;
  const [startTradeDateTime, setStartTradeDateTime] = useState("null");
  const [endTradeDateTime, setEndDateTradeTime] = useState("null");
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(true);

  const { data, error, isValidating, mutate } = useSWR(
    account && shouldUpdate
      ? `/api/ftx/${account}/${trades}` +
          `?tickers=${tickers}` +
          `&startTime=${startTradeDateTime}&endTime=${endTradeDateTime}`
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

    if (isValidating || !data) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [error, router, data, loading, isValidating]);

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
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2, marginBottom: 4 }}
        >
          <DateAndTimePicker
            value={startTradeDateTime}
            handleChange={setStartTradeDateTime}
            label={"Start"}
          />
          <Box sx={{ p: 2 }} textAlign="center" width="50px">
            to
          </Box>
          <DateAndTimePicker
            value={endTradeDateTime}
            handleChange={setEndDateTradeTime}
            label={"End"}
          />
          <SearchButton
            loading={loading}
            size="large"
            color="primary"
            aria-label="upload picture"
            sx={{
              marginLeft: 2,
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            startIcon={<StyledSearchIcon />}
            onClick={async () => {
              const newData = await fetchOrders(
                account,
                trades,
                tickers,
                startTradeDateTime,
                endTradeDateTime
              );

              console.log(newData);
              await mutate({ ...newData });
            }}
          ></SearchButton>
        </Box>
        {isValidating || !data ? (
          <SuspenseLoader size={64} />
        ) : data?.results ? (
          <TradesTable
            empty={empty}
            sx={{ paddingTop: "auto", marginTop: "auto" }}
            data={data}
          />
        ) : (
          ""
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Sub;
