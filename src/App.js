import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [ethereumData, setEthereumData] = useState(null);
  const [polygonData, setPolygonData] = useState(null);
  const [ethereumChartData, setEthereumChartData] = useState({});
  const [polygonChartData, setPolygonChartData] = useState({});

  useEffect(() => {
    // Fetch Ethereum price data
    axios
      .get('http://localhost:3000/prices/hourly?chain=Ethereum')
      .then((response) => {
        setEthereumData(response.data);
        formatChartData(response.data, 'Ethereum'); // Format data for Ethereum chart
      })
      .catch((error) => {
        console.error('Error fetching Ethereum data from the backend', error);
      });

    // Fetch Polygon (MATIC) price data
    axios
      .get('http://localhost:3000/prices/hourly?chain=Polygon')
      .then((response) => {
        setPolygonData(response.data);
        formatChartData(response.data, 'Polygon'); // Format data for Polygon chart
      })
      .catch((error) => {
        console.error('Error fetching Polygon data from the backend', error);
      });
  }, []);

  // Format data for charts
  const formatChartData = (data, chain) => {
    const labels = data.map((entry) =>
      new Date(entry.hour).toLocaleTimeString()
    );
    const prices = data.map((entry) => entry.average_price);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: `${chain} Price (USD)`,
          data: prices,
          borderColor:
            chain === 'Ethereum'
              ? 'rgba(75, 192, 192, 1)'
              : 'rgba(153, 102, 255, 1)', // Line color for Ethereum and Polygon
          backgroundColor:
            chain === 'Ethereum'
              ? 'rgba(75, 192, 192, 0.2)'
              : 'rgba(153, 102, 255, 0.2)', // Background color for Ethereum and Polygon
          tension: 0.4, // Line smoothness
          fill: true,
        },
      ],
    };

    if (chain === 'Ethereum') {
      setEthereumChartData(chartData);
    } else {
      setPolygonChartData(chartData);
    }
  };

  return (
    <div className="App">
      <h1>Coin Watch 🫅⏳</h1>
      <div className="charts-container">
        {ethereumData && polygonData ? (
          <>
            <div className="chart-wrapper">
              <Line
                data={ethereumChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Ethereum Price (Last 24 Hours)',
                    },
                  },
                }}
              />
            </div>
            <div className="chart-wrapper">
              <Line
                data={polygonChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Polygon (MATIC) Price (Last 24 Hours)',
                    },
                  },
                }}
              />
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
