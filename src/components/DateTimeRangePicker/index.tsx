import { useState } from "react";

import Box from "@mui/material/Box";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import auLocale from "date-fns/locale/en-AU";

import { styled } from "@mui/material/styles";

const StyledSearchIcon = styled(SearchIcon)(
  ({ theme }) => `
    margin-right: 0px;
    margin-left: 0px;
`
);

const SearchButton = styled(LoadingButton)(
  ({ theme }) => `
    .MuiButtonBase-root > span {
      margin: 0;
    }

    .MuiButton-startIcon {
      margin:0
    }
`
);

export default function DateTimeRangePicker(props) {
  const { handleSubmit } = props;
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  return (
    <LocalizationProvider adapterLocale={auLocale} dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={"Start"}
        value={startDateTime}
        onChange={(value) => setStartDateTime(value)}
        renderInput={(params) => <TextField {...params} />}
      />
      <Box sx={{ p: 2 }} textAlign="center" width="50px">
        to
      </Box>
      <DateTimePicker
        label={"End"}
        value={endDateTime}
        onChange={(value) => setEndDateTime(value)}
        renderInput={(params) => <TextField {...params} />}
      />
      <SearchButton
        loading={false}
        size="large"
        color="primary"
        aria-label="upload picture"
        sx={{
          marginLeft: 2,
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        startIcon={<StyledSearchIcon />}
        onClick={() => handleSubmit([startDateTime, endDateTime])}
      ></SearchButton>
    </LocalizationProvider>
  );
}
