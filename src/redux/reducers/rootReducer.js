import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { resultsReducer } from './resultsReducer';

const rootReducer = combineReducers({
  user: userReducer,
  results: resultsReducer
})

export default rootReducer