import { Badge } from "react-bootstrap";

export class ClusterDataManager {
  clusterData
  clustersCount = 0

  constructor(clusterData) {
    this.clusterData = clusterData;
    this.clustersCount = clusterData.clusters.length;
  }

  getData = () => {
    const res = this.clusterData.clusters.map((cluster, index) => {
      return <div>
        <b style={{backgroundColor: `${this.clusterData.centroids[index].fillColor}!important`}}>Cluster {index + 1}:</b>
        Data count: {cluster.points.length}
      </div>
    })

    return res
  }
}

