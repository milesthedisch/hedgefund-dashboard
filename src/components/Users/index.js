import { Card } from "@mui/material";
import RecentOrdersTable from "../UsersTable/index.tsx";

function Users({ users }) {
  return (
    <Card>
      <RecentOrdersTable users={users} />
    </Card>
  );
}

export default Users;
