import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";

import Header from "./Header";

const MainWrapper = styled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
`
);

const MainContent = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.header.height};
        flex: 1 1 auto;
        overflow: auto;
`
);

const SidebarLayout = (props) => {
  return (
    <>
      <MainWrapper>
        <Header />
        <MainContent>{props.children}</MainContent>
      </MainWrapper>
    </>
  );
};

export default SidebarLayout;
