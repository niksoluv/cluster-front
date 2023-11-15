import React, { useEffect, useState } from 'react'
import DataReader from '../helpers/DataReader'
import KMeans from './../algorithms/KMeans';
import { Button, Form, FormCheck } from 'react-bootstrap';
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import MiniBatchKMeans from '../algorithms/MiniBatchKMeans';

export const ParseExcel = () => {

  const fileReader = new DataReader()
  const [kmeans, setKmeans] = useState({})
  const [miniBatchKmeans, setMiniBatcKmeans] = useState({})
  const [data, setData] = useState({})
  const [miniBatchData, setMiniBatchData] = useState({})
  const [numericProperties, setNumericProperties] = useState([])
  const [numericPropertiesMarkup, setNumericPropertiesMarkup] = useState()
  const [disabled, setDisabled] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState([])
  const [clustersNum, setClustersNum] = useState(3)

  const handleChange = async (e) => {
    const data = await fileReader.handleFile(e)
    setKmeans(new KMeans(data))
    setMiniBatcKmeans(new MiniBatchKMeans(data))
    setNumericProperties(getNumericProperties(data[0]))
    setSelectedProperties([])
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
  }, [numericProperties, selectedProperties])

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
    const res = kmeans.calculate(clustersNum, selectedProperties, false)
    const miniRes = miniBatchKmeans.calculate(clustersNum, selectedProperties, false)
    setData(res)
    setMiniBatchData(miniRes)
  }

  return (
    <div>
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
      {data?.centroids &&
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey={selectedProperties[0]} name={selectedProperties[0]} />
            <YAxis type="number" dataKey={selectedProperties[1]} name={selectedProperties[1]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {data.clusters.map((cluster) => {
              return <Scatter isAnimationActive={false} name="A school" data={cluster.points} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            })}
            {data.centroids.map((centroid) => {
              return <Scatter name="A school" data={[centroid]} fill="#FF0000" shape='diamond' />
            })}
          </ScatterChart>
        </ResponsiveContainer>
      }
      {miniBatchData?.centroids &&
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey={selectedProperties[0]} name={selectedProperties[0]} />
            <YAxis type="number" dataKey={selectedProperties[1]} name={selectedProperties[1]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {miniBatchData.clusters.map((cluster) => {
              return <Scatter isAnimationActive={false} name="A school" data={cluster.points} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
            })}
            {miniBatchData.centroids.map((centroid) => {
              return <Scatter name="A school" data={[centroid]} fill="#FF0000" shape='diamond' />
            })}
          </ScatterChart>
        </ResponsiveContainer>
      }

    </div >
  )
}