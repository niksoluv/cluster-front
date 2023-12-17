import { Accordion, Badge, Button } from "react-bootstrap";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export class ClusterDataManager {
  clusterData
  clustersCount = 0
  selectedProperties = []

  constructor(clusterData, selectedProperties) {
    this.clusterData = clusterData;
    this.clustersCount = clusterData.clusters.length;
    this.selectedProperties = selectedProperties;
  }

  saveData = (cluster, index) => {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes()
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(cluster.points)
    var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
    XLSX.utils.book_append_sheet(wb, ws, `Cluster ${index + 1}`)

    var wbout = XLSX.write(wb, wopts)
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Cluster ${index + 1}_${datetime}.xlsx`);
  }

  getData = () => {
    const res = this.clusterData.clusters.map((cluster, index) => {
      return <Accordion.Item eventKey={index}>
        <Accordion.Header>Cluster {index + 1}</Accordion.Header>
        <Accordion.Body>
          <div>
            Number of records: {cluster.points.length} <Button variant="outline-success" onClick={() => this.saveData(cluster, index)}>Export cluster data</Button>
            {this.selectedProperties.map(prop => <div>{`${prop}: ${cluster.centroid[prop].toFixed(2)}`}</div>)}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    })

    return res
  }
}

