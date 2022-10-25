import { CardHeader, Card, Box, Typography } from "@mui/material";

const currencyUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type Prices = {
  calc?: number;
  live?: number;
  validating: boolean;
};

export default function StrategyHeader({
  prices,
  name,
}: {
  prices: Prices;
  name: string;
}) {
  return (
    <Box
      display="flex"
      sx={{ flexGrow: 0.05, justifyContent: "space-between" }}
    >
      <Card>
        <CardHeader
          sx={{ textAlign: "right" }}
          title={`Calculated ${name.toUpperCase()} Fund`}
          subheader={
            prices.validating ? (
              "..."
            ) : (
              <Typography>
                {!prices.calc
                  ? "Unavailable"
                  : `${currencyUSD.format(prices.calc || 0)}`}
              </Typography>
            )
          }
        ></CardHeader>
      </Card>
      <Card>
        <CardHeader
          sx={{ textAlign: "right" }}
          title={`Live ${name} Fund`}
          subheader={
            prices.validating ? (
              "..."
            ) : (
              <Typography>
                {!prices.live
                  ? "Unavailable"
                  : `${currencyUSD.format(prices.live || 0)}`}
              </Typography>
            )
          }
        ></CardHeader>
      </Card>
    </Box>
  );
}
