import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LinkButton from "../../../components/Link";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import type { User } from "auth0";

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(["color", "fill"])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {

                    .MuiTypography-root {
                    font-weight: bold;
                        &:before{
                            height: 4px;
                            width: 20%;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.balmoral};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

const auditLinkList = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", paddingLeft: 3 }}>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        sx={{
          color: theme.colors.primary.balmoral,
        }}
        button
        component={LinkButton}
        href="/admin/audit"
      >
        <ListItemText
          sx={{
            color: theme.colors.primary.balmoral,
            width: "70px",
            justifyContent: "center",
            display: "flex",
          }}
          primary="Audit"
        />
      </ListItem>
    </Box>
  );
};

const adminLinkList = () => {
  return (
    <Box sx={{ display: "flex", paddingLeft: 3 }}>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        button
        component={LinkButton}
        href="/dashboard"
      >
        <ListItemText
          sx={{ width: "70px", justifyContent: "center", display: "flex" }}
          primary="Dashboard"
        />
      </ListItem>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        button
        component={LinkButton}
        href="/admin/users"
      >
        <ListItemText
          sx={{ width: "70px", justifyContent: "center", display: "flex" }}
          primary="Users"
        />
      </ListItem>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        button
        component={LinkButton}
        href="/admin/strategies"
      >
        <ListItemText
          sx={{ width: "70px", justifyContent: "center", display: "flex" }}
          primary="Strategies"
        />
      </ListItem>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        button
        component={LinkButton}
        href="/admin/audit"
      >
        <ListItemText
          sx={{ width: "70px", justifyContent: "center", display: "flex" }}
          primary="Audit"
        />
      </ListItem>
      <ListItem
        classes={{ root: "MuiListItem-indicators" }}
        button
        component={LinkButton}
        href="/admin/apiKeys"
      >
        <ListItemText
          sx={{ width: "70px", justifyContent: "center", display: "flex" }}
          primary="API Keys"
        />
      </ListItem>
    </Box>
  );
};

function HeaderMenu({ user }: { user: User }) {
  let isAdmin: boolean;
  let isAudit: boolean;

  if (user) {
    isAdmin = user["https://app.balmoral.digital/roles"].includes("admin");
    isAudit = user["https://app.balmoral.digital/roles"].includes("audit");
  }

  return (
    <>
      <ListWrapper>
        <List disablePadding component={Box} display="flex">
          {isAdmin ? adminLinkList() : ""}
          {isAudit ? auditLinkList() : ""}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
