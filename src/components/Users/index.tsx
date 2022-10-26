import { Card } from "@mui/material";
import RecentOrdersTable from "../UsersTable";

const Users = ({ userData: { users }, productionUnitPrice, calcPrice }) => {
  return (
    <Card>
      <RecentOrdersTable
        users={users}
        productionUnitPrice={productionUnitPrice}
        calcPrice={calcPrice}
      />
    </Card>
  );
};

export default Users;
