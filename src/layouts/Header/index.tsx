import { Box, Hidden, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

// import useSWR from "swr";
import HeaderMenu from "./Menu";
import HeaderButtons from "./Buttons";
import HeaderUserbox from "./Userbox";
import Logo from "../../components/Logo";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import type { UserProfile } from "@auth0/nextjs-auth0";

type User = UserProfile & {
  [prop: string]: [admin: string] | unknown;
};

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
) as typeof Box;

function Header(props) {
  const { user }: { user?: User } = useUser();

  let isAdmin: Boolean;
  let isAudit: Boolean;

  if (user) {
    const role: any = user["https://app.balmoral.digital/roles"];

    isAdmin = role.includes("admin");
    isAudit = role.includes("audit");
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
