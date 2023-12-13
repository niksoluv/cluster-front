import { Container } from "react-bootstrap"
import { Link, Navigate } from "react-router-dom"
import { UserAPI } from "../../apis/UserAPI"
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../redux/reducers/userReducer";
import { toast } from "react-toastify";

const SignIn = (props) => {

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => {
    return state.user
  })
  //console.log(userInfo)
  const userData = {}

  const handleChange = (e, fieldName) => {
    userData[fieldName] = e.target.value
  }
  const signIn = () => {
    UserAPI.logIn(userData).then(res => {
      if (res.error) {
        console.log(res)
        if (res.error.response.status === 401){
          toast.error(res.errorMessage);
        }
      }
      else {
        toast.success("Successfull login")
        localStorage.setItem('token', res.token.access_token)
        dispatch(loginAction(res))
      }
      //console.log(res)
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
