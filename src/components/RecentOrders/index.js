import { Card } from "@mui/material";
import RecentOrdersTable from "../RecentOrdersTable";
import { subDays } from "date-fns";

function RecentOrders({ users }) {
  return (
    <Card>
      <RecentOrdersTable users={users} />
    </Card>
  );
}

export default RecentOrders;
