import { useContext } from "react";

import { Box, Hidden, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";

import HeaderMenu from "./Menu";
import HeaderButtons from "./Buttons";
import HeaderUserbox from "./Userbox";
import Logo from "../../components/Logo";
import { useUser } from "@auth0/nextjs-auth0";

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 5;
        background-color: ${theme.header.background};
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header(props) {
  const { user } = useUser();

  let isAdmin;

  if (user) {
    isAdmin =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("admin");
  }

  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Logo />
        <Hidden lgDown>
          <HeaderMenu user={user} />
        </Hidden>
      </Box>
      {user ? (
        <Box display="flex" alignItems="center">
          {isAdmin ? (
            <>
              <HeaderButtons key="a" />
              <HeaderUserbox key="b" user={user} />
            </>
          ) : (
            <HeaderUserbox user={user} />
          )}
        </Box>
      ) : (
        ""
      )}
    </HeaderWrapper>
  );
}

export default Header;
