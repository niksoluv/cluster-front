const initialState = {
  kmeansData: {},
  hclustData: {},
  pearsonsData: {}
}

const SET_KMEANS = 'SET_KMEANS'
const SET_HCLUST = 'SET_HCLUST'
const SET_PEARSON = 'SET_PEARSON'

export const resultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_KMEANS:
      return { ...state, kmeansData: action.payload }
    // case GET_DATA:
    //   return { ...state, user: action.payload.user, token: action.payload.token.access_token }
    case SET_HCLUST:
      return { ...state, hclustData: action.payload }
    case SET_PEARSON:
      return { ...state, pearsonsData: action.payload }
    default:
      return { ...state }
  }
}

export const setKMeansAction = (payload) => ({ type: SET_KMEANS, payload })
export const setHClustAction = (payload) => ({ type: SET_HCLUST, payload })
export const setPearsonAction = (payload) => ({ type: SET_PEARSON, payload })
