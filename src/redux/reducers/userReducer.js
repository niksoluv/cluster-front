const initialState = {
  user: {},
  token: ""
}

const LOGIN = 'LOGIN'
const REGISTER = 'REGISTER'
const LOGOUT = 'LOGOUT'
const GET_DATA = 'GET_DATA'

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload.user, token: action.payload.token.access_token }
    case GET_DATA:
      return { ...state, user: action.payload.user, token: action.payload.token.access_token }
    case REGISTER:
      return { ...state }
    case LOGOUT:
      return { ...state, user: {}, token: "" }
    default:
      return { ...state }
  }
}

export const loginAction = (payload) => ({ type: LOGIN, payload })
export const getDataAction = (payload) => ({ type: GET_DATA, payload })
export const logoutAction = (payload) => ({ type: LOGOUT, payload })
