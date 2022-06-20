import { useState } from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  IconButton,
} from "@mui/material";
import Label from "../Label";
import UserDialog from "../UserDialog";
import EditIcon from "@mui/icons-material/Edit";

const getStatusLabel = (userStatus = false) => {
  let props: { text: string; color: string };

  if (userStatus) {
    props = { text: "Blocked", color: "warning" };
  } else {
    props = { text: "Active", color: "success" };
  }

  return <Label color={props.color}>{props.text}</Label>;
};

const applyFilters = (
  users: [{ blocked: boolean }],
  filters: { value: string }
) => {
  if (filters.value === "ALL") {
    return users;
  }

  return users.filter((user) => {
    if (filters.value === "BLOCKED") {
      return user.blocked;
    }

    if (filters.value === "ACTIVE") {
      return !user.blocked;
    }
  });
};

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = ({ users }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [filters, setFilters] = useState({
    value: "ALL",
  });

  const statusOptions = [
    {
      value: "ACTIVE",
      name: "Active",
    },
    {
      value: "BLOCKED",
      name: "Blocked",
    },
    {
      value: "ALL",
      name: "All",
    },
  ];

  const handleStatusChange = (e) => {
    let value = "ALL";

    if (e.target.value !== "ALL") {
      value = e.target.value;
    }

    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        value: value,
      };
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleClickOpen = (id: string) => {
    const filteredUser = users.filter(
      (user) => user.user_metadata.balmoralId === id
    );

    setSelectedUser(filteredUser[0]);
    setOpenUserDialog(true);
  };

  const handleClose = (value: number) => {
    setOpenUserDialog(false);
  };

  const handleActivateUserClick = (id) => {
    const filteredUser = users.filter((user) => user.id === id);
    setSelectedUser(filteredUser[0]);
    alert(id);
  };

  const handleBlockUserClick = (id) => {
    const filteredUser = users.filter((user) => user.id === id);
    setSelectedUser(filteredUser[0]);
    alert(id);
  };

  const setUnitsToUpdate = () => {};

  const filteredUsers = applyFilters(users, filters);
  const paginatedCryptoOrders = applyPagination(filteredUsers, page, limit);

  const theme: any = useTheme();

  return (
    <Card>
      <UserDialog
        open={openUserDialog}
        onClose={() => handleClose(1)}
        setUnitsToUpdate={setUnitsToUpdate}
        selectedUser={selectedUser}
      />
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.value || "ALL"}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => {
                  return (
                    <MenuItem
                      key={statusOption.name}
                      value={statusOption.value}
                    >
                      {statusOption.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        }
        title="All Users"
      />

      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Units</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Edit User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((user) => {
              return (
                <TableRow hover key={user.user_id}>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {new Date(user.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {user.transactions[0]?.units || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.primary" noWrap>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {getStatusLabel(user.blocked)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleClickOpen(user.user_metadata.balmoralId)
                      }
                    >
                      <EditIcon
                        sx={{
                          color: theme.colors.primary.main,
                          borderRadius: 0.5,
                        }}
                        fontSize="medium"
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  users: PropTypes.array.isRequired,
};

RecentOrdersTable.defaultProps = {
  users: [],
};

export default RecentOrdersTable;
