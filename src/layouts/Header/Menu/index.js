import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";
import Link from "../../../components/Link";
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
                        &:before{
                            height: 4px;
                            width: 22px;
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
          {user ? (
            <ListItem
              classes={{ root: "MuiListItem-indicators" }}
              button
              component={Link}
              href="/dashboard"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
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
                component={Link}
                href="/admin/users"
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  primary="Users"
                />
              </ListItem>
              <ListItem
                classes={{ root: "MuiListItem-indicators" }}
                button
                component={Link}
                href="/admin/strategies"
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  primary="Strategies"
                />
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
