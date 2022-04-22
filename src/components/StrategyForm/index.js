import Head from "next/head";
import {
  Grid,
  CardHeader,
  Card,
  CardContent,
  Box,
  TextField,
  Divider,
  Button,
  Typography,
} from "@mui/material";

export default function StrategyForm({ balance, name, id, updateOn }) {
  return (
    <Grid key={id} item xs={6}>
      <Card>
        <CardHeader sx={{ textTransform: "capitalize" }} title={name} />
        <Divider />
        <CardContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              alignItems: "flex-end",
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <TextField
                sx={{ width: "90%", margin: 0 }}
                id="standard-number"
                label="Update Balance"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
              />
            </Box>
            <Button size="medium" variant="contained">
              UPDATE
            </Button>
          </Box>
        </CardContent>
        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography>Current Balance: {balance}</Typography>
          <Typography sx={{ lineHeight: "inherit" }} variant="subtitle1">
            Updated on: {updateOn}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}
