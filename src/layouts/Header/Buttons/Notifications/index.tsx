import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography,
  Icon,
} from "@mui/material";
import { useRef, useState } from "react";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import { styled } from "@mui/material/styles";

import { formatDistance, subDays } from "date-fns";

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

const NotificationsItem = styled(Button)(
  ({ theme }) => `
    display: flex;
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.75rem;
    border: 1px solid ${theme.colors.primary.lighter};
    border-radius: 6px;
    color: ${theme.colors.alpha.trueWhite};
    
    :hover {
      background: ${theme.colors.secondary.lighter};
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
`
);

function HeaderNotifications({ data = { users: [] }, isValidating, error }) {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let newUsers = [];
  let amountOfNewUsers = 0;

  if (data.users) {
    newUsers = data.users;
    amountOfNewUsers = data.users.length;
  }

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen} size="large">
          <NotificationsBadge
            badgeContent={amountOfNewUsers}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{ p: 2, minWidth: 350, display: { xs: "block", sm: "flex" } }}
          >
            <Box flex="1">
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{ fontWeight: "bold" }}>New Users</Typography>
              </Box>
              {data.users.map((user) => {
                return (
                  <NotificationsItem key={user.user_id}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.email}
                    </Typography>
                  </NotificationsItem>
                );
              })}
            </Box>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
