import { Container } from "react-bootstrap"
import { Link, Navigate } from "react-router-dom"
import { UserAPI } from "../../apis/UserAPI"
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../redux/reducers/userReducer";

const SignIn = (props) => {

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => {
    return state.user
  })
  console.log(userInfo)
  const userData = {}

  const handleChange = (e, fieldName) => {
    userData[fieldName] = e.target.value
  }

  const signIn = () => {
    UserAPI.logIn(userData).then(res => {
      console.log(res)
      localStorage.setItem('token', res.token.access_token)
      dispatch(loginAction(res))
    })
  }
  if (userInfo?.token !== '') {
    return (
      <Navigate to='/' />
    )
  }

  return (
    <Container style={{ width: '400px' }}>
      <h3 className="d-flex align-items-center justify-content-center">Sign In</h3>
      <div className="mb-3">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter username"
          onChange={(e) => handleChange(e, 'username')}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => handleChange(e, 'password')}
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary" onClick={signIn}>
          Sign In
        </button>
      </div>
      <p className="forgot-password text-right">
        Don't have an account? <Link to='/register'>Sign Up!</Link>
      </p>
    </Container>
  )
}

export default SignIn
