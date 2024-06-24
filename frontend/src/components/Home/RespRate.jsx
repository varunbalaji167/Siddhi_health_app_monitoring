// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';
// import axios from 'axios';

// const RespRateChart = ({ patientId }) => {
//   const [chartData, setChartData] = useState({});

//   const chart = async () => {
//     let appoint_time = [];
//     let resp_Rate = [];

//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/v1/patients/${patientId}/vitals`);
//       console.log('API response:', res); // Log the entire response
//       const data = res.data; // Adjust this line based on actual response structure

//       if (Array.isArray(data)) {
//         for (const dataObj of data) {
//           appoint_time.push(dataObj.appointmentTime);
//           resp_Rate.push(parseInt(dataObj.respRate, 10));
//         }
//         setChartData({
//           labels: appoint_time,
//           datasets: [
//             {
//               label: "HeartRate of patients",
//               data: resp_Rate,
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

// export default RespRateChart;
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import moment from 'moment';

const RespiratoryRateChart = ({ patientId }) => {
  const [chartData, setChartData] = useState({});
  const [filterType, setFilterType] = useState('day');

  const chart = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/patients/${patientId}/vitals?filter_type=${filterType}`);
      console.log(res); // Log the full response
      const data = res.data;

      if (Array.isArray(data)) {
        let appoint_times = [];
        let respiratoryRates = [];

        if (filterType === 'day') {
          // Filter data for today
          for (const dataObj of data) {
            appoint_times.push(dataObj.appointmentTime);
            respiratoryRates.push(parseInt(dataObj.respRate, 10));
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
            acc[date].push(parseInt(current.respRate, 10));
            return acc;
          }, {});

          // Calculate average respiratory rate per day
          respiratoryRates = appoint_times.map(date => {
            const rates = groupedData[date];
            if (rates) {
              const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
              return avgRate;
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
              acc[weekIndex].push(parseInt(current.respRate, 10));
            }
            return acc;
          }, {});

          // Calculate average respiratory rate per week
          respiratoryRates = appoint_times.map((_, index) => {
            const rates = groupedData[index];
            if (rates) {
              const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
              return avgRate;
            }
            return null;
          });
        }

        setChartData({
          labels: appoint_times,
          datasets: [
            {
              label: "Respiratory Rate Values",
              data: respiratoryRates,
              backgroundColor: ["rgba(54, 162, 235, 0.6)"],
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

export default RespiratoryRateChart;
