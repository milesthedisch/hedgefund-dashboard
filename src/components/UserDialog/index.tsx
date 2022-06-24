import { useState, useReducer } from "react";
import {
  Box,
  Grid,
  Divider,
  Typography,
  Checkbox,
  useTheme,
  FormControl,
  Button,
  Select,
  MenuItem,
  TextField,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  styled,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogAction from "@mui/material/DialogActions";

export interface SimpleDialogProps {
  open: boolean;
  onClose: any;
  selectedUser: any;
  calcUnitPrice: number;
  productionUnitPrice: number;
  updateUser: Function;
}

const handleActivateUserClick = (number) => {};
const handleBlockUserClick = (number) => {};
const handleClickOpen = (number) => {};
const handleChange = () => {};

enum EUnitAction {
  "DEPOSIT",
  "WITHDRAW",
}

const UserDialogInfo = ({ children, number }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography
        sx={{
          fontWeight: "bold",
          fontStyle: "bold",
        }}
      >
        {children}
      </Typography>
      <Typography sx={{ p: 1 }}>{number}</Typography>
    </Box>
  );
};
function UserDialog(props: SimpleDialogProps) {
  const {
    onClose,
    open,
    selectedUser = {},
    calcUnitPrice,
    productionUnitPrice,
    updateUser,
  } = props;

  const theme = useTheme();
  const [status, setStatus] = useState(false);
  const [fee, setFee] = useState(1);
  const [unitAction, setUnitAction] = useState<EUnitAction>(
    EUnitAction.DEPOSIT
  );

  const handleClose = () => {
    onClose(() => {});
  };

  const handleSubmit = () => {
    updateUser();
  };

  const handleStatusToggle = () => {
    setStatus((prevState) => !prevState);
  };

  const handleFee = (e) => {
    setFee(e.target.value);
  };

  return (
    <Dialog
      maxWidth={"xs"}
      fullWidth={true}
      onClose={handleClose}
      open={open}
      sx={{ height: "auto" }}
    >
      <Grid container alignItems="center" sx={{ p: 3 }}>
        <Grid item xs={6}>
          <UserDialogInfo
            number={props.selectedUser?.transactions[0]?.units || 0}
          >
            Current Units
          </UserDialogInfo>
        </Grid>
        <Grid item xs={6}>
          <UserDialogInfo number={`${fee}%`}>Fee</UserDialogInfo>
        </Grid>
        <Grid item xs={6}>
          <UserDialogInfo number={`$${calcUnitPrice?.toFixed(3) || fee}`}>
            Unit Price
          </UserDialogInfo>
        </Grid>
        <Grid item xs={6}>
          <UserDialogInfo number={`$${selectedUser?.initalInvestment || 0}`}>
            Initial Investment
          </UserDialogInfo>
        </Grid>
        <Grid item>
          <UserDialogInfo number={`$${productionUnitPrice || 0}`}>
            Live Unit Price
          </UserDialogInfo>
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <Box sx={{ paddingBottom: 2 }}>
          <FormControl>
            <FormGroup>
              <TextField
                defaultValue={fee}
                InputProps={{
                  inputProps: { step: "0.1", min: "0", max: "100" },
                }}
                label="Fee Percentage"
                variant="filled"
                helperText="Fee charged to client for redeemption or deposit"
                onChange={handleFee}
              />
            </FormGroup>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <FormControl sx={{ marginRight: 1 }}>
            <Select
              value={unitAction}
              onChange={(e) => setUnitAction(e.target.value as EUnitAction)}
            >
              <MenuItem value={EUnitAction.DEPOSIT}>Deposit</MenuItem>
              <MenuItem value={EUnitAction.WITHDRAW}>Withdraw</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flexGrow: 1 }}>
            <TextField
              sx={{ width: "100%" }}
              label={"Amount Of Units"}
              defaultValue={0}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              variant="filled"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </FormControl>
        </Box>
        <DialogAction
          sx={{
            paddingTop: 1,
            paddingLeft: 0,
            justifyContent: "space-between",
          }}
        >
          <FormControl>
            <FormGroup>
              <FormControlLabel
                label={selectedUser?.blocked ? "Activate" : "Block"}
                control={
                  <Checkbox
                    color={selectedUser?.blocked ? "success" : "error"}
                    checked={status}
                    onChange={handleStatusToggle}
                  />
                }
              />
              <FormHelperText>
                Do you want to activate this user {selectedUser?.name}?
              </FormHelperText>
            </FormGroup>
          </FormControl>
        </DialogAction>
      </DialogContent>
      <Divider />
      <DialogAction sx={{ p: 2, justifyContent: "center" }}>
        <Button onClick={handleSubmit} size="medium" variant="outlined">
          UPDATE
        </Button>
      </DialogAction>
    </Dialog>
  );
}

export default UserDialog;
