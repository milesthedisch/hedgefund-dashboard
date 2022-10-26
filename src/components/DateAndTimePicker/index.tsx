import { useState } from "react";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import auLocale from "date-fns/locale/en-AU";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";

export default function DateAndTimePicker(props: { label; handleAccept }) {
  const [dateTime, setDateTime] = useState(new Date());

  const { handleAccept, label } = props;

  const startOrEndTime =
    label === "Start" ? { startTime: "" } : { endTime: "" };

  return (
    <LocalizationProvider adapterLocale={auLocale} dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={dateTime}
        onAccept={() => handleAccept()}
        onChange={(value) => setDateTime(value)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
