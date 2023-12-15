import { useEffect } from "react"
import { Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { ResultsAPI } from "../../../apis/ResultsAPI"
import { toast } from "react-toastify"
import { getHistoryDataAction } from "../../../redux/reducers/userReducer"
import { HistoryElement } from "./HistoryElement"

export const HistoryComponent = (props) => {

  const dispatch = useDispatch()
  const history = useSelector(state => {
    return state.user.historyData
  })

  useEffect(() => {
    ResultsAPI.getHistory().then(res => {
      if (res?.error) {
        console.log(res)
        if (res.error.response.status === 401) {
          toast.error(res.errorMessage);
        }
      }
      else {
        console.log(res)
        res.forEach(h => h.data = JSON.parse(h.data))
        dispatch(getHistoryDataAction(res))
      }
      //console.log(res)
    })
  }, [])

  const historyMarkup = history.map(h => {
    return <HistoryElement state={{ data: h }} />
  })
  // history.forEach(h => h.data = JSON.parse(h.data))
  // console.log(history)

  return (
    <Container style={{ display: 'flex', flexWrap:'wrap'}}>
      {historyMarkup}
      {/* {JSON.stringify(history)} */}
    </Container>
  )
} 