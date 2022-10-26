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

import type { ApiKey } from "@prisma/client";

const getStatusLabel = (userStatus = false) => {
  let props: { text: string; color: string };

  if (userStatus) {
    props = { text: "Blocked", color: "error" };
  } else {
    props = { text: "Active", color: "success" };
  }

  return <Label color={props.color}>{props.text}</Label>;
};

const applyPagination = (apiKeys, page: number, limit: number) => {
  return apiKeys.slice(page * limit, page * limit + limit);
};

const ApiKeyTable = ({ apiKeys }: { apiKeys: ApiKey[] }) => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState(5);
  const [shouldMutate, setShouldMutate] = useState(false);

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handleClickOpen = (id: string) => {
    const filteredUser = apiKeys.filter((key) => key.apiKeyID === id);
  };

  const handleClose = () => {};

  const paginatedCryptoOrders = applyPagination(apiKeys, page, limit);

  const theme: any = useTheme();

  return (
    <Card>
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
          count={apiKeys.length}
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

export default ApiKeyTable;
