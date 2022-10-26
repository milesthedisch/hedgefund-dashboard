import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import SuspenseLoader from "../SuspenseLoader";
import Link from "../Link";

import { useTheme } from "@mui/material/styles";

const CurrentPositions = (props: { isValidating; data; error; account }) => {
  const theme = useTheme();

  const PositionCard = (props) => {
    return (
      <Card sx={{ width: "auto" }}>
        <Link
          sx={{ width: "100%" }}
          href={`/admin/audit/${props.account}/trade/?tickers=${props.positions
            .map((p) => p.future || p.coin)
            .join(",")}`}
        >
          {props.tradeName}
        </Link>
        <CardHeader
          title={props.positions.length === 1 ? "Regular" : "Basis Trade"}
        />
        <Grid direction="row" container>
          {props.positions.map((p, id) => {
            if (p.coin) {
              return (
                <Grid key={props.tradeName + "-trade-" + id} item>
                  <CardHeader subheader={p.coin + " Spot"} />
                  <CardHeader title={p.total} subheader="Position size" />
                  <CardHeader
                    title={p.total > 0 ? "long" : "short"}
                    sx={{
                      color:
                        p.total > 0
                          ? theme.colors.success.main
                          : theme.colors.error.main,
                    }}
                  />
                </Grid>
              );
            }
            return (
              <Grid key={props.tradeName + "-trade-" + id} item>
                <CardHeader subheader={p.future} />
                <CardHeader title={p.size} subheader="Position size" />
                <CardHeader
                  title={p.side === "buy" ? "long" : "short"}
                  sx={{
                    color:
                      p.side === "buy"
                        ? theme.colors.success.main
                        : theme.colors.error.main,
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        ;
      </Card>
    );
  };

  return (
    <Grid
      container
      direction="row-reverse"
      rowSpacing={{ xs: 3 }}
      columnSpacing={3}
      justifyContent={"center"}
    >
      {props.isValidating || (!props.data && !props.error) ? (
        <SuspenseLoader size={64} />
      ) : props.data?.result ? (
        Object.keys(props.data.result).map((key: string, id: number) => {
          return (
            <Grid item key={key + id} xs={12} md={6} lg={"auto"}>
              <PositionCard
                account={props.account}
                tradeName={key}
                positions={props.data.result[key]}
              />
            </Grid>
          );
        })
      ) : (
        ""
      )}
    </Grid>
  );
};

export default CurrentPositions;
