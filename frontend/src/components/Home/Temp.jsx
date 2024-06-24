// // import React, { useState } from 'react';
// // import { Line } from 'react-chartjs-2';
// // import 'chart.js/auto';

// // const TemperatureChart = () => {
// //   // Hardcoded data for testing
// //   const dayData = {
// //     labels: ['00:00', '01:00', '02:00', '03:00', '04:00'],
// //     datasets: [
// //       {
// //         label: 'Temperature Per Day',
// //         data: [96, 99, 97, 100, 102],
// //         fill: false,
// //         borderColor: 'rgb(255, 99, 132)',
// //         tension: 0.1
// //       }
// //     ]
// //   };

// //   const weekData = {
// //     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
// //     datasets: [
// //       {
// //         label: 'Temperature Per Week',
// //         data: [96, 99, 97, 100, 102, 98, 101],
// //         fill: false,
// //         borderColor: 'rgb(255, 99, 132)',
// //         tension: 0.1
// //       }
// //     ]
// //   };

// //   const monthData = {
// //     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
// //     datasets: [
// //       {
// //         label: 'Temperature Per Month',
// //         data: [96, 99, 97, 100, 102],
// //         fill: false,
// //         borderColor: 'rgb(255, 99, 132)',
// //         tension: 0.1
// //       }
// //     ]
// //   };

// //   const [data, setData] = useState(dayData); // Default to dayData
// //   const [filter, setFilter] = useState('per day'); // Default filter

// //   const handleFilterChange = (e) => {
// //     const newFilter = e.target.value;
// //     setFilter(newFilter);
    
// //     if (newFilter === 'per day') {
// //       setData(dayData);
// //     } else if (newFilter === 'per week') {
// //       setData(weekData);
// //     } else if (newFilter === 'per month') {
// //       setData(monthData);
// //     }
// //   };

// //   return (
// //     <>
// //       <select value={filter} onChange={handleFilterChange}>
// //         <option value="per day">Per Day</option>
// //         <option value="per week">Per Week</option>
// //         <option value="per month">Per Month</option>
// //       </select>
// //       <Line data={data} />
// //     </>
// //   );
// // };

// // export default TemperatureChart;
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';
// import axios from 'axios';

// const TempChart = ({ patientId }) => {
//   const [chartData, setChartData] = useState({});

//   const chart = async () => {
//     let appoint_time = [];
//     let body_Temp = [];

//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/v1/patients/${patientId}/vitals`);
//       console.log(res); // Log the full response
//       const data = res.data; // Adjust this line based on actual response structure

//       if (Array.isArray(data)) {
//         for (const dataObj of data) {
//           appoint_time.push(dataObj.appointmentTime);
//           body_Temp.push(parseInt(dataObj.bodyTemp, 10));
//           console.log(dataObj.bodyTemp)
//         }
//         setChartData({
//           labels: appoint_time,
//           datasets: [
//             {
//               label: "HeartRate of patients",
//               data: body_Temp,
//               backgroundColor: ["rgba(75, 192, 192, 0.6)"],
//               borderWidth: 4,
//             },
//           ],
//         });
//       } else {
//         console.error('Data is not an array:', data);
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     }
//   };

//   useEffect(() => {
//     chart();
//   }, [patientId]);

//   return (
    
      
//     <>
//       {chartData && chartData.labels ? (
//         <Line data={chartData} />
//       ) : (
//         <p>Loading...</p>
//       )}
//       </>
//   );
// };

// export default TempChart;

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import moment from 'moment';

const TemperatureChart = ({ patientId }) => {
  const [chartData, setChartData] = useState({});
  const [filterType, setFilterType] = useState('day');

  const chart = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/patients/${patientId}/vitals?filter_type=${filterType}`);
      console.log(res); // Log the full response
      const data = res.data;

      if (Array.isArray(data)) {
        let appoint_times = [];
        let temperatureValues = [];

        if (filterType === 'day') {
          // Filter data for today
          for (const dataObj of data) {
            appoint_times.push(dataObj.appointmentTime);
            temperatureValues.push(parseFloat(dataObj.bodyTemp));
          }
        } else if (filterType === 'week') {
          // Filter data for the current week
          const startOfWeek = moment().startOf('week');
          const endOfWeek = moment().endOf('week');

          const filteredData = data.filter(item => {
            const date = moment(item.appointmentDate);
            return date.isBetween(startOfWeek, endOfWeek, null, '[]');
          });

          // Prepare labels for each day of the week
          for (let i = 0; i < 7; i++) {
            const dayLabel = startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD');
            appoint_times.push(dayLabel);
          }

          // Group filtered data by day
          const groupedData = filteredData.reduce((acc, current) => {
            const date = moment(current.appointmentDate).format('YYYY-MM-DD');
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(parseFloat(current.bodyTemp));
            return acc;
          }, {});

          // Calculate average temperature per day
          temperatureValues = appoint_times.map(date => {
            const temps = groupedData[date];
            if (temps) {
              const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
              return avgTemp;
            }
            return null;
          });
        } else if (filterType === 'month') {
          // Filter data for the current month
          const startOfMonth = moment().startOf('month');
          const endOfMonth = moment().endOf('month');

          const filteredData = data.filter(item => {
            const date = moment(item.appointmentDate);
            return date.isBetween(startOfMonth, endOfMonth, null, '[]');
          });

          // Prepare labels for each week of the month
          appoint_times = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          const weekLabels = appoint_times.map((_, index) => ({
            start: startOfMonth.clone().add(index, 'weeks').startOf('week'),
            end: startOfMonth.clone().add(index, 'weeks').endOf('week')
          }));

          // Group filtered data by week
          const groupedData = filteredData.reduce((acc, current) => {
            const date = moment(current.appointmentDate);
            const weekIndex = weekLabels.findIndex(
              week => date.isBetween(week.start, week.end, null, '[]')
            );
            if (weekIndex !== -1) {
              if (!acc[weekIndex]) {
                acc[weekIndex] = [];
              }
              acc[weekIndex].push(parseFloat(current.bodyTemp));
            }
            return acc;
          }, {});

          // Calculate average temperature per week
          temperatureValues = appoint_times.map((_, index) => {
            const temps = groupedData[index];
            if (temps) {
              const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
              return avgTemp;
            }
            return null;
          });
        }

        setChartData({
          labels: appoint_times,
          datasets: [
            {
              label: "Temperature Values",
              data: temperatureValues,
              backgroundColor: ["rgba(255, 99, 132, 0.6)"],
              borderWidth: 4,
            },
          ],
        });

      } else {
        console.error('Data is not an array:', data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    chart();
  }, [patientId, filterType]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filterType} onChange={handleFilterChange}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <>
        {chartData && chartData.labels ? (
          <Line data={chartData} />
        ) : (
          <p>Loading...</p>
        )}
      </>
    </div>
  );
};

export default TemperatureChart;
