import { FC, ChangeEvent, useState } from "react";
import { format, parse } from "date-fns";
import numeral from "numeral";
import PropTypes from "prop-types";

import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
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
} from "@mui/material";

import Label from "../Label";

import UserDialog from "../UserDialog";
import AddCircleTwoTone from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoTone from "@mui/icons-material/RemoveCircleTwoTone";
import BulkActions from "../BulkActions";

const getStatusLabel = (userStatus = "pending") => {
  const status = {
    ACTIVE: {
      text: "Active",
      color: "success",
    },
    PENDING: {
      text: "Pending",
      color: "warning",
    },
  };

  const props = status[userStatus];

  return <Label color={props.color}>{props.text}</Label>;
};

const applyFilters = (users, filters) => {
  return users.filter((user) => {
    // "All" is essentially no filter return true for all users
    if (!filters.status) {
      return true;
    } else if (filters.status && user.status === filters.status) {
      return true;
    } else {
      return false;
    }
  });
};

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = ({ users }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
  });

  const statusOptions = [
    {
      status: "all",
      name: "All",
    },
    {
      status: "ACTIVE",
      name: "Active",
    },
    {
      status: "PENDING",
      name: "Pending",
    },
  ];

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        status: value,
      };
    });
  };

  const handleSelectAllCryptoOrders = (event) => {
    setSelectedCryptoOrders(
      event.target.checked ? users.map((user) => user.id) : []
    );
  };

  const handleSelectOneCryptoOrder = (event, cryptoOrderId) => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId,
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleClickOpen = (id) => {
    const filteredUser = users.filter((user) => user.id === id);
    setSelectedUser(filteredUser[0]);
    setOpenUserDialog(true);
  };

  const handleClose = (value: number) => {
    setOpenUserDialog(false);
  };

  const filteredUsers = applyFilters(users, filters);
  const paginatedCryptoOrders = applyPagination(filteredUsers, page, limit);

  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < users.length;
  const selectedAllCryptoOrders = selectedCryptoOrders.length === users.length;
  const theme: any = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || "all"}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem
                      key={statusOption.status}
                      value={statusOption.status}
                    >
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="All Users"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Units</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <UserDialog
              open={openUserDialog}
              onClose={() => handleClose(1)}
              selectedUser={selectedUser}
            />
            {paginatedCryptoOrders.map((user) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                user.id
              );
              return (
                <TableRow hover key={user.id} selected={isCryptoOrderSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event) =>
                        handleSelectOneCryptoOrder(event, user.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {user.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.primary" noWrap>
                      {user.firstName + " " + user.lastName}
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
                  <TableCell align="right">
                    {getStatusLabel(user.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Add Units" arrow>
                      <IconButton
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => handleClickOpen(user.id)}
                      >
                        <AddCircleTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Units" arrow>
                      <IconButton
                        sx={{
                          "&:hover": { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color="inherit"
                        size="small"
                        onClick={handleClickOpen}
                      >
                        <RemoveCircleTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
