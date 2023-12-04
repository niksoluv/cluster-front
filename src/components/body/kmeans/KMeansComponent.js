import { Tooltip } from "react-bootstrap"
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from "recharts"

const KMeansComponent = (props) => {
  const data = props.state.data
  const selectedProperties = props.state.selectedProperties

  return (
    <ResponsiveContainer width="50%" height={400}>
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
          return <Scatter isAnimationActive={false} name="A school" data={cluster.points.slice(0, 15)} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
        })}
        {data.centroids.map((centroid) => {
          return <Scatter name="A school" data={[centroid]} fill="#FF0000" shape='diamond' />
        })}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

export default KMeansComponent