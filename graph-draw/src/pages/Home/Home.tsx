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
  const labels = [10, 20, 50, 100, 300, 500, 1000, 3000, 5000];
  const dataArray1 = [
    0.6000000238418579,
    0.5,
    0.6000000238418579,
    0.5,
    0.699999988079071,
    0.8999999761581421,
    1.300000011920929,
    3.199999988079071,
    5.300000011920929
];
  // const dataArray2 = [15, 25, 35, 45, 55, 65];
  const data1Label = 'Render Diff performance';
  // const data2Label = 'Dataset 2';
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
      // ...(dataArray2.length > 0
      //   ? [{
      //       label: data2Label,
      //       data: dataArray2,
      //       borderColor: 'rgba(153, 102, 255, 1)',
      //       backgroundColor: 'rgba(153, 102, 255, 0.2)',
      //       borderWidth: 2,
      //       tension: 0.3,
      //     }]
      //   : []),
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
