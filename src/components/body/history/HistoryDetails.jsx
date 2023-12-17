import { Container } from "react-bootstrap"
import KMeansComponent from "../kmeans/KMeansComponent"
import HClustComponent from "../hierarchical/HClustComponent"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CorrelationHeatmap from "../heatmap/CorrelationHeatmap";
import { useEffect, useState } from "react";
import { ResultsAPI } from "../../../apis/ResultsAPI";


export const HistoryDetails = () => {

  const params = useParams();
  const id = params.id

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      ResultsAPI.getHistoryById(id).then(res => {
        setLoading(false)
        if (res?.error) {
          console.log(res)
        }
        else {
          res.data = JSON.parse(res.data)
          setData(res)
        }
      })
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!loading && data === undefined) {
    return <div>Error occured</div>
  }
  const kmeans = data?.data?.kmeans
  const hclust = data?.data?.hclust
  const pearson = data?.data?.pearson
  const selectedProperties = data?.data?.selectedProperties
  const numericProperties = data?.data?.numericProperties
  const dateCreated = new Date(data.created)

  return (
    <Container>
      <h3>filename: {data.fileName}</h3>
      <h5>{`Date Created: ${dateCreated.getDay() + 1}:${dateCreated.getMonth() + 1}:${dateCreated.getFullYear()}, ${dateCreated.getHours()}:${dateCreated.getMinutes()}`}</h5>
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