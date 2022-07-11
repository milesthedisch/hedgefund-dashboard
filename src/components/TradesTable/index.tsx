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

  const a = new Set(
    props.data.results.map((r) => r.result.map((x) => x.createdAt)).flat()
  );

  const b = Array.from(a);

  const c = b.filter((item, pos) => {
    return b.indexOf(item) == pos;
  });

  const getTradeFromUniqueDate = (data, date) => {
    const tradeInFirst = data.results[1].result.filter((r) => {
      return r.createdAt === date;
    })[0];

    if (tradeInFirst) return tradeInFirst;

    const tradeInSecond = data.results[0].result.filter((r) => {
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
      props.data.results[0].result.length > 0
        ? props.data.results[0].result
        : undefined;

    tradesB =
      props.data.results[1].result.length > 0
        ? props.data.results[1].result
        : undefined;
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
                  {props.data.results[0].result[0]
                    ? props.data.results[0].result[0]?.market
                    : ""}
                </TableCell>
              ) : (
                <>
                  <TableCell>{props.tickers.split(",")[0]}</TableCell>
                  <TableCell>{props.tickers.split(",")[1]}</TableCell>
                  <TableCell>Funding</TableCell>
                  <TableCell>Borrow</TableCell>
                  <TableCell>PnL</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{props.summedPositions[0]}</TableCell>
              <TableCell>{props.summedPositions[1]}</TableCell>
              <TableCell>{props.summedFunding}</TableCell>
              <TableCell>{props.summedBorrowing || 0}</TableCell>
              <TableCell>
                {props.summedFunding - (props.summedBorrowing || 0)}
              </TableCell>
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
                <TableCell>Funding Payment Date</TableCell>{" "}
                <TableCell>Funding Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.funding.result
                .sort((a, b) => {
                  return (
                    new Date(a.time).getTime() - new Date(b.time).getTime()
                  );
                })
                .map((x) => {
                  return (
                    <TableRow key={new Date(x.time).toLocaleString("en-AU")}>
                      <TableCell>
                        {new Date(x.time).toLocaleString("en-AU")}
                      </TableCell>
                      <TableCell>{x.payment}</TableCell>
                    </TableRow>
                  );
                })}
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
                {props.data.spotMargin.result.map((x) => {
                  return (
                    <TableRow key={new Date(x.time).toLocaleString("en-AU")}>
                      <TableCell>
                        {new Date(x.time).toLocaleString("en-AU")}
                      </TableCell>
                      <TableCell>{x.cost}</TableCell>
                    </TableRow>
                  );
                })}
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
