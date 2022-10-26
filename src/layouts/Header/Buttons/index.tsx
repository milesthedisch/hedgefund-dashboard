import { Box } from "@mui/material";
import HeaderSearch from "./Search";
import HeaderNotifications from "./Notifications";
import useSWR from "swr";

const fetcher = async (uri: string) => {
  const res = await fetch(uri);

  if (res.status !== 200) {
    throw res;
  }

  return res.json();
};

function HeaderButtons() {
  const { data, error, isValidating } = useSWR("/api/user/newUsers", fetcher);

  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderNotifications
          data={data}
          error={error}
          isValidating={isValidating}
        />
      </Box>
    </Box>
  );
}

export default HeaderButtons;
