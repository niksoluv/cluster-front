import { Button, Card, CardBody, CardHeader, CardText, CardTitle } from "react-bootstrap"
import { Link, NavLink } from 'react-router-dom';

export const HistoryElement = (props) => {
  const data = props.state.data
  const numOfClusters = data?.data?.kmeans?.clusters?.length
  const numOfRecords = data?.data?.kmeans?.numOfRecords

  const dateCreated = new Date(data.created)

  console.log(data)
  return <Card
    className="my-2"
    color="info"
    outline
    style={{
      minWidth: '18rem',
      margin: '10px',
    }}
  >
    <CardHeader>
      {data.fileName || 'No File Name'}
    </CardHeader>
    <CardBody>
      <CardTitle tag="h5">
        {`Number of clusters: ${numOfClusters}`}
      </CardTitle>
      <CardText>
        {`Number of records: ${numOfRecords}`}
      </CardText>
      <CardText>
        {`Date Created: ${dateCreated.getDay() + 1}:${dateCreated.getMonth() + 1}:${dateCreated.getFullYear()}, ${dateCreated.getHours()}:${dateCreated.getMinutes()}`}
      </CardText>
      <Button variant="info">
        <NavLink style={{
          color: 'black',
          textDecoration: 'none'
        }} to={{ pathname: `/details/${data.id}` }}>View Details</NavLink>
      </Button>
    </CardBody>
  </Card>
}