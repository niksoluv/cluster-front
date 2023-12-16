import Tree from "react-d3-tree"

const HClustComponent = (props) => {
  const data = props.state.data
  
  return (
    <div style={{ width: '50%', height: '500px' }}>
      <Tree data={data.dendogram} pathFunc='diagonal' />
    </div>
  )
}

export default HClustComponent