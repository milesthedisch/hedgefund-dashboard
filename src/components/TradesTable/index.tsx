import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";

const formatData = (props) => {
  if (props.notHedged) {
    return props.data.results[0].result;
  }

  if (props.data.orders.some((r) => r.length === 0)) {
    return [];
  }
  const a = new Set(
    props.data.orders.map((r) => r.map((x) => x.createdAt)).flat()
  );

  const b = Array.from(a);

  const c = b.filter((item, pos) => {
    return b.indexOf(item) == pos;
  });

  const getTradeFromUniqueDate = (data, date) => {
    const tradeInFirst = data.orders[1].filter((r) => {
      return r.createdAt === date;
    })[0];

    if (tradeInFirst) return tradeInFirst;

    const tradeInSecond = data.orders[0].filter((r) => {
      return r.createdAt === date;
    })[0];

    if (tradeInSecond) {
      return tradeInSecond;
    }
  };

  const d = c.map((x) => getTradeFromUniqueDate(props.data, x));

  const f = d.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return f;
};

const TradesTable = (props) => {
  const theme = useTheme();

  const formattedData = formatData(props);

  let tradesA;
  let tradesB;

  if (!props.notHedged) {
    tradesA =
      props.data.orders[0].length > 0 ? props.data.orders[0] : undefined;

    tradesB =
      props.data.orders[1].length > 0 ? props.data.orders[1] : undefined;
  }

  return (
    <>
      <Paper sx={{ my: 3 }}>
        <Typography sx={{ p: 2 }}>
          ** When funding payments that are negative are income
        </Typography>
        <Table sx={{ marginTop: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell>Total</TableCell>
              {props.notHedged ? (
                <TableCell>
                  {props.data.orders[0][0]
                    ? props.data.orders[0][0]?.market
                    : ""}
                </TableCell>
              ) : (
                <>
                  <TableCell>{props.tickers.split(",")[0]}</TableCell>
                  <TableCell>{props.tickers.split(",")[1]}</TableCell>
                  {props.summedFundingA && props.summedFundingB ? (
                    <>
                      <TableCell>
                        {props.tickers.split(",")[0]} Funding
                      </TableCell>
                      <TableCell>
                        {props.tickers.split(",")[1]} Funding
                      </TableCell>
                    </>
                  ) : (
                    <TableCell>Funding</TableCell>
                  )}
                  <TableCell>Borrow</TableCell>
                  <TableCell>PnL</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{props.summedOrders[0]}</TableCell>
              <TableCell>{props.summedOrders[1]}</TableCell>
              {props.data.groupedFunding ? (
                <>
                  <TableCell>{props.summedFundingA}</TableCell>
                  <TableCell>{props.summedFundingB}</TableCell>
                </>
              ) : (
                <TableCell>{props.summedFunding}</TableCell>
              )}
              <TableCell>{props.summedBorrowing || 0}</TableCell>
              {props.data.groupedFunding ? (
                <TableCell>
                  {props.summedFundingA + props.summedFundingB}
                </TableCell>
              ) : (
                <TableCell>
                  {props.summedFunding * -1 - (props.summedBorrowing || 0)}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Grid container>
        <Grid item lg={props.data?.spotMargin?.result?.length > 0 ? 4 : 6}>
          <Paper>
            <Table sx={{ marginTop: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  {props.notHedged ? (
                    <TableCell>
                      {props.data.results[0].result[0]
                        ? props.data.results[0].result[0]?.market
                        : ""}
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{props.tickers.split(",")[0]}</TableCell>
                      <TableCell>{props.tickers.split(",")[1]}</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {formattedData.map((x) => {
                  return (
                    <TableRow key={x.createdAt}>
                      <TableCell>
                        {new Date(x.createdAt).toLocaleString("en-AU")}
                      </TableCell>
                      {props.notHedged ? (
                        <TableCell>
                          {x.side === "sell" ? "-" + x.size : x.size}
                        </TableCell>
                      ) : (
                        <>
                          <TableCell>
                            {tradesA?.length > 0 &&
                            tradesA[0].market === x.market
                              ? x.side === "sell"
                                ? "-" + x.size
                                : x.size
                              : ""}
                          </TableCell>
                          <TableCell>
                            {tradesB?.length > 0 &&
                            tradesB[0]?.market === x.market
                              ? x.side === "sell"
                                ? "-" + x.size
                                : x.size
                              : ""}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item lg={props.data?.spotMargin?.result?.length > 0 ? 4 : 6}>
          <Table sx={{ marginTop: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell>Funding Payment Date</TableCell>
                {props.data.fundingA && props.data.fundingB ? (
                  <>
                    <TableCell>
                      {props.data.fundingA.result[0]?.future}
                    </TableCell>
                    <TableCell>
                      {props.data.fundingB.result[0]?.future}
                    </TableCell>
                  </>
                ) : (
                  <TableCell>Funding Payment</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.fundingA && props.data.fundingB
                ? Object.entries(props.data.groupedFunding).map((x) => {
                    return (
                      <TableRow key={new Date(x[0]).toLocaleString("en-AU")}>
                        <TableCell>
                          {new Date(x[0]).toLocaleString("en-AU")}
                        </TableCell>
                        <TableCell>{x[1][0].payment}</TableCell>
                        <TableCell>{x[1][1].payment}</TableCell>
                      </TableRow>
                    );
                  })
                : props.data?.funding
                ? props.data.funding
                    .sort((a, b) => {
                      return (
                        new Date(a.time).getTime() - new Date(b.time).getTime()
                      );
                    })
                    .map((x) => {
                      return (
                        <TableRow
                          key={
                            "funding-" +
                            new Date(x.time).toLocaleString("en-AU")
                          }
                        >
                          <TableCell>
                            {new Date(x.time).toLocaleString("en-AU")}
                          </TableCell>
                          <TableCell>{x.payment}</TableCell>
                        </TableRow>
                      );
                    })
                : ""}
            </TableBody>
          </Table>
        </Grid>
        {props.data?.spotMargin?.result?.length > 0 ? (
          <Grid item lg={4}>
            <Table sx={{ marginTop: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Borrow Payment Date</TableCell>
                  <TableCell>Borrow Payment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.data.spotMargin.result
                  .map((x) => {
                    return (
                      <TableRow
                        key={
                          "borrow-" + new Date(x.time).toLocaleString("en-AU")
                        }
                      >
                        <TableCell>
                          {new Date(x.time).toLocaleString("en-AU")}
                        </TableCell>
                        <TableCell>{x.feeUsd}</TableCell>
                      </TableRow>
                    );
                  })
                  .reverse()}
              </TableBody>
            </Table>
          </Grid>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};

export default TradesTable;
