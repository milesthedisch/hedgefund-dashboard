import { useEffect } from "react";
import NProgress from "nprogress";
import { Box, CircularProgress } from "@mui/material";

function SuspenseLoader({ size }) {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      sx={{ width: "100%", height: "100%" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        size={size || 64}
        disableshrink={"true"}
        thickness={3}
      />
    </Box>
  );
}

export default SuspenseLoader;
