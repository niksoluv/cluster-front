import { ClusterDataManager } from "../../../helpers/ClusterDataManager"
import Card from 'react-bootstrap/Card';
import styles from './KMeansComponent.module.css'
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { setKMeansAction } from "../../../redux/reducers/resultsReducer";
import { useEffect } from "react";
import { Accordion } from "react-bootstrap";

const KMeansComponent = (props) => {
  const data = props.state.data
  const selectedProperties = props.state.selectedProperties

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setKMeansAction(data))
  }, [])

  data.clusters.forEach((cluster) => {
    cluster.centroid.fillColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  })
  console.log(data)
  const clustersDataManager = new ClusterDataManager(data, selectedProperties)
  const clusterData = clustersDataManager.getData()

  const series = data.clusters.map((cluster, index) => {
    return {
      name: `Cluster ${index + 1}`,
      data: cluster.points.map(point => { return [point[selectedProperties[0]], point[selectedProperties[1]]] })
    }
  })

  const options = {
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    xaxis: {
      tickAmount: 10,
      seriesName: "Series",
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1)
        }
      },
      title: {
        text: selectedProperties[0],
      }
    },
    yaxis: {
      tickAmount: 7,
      title: {
        text: selectedProperties[1],
      }
    }
  }

  return (
    <Card className={styles.cardContainer}>
      {/* <ResponsiveContainer height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey={selectedProperties[0]} name={'selectedProperties[0]'} />
          <YAxis type="number" dataKey={selectedProperties[1]} name={'selectedProperties[1]'} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          {data.clusters.map((cluster, i) => {
            return <Scatter isAnimationActive={false} name="A school" data={cluster.points} fill={data.centroids[i].fillColor} />
          })}
          {data.centroids.map((centroid) => {
            return <Scatter name="A school1" data={[centroid]} fill="#FF0000" shape='diamond' />
          })}
        </ScatterChart>
      </ResponsiveContainer> */}
      <ReactApexChart options={options} series={series} type="scatter" height={350} />
      <Card.Body>
        <Card.Title>K Means Clustering results</Card.Title>
        <Accordion defaultActiveKey="0">
          {clusterData}
        </Accordion>

        {/* <Card.Text>
          {clusterData}
        </Card.Text> */}
      </Card.Body>
    </Card>
  )
}

export default KMeansComponent