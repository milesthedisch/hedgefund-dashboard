import { Button, Link, Anchor } from "@mui/material";

export default function SignInOther() {
  return (
    <Button
      component={Anchor}
      href="/api/auth/login"
      fullWidth
      variant="outlined"
    >
      Log In
    </Button>
  );
}
