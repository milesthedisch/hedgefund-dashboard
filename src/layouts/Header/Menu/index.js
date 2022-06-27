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

function HeaderMenu({ user }) {
  let isAdmin;

  if (user) {
    isAdmin =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("admin");
  }

  return (
    <>
      <ListWrapper>
        <List disablePadding component={Box} display="flex">
          {isAdmin ? (
            <ListItem
              classes={{ root: "MuiListItem-indicators" }}
              button
              component={LinkButton}
              href="/dashboard"
            >
              <ListItemText
                primaryTypographyProps={{ display: "flex" }}
                primary="Dashboard"
              />
            </ListItem>
          ) : (
            ""
          )}
          {isAdmin ? (
            <>
              <ListItem
                classes={{ root: "MuiListItem-indicators" }}
                button
                component={LinkButton}
                href="/admin/users"
              >
                <ListItemText sx={{ width: "20px" }} primary="Users" />
              </ListItem>
              <ListItem
                classes={{ root: "MuiListItem-indicators" }}
                button
                component={LinkButton}
                href="/admin/strategies"
              >
                <ListItemText sx={{ minWidth: "20px" }} primary="Strategies" />
              </ListItem>
            </>
          ) : (
            ""
          )}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
