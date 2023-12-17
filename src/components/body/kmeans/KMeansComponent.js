import { ClusterDataManager } from "../../../helpers/ClusterDataManager"
import Card from 'react-bootstrap/Card';
import styles from './KMeansComponent.module.css'
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { setKMeansAction } from "../../../redux/reducers/resultsReducer";
import { useEffect } from "react";
import { Accordion, Button } from "react-bootstrap";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
  let dataLength = 0
  data.clusters.forEach(cluster => { dataLength += cluster.points.length })
  const series = data.clusters.map((cluster, index) => {
    if (dataLength > 100) {
      return {
        name: `Cluster ${index + 1}`,
        data: cluster.points.slice(0,(100/data.clusters.length).toFixed(0)).map(point => { return [point[selectedProperties[0]], point[selectedProperties[1]]] })
      }
    }
    else {
      return {
        name: `Cluster ${index + 1}`,
        data: cluster.points.map(point => { return [point[selectedProperties[0]], point[selectedProperties[1]]] })
      }
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

  const saveData = (data) => {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes()
    const wb = XLSX.utils.book_new()
    data.clusters.forEach((cluster, index) => {
      const ws = XLSX.utils.json_to_sheet(cluster.points)
      XLSX.utils.book_append_sheet(wb, ws, `Cluster ${index + 1}`)
    })

    var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
    var wbout = XLSX.write(wb, wopts)
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Cluster results_${datetime}.xlsx`);
  }

  return (
    <Card className={styles.cardContainer}>
      <ReactApexChart options={options} series={series} type="scatter" height={350} />
      <Card.Body>
        <Card.Title>K Means Clustering results <Button variant="outline-success" onClick={() => saveData(data)}>Export all data</Button></Card.Title>
        <Accordion defaultActiveKey="0">
          {clusterData}
        </Accordion>
      </Card.Body>
    </Card>
  )
}

export default KMeansComponent