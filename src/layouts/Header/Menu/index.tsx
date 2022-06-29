import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";
import LinkButton from "../../../components/Link";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import type { User } from "auth0";

import { useUser } from "@auth0/nextjs-auth0";

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
                            background: ${theme.colors.primary.main};
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
    </Box>
  );
};

function HeaderMenu({ user }: { user: User }) {
  let isAdmin: boolean;
  let isAudit: boolean;

  if (user) {
    isAdmin =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("admin");
    isAudit =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("audit");
  }

  return (
    <>
      <ListWrapper>
        <List disablePadding component={Box} display="flex">
          {isAdmin ? adminLinkList() : ""}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
