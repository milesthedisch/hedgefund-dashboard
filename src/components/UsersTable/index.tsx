import { useState, forwardRef } from "react";
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
import type { BalmoralUser } from "../../hooks";
import { useSWRConfig } from "swr";

const getStatusLabel = (userStatus = false) => {
  let props: { text: string; color: string };

  if (userStatus) {
    props = { text: "Blocked", color: "error" };
  } else {
    props = { text: "Active", color: "success" };
  }

  return <Label color={props.color}>{props.text}</Label>;
};

const applyFilters = (
  users: BalmoralUser[],
  filters: { value: string }
): BalmoralUser[] => {
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

const applyPagination = (
  users: BalmoralUser[],
  page: number,
  limit: number
) => {
  return users.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = ({
  users,
  calcPrice,
  productionUnitPrice,
}: {
  users: BalmoralUser[];
  calcPrice: number;
  productionUnitPrice: number;
}) => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState(5);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [shouldMutate, setShouldMutate] = useState(false);
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

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = "ALL";

    if (event.target.value !== "ALL") {
      value = event.target.value;
    }

    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        value: value,
      };
    });
  };

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handleClickOpen = (id: string) => {
    const filteredUser = users.filter(
      (user) => user.user_metadata.balmoralId === id
    );

    setSelectedUser(filteredUser[0]);
    setOpenUserDialog(true);
  };

  const handleClose = () => {
    setOpenUserDialog(false);
  };

  const filteredUsers = applyFilters(users, filters);
  const paginatedCryptoOrders = applyPagination(filteredUsers, page, limit);

  const theme: any = useTheme();

  return (
    <Card>
      <UserDialog
        open={openUserDialog}
        onClose={() => {
          handleClose();
        }}
        selectedUser={selectedUser}
        productionUnitPrice={productionUnitPrice}
        calcUnitPrice={calcPrice}
        setShouldMutate={setShouldMutate}
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
            {paginatedCryptoOrders.map((user: BalmoralUser) => {
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
                      {user.totalUnits || 0}
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
