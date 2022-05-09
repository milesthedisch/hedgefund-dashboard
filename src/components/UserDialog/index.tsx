import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { TextField, Button } from "@mui/material";

export interface SimpleDialogProps {
  open: boolean;
  onClose: any;
  selectedUser: any;
  setUnitsToUpdate: any;
}

function UserDialog(props: SimpleDialogProps) {
  const { onClose, open, setUnitsToUpdate } = props;

  const handleClose = () => {
    onClose(() => {
      setUnitsToUpdate();
    });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Current Units of {props.selectedUser?.firstName}:{" "}
        {props.selectedUser?.transactions[0].units}
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
    </Dialog>
  );
}

export default UserDialog;
