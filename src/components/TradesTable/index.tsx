import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";

const TradesTable = (props) => {
  const theme = useTheme();
  // TODO Make trades table ordered by time descending

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

  console.log(d.filter((y) => y.remainingSize > 0));

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>{props.data.results[0].result[0].market}</TableCell>
          <TableCell>{props.data.results[1].result[1].market}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {d.map((x) => {
          return (
            <TableRow key={x.createdAt}>
              <TableCell>{new Date(x.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {props.data.results[0].result[0].market === x.market
                  ? x.side === "sell"
                    ? x.size + " sell "
                    : x.size + " buy"
                  : ""}
              </TableCell>
              <TableCell>
                {props.data.results[1].result[1].market === x.market
                  ? x.side === "sell"
                    ? x.size + " sell "
                    : x.size + " buy"
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
