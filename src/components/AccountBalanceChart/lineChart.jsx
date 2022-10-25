import * as React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
  Tooltip,
} from "chart.js";

import "chartjs-adapter-date-fns";

export default function line({ data, options, ...props }) {
  ChartJS.register(
    TimeScale,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip
  );

  return <Line data={data} options={options} {...props} />;
}
