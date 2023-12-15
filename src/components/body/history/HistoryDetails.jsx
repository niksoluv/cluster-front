import { Container } from "react-bootstrap"
import KMeansComponent from "../kmeans/KMeansComponent"
import HClustComponent from "../hierarchical/HClustComponent"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CorrelationHeatmap from "../heatmap/CorrelationHeatmap";


export const HistoryDetails = () => {

  const params = useParams();
  const id = params.id

  const data = useSelector((state) => {
    return state.user.historyData.filter(d => d.id === id)[0]
  })

  const kmeans = data.data.kmeans
  const hclust = data.data.hclust
  const pearson = data.data.pearson
  const selectedProperties = data.data.selectedProperties
  const numericProperties = data.data.numericProperties

  return (
    <Container>
      <h1>filename: {data.fileName}</h1>
      <div style={{ display: 'flex' }}>
        {kmeans?.centroids &&
          <KMeansComponent state={{ data: kmeans, selectedProperties: selectedProperties }} />
        }
      </div>
      <div style={{ display: 'flex' }}>
        {hclust?.dendogram && hclust?.layout &&
          <HClustComponent state={{ data: hclust }} />
        }
        {pearson.correlation &&
          <CorrelationHeatmap state={{ data: pearson.correlation, numericProperties: numericProperties }} />}
      </div>
    </Container >
  )
}