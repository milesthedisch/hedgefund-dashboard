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

import Label from "../Label";
import SuspenseLoader from "../../components/SuspenseLoader";
import { useSWRConfig } from "swr";
import { useUpdateUser } from "../../hooks/index";
import { Fund, ProductionSharePrice } from "@prisma/client";

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
  productionUnitPrice: ProductionSharePrice[];
  setShouldMutate: Function;
}

enum EUnitAction {
  "DEPOSIT",
  "WITHDRAW",
}

const UserDialogInfo = ({
  children,
  number,
  variant,
}: {
  children?;
  variant?;
  number?;
}) => {
  return (
    <Box sx={{ p: 0 }} display="flex" alignItems="center">
      {variant !== "multi" ? (
        <>
          <Typography
            sx={{
              fontWeight: "bold",
              fontStyle: "bold",
            }}
          >
            {children}
          </Typography>
          <Typography sx={{ py: 0, pl: 1 }}>{number?.toString()}</Typography>
        </>
      ) : (
        children
      )}
    </Box>
  );
};

function UserDialog(props: SimpleDialogProps) {
  const {
    onClose,
    open,
    selectedUser = {},
    productionUnitPrice,
    setShouldMutate,
  } = props;

  const { mutate } = useSWRConfig();

  const snackbarInital: Snackbar = {
    open: false,
    severity: "success",
    message: "Successful Update",
  };

  const theme = useTheme();
  const [status, setStatus] = useState(false);
  const [fee, setFee] = useState(1);
  const [fund, setFund] = useState("NEUTRAL");
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

    mutate("/api/user");
  }

  const handleSubmit = () => {
    const unitPrice = productionUnitPrice.filter((p) => p.fund === fund)[0]
      .price;

    setUserInfo({
      fee,
      unitAction,
      statusAction: selectedUser?.blocked ? "activate" : "block",
      status,
      units,
      unitPrice,
      fund,
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
      maxWidth={"sm"}
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
      <Grid container alignItems="center" spacing={2} sx={{ p: 3 }}>
        {props.selectedUser?.totalUnits
          ? Object.entries(props.selectedUser.totalUnits)
            .reverse()
            .map((tu, i) => {
              return (
                <Grid key={i} item xs={6}>
                  <UserDialogInfo variant="multi">
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "bold",
                        pr: 1,
                      }}
                    >
                      Current Units
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontStyle: "bold",
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Label
                        color={
                          tu[0] === fund.toLowerCase()
                            ? "primary"
                            : "secondary"
                        }
                        sx={{ mr: 1 }}
                      >
                        {tu[0]?.toUpperCase()}
                      </Label>
                      {tu[1]?.toString() || 0}
                    </Typography>
                  </UserDialogInfo>
                </Grid>
              );
            })
          : ""}
        {Array.isArray(productionUnitPrice)
          ? productionUnitPrice.map((p, i) => {
            return (
              <Grid key={i} item xs={6}>
                <UserDialogInfo variant="multi">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontStyle: "bold",
                      pr: 1,
                    }}
                  >
                    Live Price
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontStyle: "bold",
                      display: "flex",
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Label
                      color={
                        p.fund === fund.toUpperCase()
                          ? "primary"
                          : "secondary"
                      }
                      sx={{ mr: 1 }}
                    >
                      {p.fund}
                    </Label>
                    {p.price?.toString()}
                  </Typography>
                </UserDialogInfo>
              </Grid>
            );
          })
          : ""}
        <Grid item xs={6}>
          <UserDialogInfo number={`${fee}%`}>Fee</UserDialogInfo>
        </Grid>
        <Grid item xs={6}>
          <UserDialogInfo number={`$${selectedUser?.initalInvestment || 0}`}>
            Initial Investment
          </UserDialogInfo>
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <Box sx={{ paddingBottom: 2 }}>
          <FormControl sx={{ marginRight: 1 }}>
            <Select value={fund} onChange={(e) => setFund(e.target.value)}>
              <MenuItem value={Object.entries(Fund)[0][0]}>{`${Object.entries(Fund)[0][0]
                }`}</MenuItem>
              <MenuItem value={Object.entries(Fund)[1][0]}>{`${Object.entries(Fund)[1][0]
                }`}</MenuItem>
            </Select>
          </FormControl>
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
