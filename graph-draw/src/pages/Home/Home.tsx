import React from 'react';
import { Line } from 'react-chartjs-2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomePage: React.FC = () => {
  // Hardcoded data arrays
  const labels = [10, 20, 50, 100, 300, 500, 1000, 3000, 5000, 9000];
  const dataArray1 = [
    0.43000001311302183,
    0.4399999976158142,
    0.4800000011920929,
    0.5699999928474426,
    0.7400000035762787,
    0.9399999856948853,
    1.6,
    3.519999998807907,
    5.490000009536743,
    9.630000007152557
  ];
  const dataArray2 = [
    5.889999997615814,
    6.25,
    5.360000008344651,
    5.010000002384186,
    5.410000002384185,
    6.9,
    5.239999997615814,
    6.449999994039535,
    10.410000002384185,
    9.730000013113022
  ];
  const data1Label = 'Render Diff performance';
  const data2Label = 'Full Render performance';
  const xAxisLabel = 'Number of modifications';
  const yAxisLabel = 'Time taken (ms)';
  const title = 'Performance of Virtual Dom Diffing';

  // Configuring the data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: data1Label,
        data: dataArray1,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3, // Smooth curve for the line
      },
      ...(dataArray2.length > 0
        ? [{
          label: data2Label,
          data: dataArray2,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderWidth: 2,
          tension: 0.3,
        }]
        : []),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 18, // Increase legend label font size
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20, // Increase title font size
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          font: {
            size: 18, // Increase X-axis label font size
          },
        },
        ticks: {
          font: {
            size: 18, // Increase X-axis tick label font size
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 18, // Increase Y-axis label font size
          },
        },
        ticks: {
          font: {
            size: 16, // Increase Y-axis tick label font size
          },
        },
      },
    },
  };

  return (
    <Container>
      <Line data={data} options={options} />
    </Container>
  );
};

export default HomePage;
