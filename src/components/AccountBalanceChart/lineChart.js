import * as React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
} from "chart.js";

import SuspenseLoader from "../../components/SuspenseLoader";

import "chartjs-adapter-date-fns";

export default function line({ data, options, ...props }) {
  if (data && options) {
    ChartJS.register(TimeScale, LineElement, PointElement, LinearScale, Title);

    return <Line data={data} options={options} {...props} />;
  }

  return <SuspenseLoader />;
}
