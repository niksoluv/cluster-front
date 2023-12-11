import React, { useEffect, useState } from 'react'
import DataReader from '../../helpers/DataReader'
import KMeans from '../../algorithms/KMeans';
import { Button, Container, Form, FormCheck } from 'react-bootstrap';
import MiniBatchKMeans from '../../algorithms/MiniBatchKMeans';
import HClust from '../../algorithms/HClust';
import PearsonsCorr from '../../algorithms/PearsonsCorr';
import CorrelationHeatmap from './heatmap/CorrelationHeatmap';
import KMeansComponent from './kmeans/KMeansComponent';
import HClustComponent from './hierarchical/HClustComponent';
import { useSelector } from 'react-redux';
import { ResultsAPI } from '../../apis/ResultsAPI';

export const ParseExcel = () => {

  console.log("render")
  const fileReader = new DataReader()
  const [kmeans, setKmeans] = useState({})
  const [miniBatchKmeans, setMiniBatcKmeans] = useState({})
  const [hclust, setHclust] = useState({})
  const [pearson, setPearson] = useState({})
  const [data, setData] = useState({})
  const [miniBatchData, setMiniBatchData] = useState({})
  const [hclustData, setHclustData] = useState({})
  const [pearsonData, setPearsonData] = useState({})
  const [numericProperties, setNumericProperties] = useState([])
  const [numericPropertiesMarkup, setNumericPropertiesMarkup] = useState()
  const [disabled, setDisabled] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState([])
  const [clustersNum, setClustersNum] = useState(3)

  const userData = useSelector((state)=>{
    return state.user.user
  })

  const handleChange = async (e) => {
    const data = await fileReader.handleFile(e)
    setKmeans(new KMeans(data))
    setMiniBatcKmeans(new MiniBatchKMeans(data))
    setHclust(new HClust(data))
    setPearson(new PearsonsCorr(data))
    setNumericProperties(getNumericProperties(data[0]))
    setSelectedProperties([])
    setNumericPropertiesMarkup([])
  }

  useEffect(() => {
    const markup = numericProperties.map(prop => {
      return <FormCheck inline
        onChange={(e) => {
          const selected = selectedProperties
          if (e.target.checked) {
            selected.push(prop)
            setSelectedProperties(selected);
          }
          else {
            selected.splice(selected.indexOf(prop), 1)
            setSelectedProperties(selected);
          }
          setDisabled(selectedProperties.length !== 2)
          console.log(selectedProperties)
        }}
        label={prop}
        name="group1"
        type='checkbox'
        key={prop}
        id={`inline-${prop}-1`} />
    })
    setNumericPropertiesMarkup(markup)
  }, [selectedProperties])

  useEffect(() => {
    setDisabled(selectedProperties.length !== 2)
  }, [selectedProperties])

  const getNumericProperties = (obj) => {
    const numericPropertyNames = [];

    for (const propertyName in obj) {
      if (typeof obj[propertyName] === 'number') {
        numericPropertyNames.push(propertyName);
      }
    }
    return numericPropertyNames;
  }

  const calculate = () => {
    const res = kmeans.calculate(clustersNum, selectedProperties, true)
    const miniRes = miniBatchKmeans.calculate(clustersNum, selectedProperties, true)
    const hclustRes = hclust.calculate(selectedProperties)
    const pearsonsRes = pearson.calculate(selectedProperties, numericProperties)
    setData(res)
    setMiniBatchData(miniRes)
    //setPearsonData(pearsonsRes)
    setHclustData(hclustRes)
  }

  const saveResults = () => {
    const resultData = {
      kmeans: data,
      hclust: hclustData,
      pearson: pearsonData
    }
    ResultsAPI.saveData(resultData, userData).then(res => {
      if (res)
        console.log(res)
    })
  }

  return (
    <Container>
      <h1>User Data Clusterization</h1>
      <Form.Control type="file" onChange={(e) => handleChange(e)} />
      <div className="input-group">
        <span className="input-group-text" id="basic-addon3">Number of clusters: </span>
        <input type="text" className="form-control" value={clustersNum}
          id="basic-url" aria-describedby="basic-addon3 basic-addon4"
          onChange={(e) => setClustersNum(e.target.value)} />
      </div>
      {numericPropertiesMarkup}
      <Button onClick={() => calculate()} disabled={disabled}>Calculate</Button>
      <div style={{ display: 'flex' }}>
        {data?.centroids &&
          <KMeansComponent state={{ data: data, selectedProperties: selectedProperties }} />
        }
        {/* {miniBatchData?.centroids &&
          <KMeansComponent state={{ data: miniBatchData, selectedProperties: selectedProperties }} />
        } */}
      </div>
      <div style={{ display: 'flex' }}>
        {hclustData?.dendogram && hclustData?.layout &&
          <HClustComponent state={{ data: hclustData }} />
        }
        {/* {pearsonData.correlation &&
          <CorrelationHeatmap state={{ data: pearsonData.correlation, numericProperties: numericProperties }} />} */}
      </div>
      {data.clusters &&
        <Button onClick={() => saveResults()}>Save Results</Button>}
    </Container >
  )
}