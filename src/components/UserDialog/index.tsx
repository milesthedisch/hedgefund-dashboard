import {
  Box,
  Divider,
  Typography,
  Tooltip,
  useTheme,
  IconButton,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { TextField, Button } from "@mui/material";
import AddCircleTwoTone from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoTone from "@mui/icons-material/RemoveCircleTwoTone";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import BlockIcon from "@mui/icons-material/Block";

export interface SimpleDialogProps {
  open: boolean;
  onClose: any;
  selectedUser: any;
  setUnitsToUpdate: any;
}

const handleActivateUserClick = (number) => {};
const handleBlockUserClick = (number) => {};
const handleClickOpen = (number) => {};

const ActivateUserForm = (user, theme) => {
  return (
    <Box>
      {user.blocked ? (
        <HowToRegIcon
          sx={{
            "&:hover": {
              background: theme.colors.secondary.lighter,
            },
            color: theme.colors.primary.main,
            borderRadius: "5px",
          }}
          color="inherit"
          onClick={() => handleActivateUserClick(user.user_metadata.balmoralId)}
        ></HowToRegIcon>
      ) : (
        <BlockIcon
          sx={{
            "&:hover": {
              background: theme.colors.error.lighter,
            },
            color: theme.colors.error.main,
            borderRadius: "5px",
          }}
          onClick={() => handleBlockUserClick(user.user_metadata.balmoralId)}
        />
      )}
    </Box>
  );
};

const updateUnitsForm = (user, theme) => {
  return (
    <Box>
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
          onClick={() => handleClickOpen(user.user_metadata.balmoralId)}
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
          onClick={() => handleClickOpen(user.user_metadata.balmoralId)}
        >
          <RemoveCircleTwoTone fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
function UserDialog(props: SimpleDialogProps) {
  const theme = useTheme();
  const { onClose, open, setUnitsToUpdate } = props;

  const handleClose = () => {
    onClose(() => {
      setUnitsToUpdate();
    });
  };

  return (
    <Dialog
      maxWidth={"xs"}
      fullWidth={true}
      onClose={handleClose}
      open={open}
      sx={{ height: "auto" }}
    >
      <Box display="flex" sx={{ flexDirection: "column" }}>
        <DialogTitle>
          <Typography
            sx={{
              color: theme.colors.alpha.white,
              background: theme.colors.gradients.green1,
              position: "absolute",
              fontStyle: "bold",
              top: 0,
              right: 0,
              p: 2,
            }}
          >
            {props.selectedUser?.transactions[0].units}
          </Typography>
          Current Units of {props.selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ width: "100%" }}
            label="Add Units"
            type="tel"
            defaultValue={0}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            variant="filled"
            onChange={({ target: { value } }) => {
              console.log(value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
          <Button sx={{ my: 2 }} variant="contained">
            Update
          </Button>
        </DialogContent>
      </Box>
      <Divider />
      <Box display="flex">
        <DialogTitle>Activate User</DialogTitle>
        <DialogContent>{ActivateUserForm({}, theme)}</DialogContent>
      </Box>
    </Dialog>
  );
}

export default UserDialog;
