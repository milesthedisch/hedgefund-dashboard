import { Button, Link } from "@mui/material";

export default function SignIn() {
  return (
    <Button href="/api/auth/login" fullWidth variant="outlined">
      Log In
    </Button>
  );
}
