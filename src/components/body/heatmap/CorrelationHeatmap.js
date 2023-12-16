import React from 'react';
import ReactApexChart from 'react-apexcharts';


const CorrelationHeatmap = (props) => {

  const series = props.state.data.map((row) => ({
    data: row.data,
    name: row.name
  }));

  const options = {
    chart: {
      type: 'heatmap'
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: -1,
              to: 0.3,
              name: 'very low',
              color: '#001f3f'
            },
            {
              from: 0.31,
              to: 0.5,
              name: 'low correlation',
              color: '#3D5A80'
            },
            {
              from: 0.51,
              to: 0.7,
              name: 'moderately correlated',
              color: '#A2A9B0'
            },
            {
              from: 0.71,
              to: 0.9,
              name: 'high',
              color: '#F76D57'
            },
            {
              from: 0.91,
              to: 1,
              name: 'very high',
              color: '#D62828'
            },
          ]
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: props.state.numericProperties
    },
    yaxis: {
      //reversed: true
      //categories: props.state.numericProperties.reverse()
    },
    title: {
      text: 'Correlation Heatmap'
    }
  };
  return (
    <div style={{width:'50%'}}>
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height="350"
      /></div>
  );
};

export default CorrelationHeatmap;
