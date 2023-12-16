import { Accordion, Badge } from "react-bootstrap";

export class ClusterDataManager {
  clusterData
  clustersCount = 0
  selectedProperties = []

  constructor(clusterData, selectedProperties) {
    this.clusterData = clusterData;
    this.clustersCount = clusterData.clusters.length;
    this.selectedProperties = selectedProperties;
  }

  getData = () => {
    const res = this.clusterData.clusters.map((cluster, index) => {
      return <Accordion.Item eventKey={index}>
        <Accordion.Header>Cluster {index + 1}</Accordion.Header>
        <Accordion.Body>
          <div>
            Data count: {cluster.points.length}
            {this.selectedProperties.map(prop => <div>{`${prop}: ${cluster.centroid[prop].toFixed(2)}`}</div>)}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    })

    return res
  }
}

