import { Typography, Avatar, Grid } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import { useTheme } from "@mui/material/styles";

function PageHeader() {
  const { user } = useUser();
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(8), height: theme.spacing(8) }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {user.name}!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
