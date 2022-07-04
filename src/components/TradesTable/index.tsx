import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";
const TradeTableCell = (props) => {};

const formatData = (props) => {
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

    return data.results[0].result.filter((r) => {
      return r.createdAt === date;
    })[0];
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
  const tradesA =
    props.data.results[0].result.length > 0
      ? props.data.results[0].result
      : undefined;

  const tradesB =
    props.data.results[1].result.length > 0
      ? props.data.results[1].result
      : undefined;

  return (
    <Table sx={{ marginTop: "auto" }}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>{tradesA ? tradesA[0].market : ""}</TableCell>
          <TableCell>{tradesB ? tradesB[0].market : ""}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {formattedData.map((x) => {
          return (
            <TableRow key={x.createdAt}>
              <TableCell>
                {new Date(x.createdAt).toLocaleString("en-AU")}
              </TableCell>
              <TableCell>
                {props.data.results[0].result[0].market === x.market
                  ? x.side === "sell"
                    ? "-" + x.size
                    : x.size
                  : ""}
              </TableCell>
              <TableCell>
                {props.data.results[1].result[1].market === x.market
                  ? x.side === "sell"
                    ? "-" + x.size
                    : x.size
                  : ""}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TradesTable;
