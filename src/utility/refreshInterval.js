export default function refreshInterval(hour = 16, min = 0, sec = 0 /* 4pm */) {
  // calculate the interval from now till 4pm AEDT

  const currentTime = Date.now();
  const currentDateTime = new Date(Date.now());
  const timeAt4pm = currentDateTime.setHours(hour, 0, 0, 0);
  const timeAt4pmTmrw = currentDateTime.setHours(hour + 24, 0, 0, 0);

  let msDifference = timeAt4pm - currentTime;

  if (msDifference < 0) {
    msDifference = timeAt4pmTmrw - currentTime;
  }

  console.log(msDifference);

  return msDifference;
}
