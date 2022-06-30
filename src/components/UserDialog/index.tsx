import { useState, forwardRef } from "react";
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
  Snackbar,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogAction from "@mui/material/DialogActions";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import type { AlertColor } from "@mui/lab";

import SuspenseLoader from "../../components/SuspenseLoader";
import { useSWRConfig } from "swr";
import { useUpdateUser } from "../../hooks/index";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Snackbar {
  open: boolean;
  severity?: AlertColor;
  message?: string;
}

export interface SimpleDialogProps {
  open: boolean;
  onClose: any;
  selectedUser: any;
  calcUnitPrice: number;
  productionUnitPrice: number;
  setShouldMutate: Function;
}

enum EUnitAction {
  "DEPOSIT",
  "WITHDRAW",
}

type Block = { block: boolean };
type Activate = { activate: boolean };
type UserInfo = {
  fee: number;
  unitAction: EUnitAction;
  units: number;
  status: boolean;
  statusAction: "block" | "activate";
};

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
    setShouldMutate,
  } = props;

  const snackbarInital: Snackbar = {
    open: false,
    severity: "success",
    message: "Successful Update",
  };

  const theme = useTheme();
  const [status, setStatus] = useState(false);
  const [fee, setFee] = useState(1);
  const [snackbar, setSnackbar] = useState(snackbarInital);
  const [unitAction, setUnitAction] = useState<EUnitAction>(
    EUnitAction.DEPOSIT
  );
  const [units, setUnits] = useState<number>(0);
  const [userShouldUpdate, setUserShouldUpdate] = useState(false);
  const [userInfo, setUserInfo] = useState((prevState) => ({
    ...prevState,
    fee,
    unitAction,
    statusAction: selectedUser?.blocked ? "activate" : "block",
    status,
    units,
  }));

  const { data, error, isValidating } = useUpdateUser(
    userInfo,
    userShouldUpdate
  );

  const handleClose = () => {
    if (isValidating) return;

    setUnits(0);
    setFee(0.01);
    setUnitAction(EUnitAction.DEPOSIT);
    setStatus(false);
    setUserShouldUpdate(false);
    setSnackbar({ open: false });
    onClose();
  };

  if (data || error) {
    setUserShouldUpdate(false);
  }

  if (error) {
    setSnackbar({
      open: true,
      severity: "error",
      message: error.message,
    });
  }

  if (data) {
    setSnackbar({
      open: true,
      severity: "success",
      message: `${selectedUser.name} updated successfully`,
    });
  }

  const handleSubmit = () => {
    setUserInfo({
      fee,
      unitAction,
      statusAction: selectedUser?.blocked ? "activate" : "block",
      status,
      units,
      unitPrice: productionUnitPrice,
      audInvestment: productionUnitPrice * units,
    });

    setUserShouldUpdate(true);
  };

  const handleStatusToggle = () => {
    setStatus((prevState) => !prevState);
  };

  const handleFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFee(~~e.target.value / 100 || 0);
  };

  const handleUnits = (e) => {
    setUnits(parseFloat(e.target.value) as number);
  };

  return (
    <Dialog
      maxWidth={"xs"}
      fullWidth={true}
      onClose={handleClose}
      open={isValidating ? true : open}
      sx={{ height: "auto" }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, severity: "success" })}
        message="Note archived"
      >
        <Alert
          onClose={() => setSnackbar({ open: false, severity: "success" })}
          severity={snackbar?.severity || "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {isValidating ? (
        <Box
          sx={{
            zIndex: 2,
            position: "absolute",
            height: "100%",
            top: 0,
            left: 0,
            background: "white",
            width: "100%",
          }}
        >
          <SuspenseLoader size={64} />
        </Box>
      ) : (
        ""
      )}
      <Grid container alignItems="center" sx={{ p: 3 }}>
        <Grid item xs={6}>
          <UserDialogInfo number={props.selectedUser?.totalUnits || 0}>
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
        <Grid item xs={6}>
          <UserDialogInfo number={`$${productionUnitPrice || 0}`}>
            Live Unit Price
          </UserDialogInfo>
        </Grid>
        <Grid item xs={6}>
          <UserDialogInfo
            number={`$${(units * productionUnitPrice).toFixed(3)}`}
          >
            Aud Investment
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
              variant="filled"
              onChange={handleUnits}
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
                Do you want to {selectedUser?.blocked ? "activate" : "block"}{" "}
                this user {selectedUser?.name}?
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
