import React from 'react';
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom"
import { UserAPI } from './../../apis/UserAPI';
import { toast } from "react-toastify";
import { Container } from 'react-bootstrap';

const SignUp = (props) => {
  const [userData, setUserData] = useState({})
  const [errors, setErrors] = useState({})

  const userInfo = useSelector((state) => {
    return state.user
  })

  const changeHandler = (e) => {
    userData[e.target.id] = e.target.value
    setUserData(userData)
    handleErrors(e.target.id)
  }

  const handleErrors = (field) => {
    let re = new RegExp('')
    let found = {}

    switch (field) {
      case 'password':
        // password
        var passwordRegex = /^[a-zA-Z0-9_]{8,15}$/
        re = new RegExp(passwordRegex);
        found = userData.password.match(re)
        if (found === null) {
          errors['password'] = 'Password can only contain letters, numbers, and underscores, and must be between 8 and 15 characters long'
          setErrors({ ...errors })
        }
        else {
          errors['password'] = ''
          setErrors({ ...errors })
        }
        break
      case 'submitPassword':
        // submit password
        if (userData.password !== userData.submitPassword) {
          errors['submitPassword'] = 'Passwords doesnt match'
          setErrors({ ...errors })
        }
        else {
          errors['submitPassword'] = ''
          setErrors({ ...errors })
        }
        break
      case 'username':
        // username
        var usernameRegex = /^[a-zA-Z0-9_]{4,15}$/
        re = new RegExp(usernameRegex);
        found = userData.username?.match(re)
        if (found === null) {
          errors['username'] = 'Username can only contain letters, numbers, and underscores, and must be between 4 and 15 characters long'
          setErrors({ ...errors })
        }
        else {
          errors['username'] = ''
          setErrors({ ...errors })
        }
        break
      case 'email':
        // email
        var emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        re = new RegExp(emailRegex);
        found = userData.email?.match(re)
        if (found === null) {
          errors['email'] = 'Wrong email'
          setErrors({ ...errors })
        }
        else {
          errors['email'] = ''
          setErrors({ ...errors })
        }
        break
      default:
        break
    }

  }


  const notify = (message) => toast(message);

  const submitForm = (e) => {
    if (errors.username === '' && errors.email === '' && errors.password === '' && errors.submitPassword === '') {
      UserAPI.register(userData).then(res => {
        if (res.user === undefined) {
          notify(res)
          return
        }
      })
      // register(userData).then(res => {
      // 	if (res.errorMessage !== undefined) {
      // 		notify(res.errorMessage)
      // 		return
      // 	}
      // 	getToken(res).then(res => {
      // 		getUserData(res.access_token).then(res => {
      // 			const payload = {
      // 				userData: res
      // 			}
      // 			dispatch(getDataAction(payload))
      // 		})
      // 	})
      // })
    }
  }
  if (userInfo) {
    if (userInfo?.id) {
      return <Navigate to='/' />
    }
  }

  return (
    <Container style={{ width: '400px' }}>
      {/* <div className="row d-flex justify-content-center mt-2"> */}
      <h3 className="d-flex align-items-center justify-content-center">Sign Up</h3>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="EmailInput"
          aria-describedby="emailHelp"
          placeholder="Username"
          onChange={changeHandler}
        />
        <small id="emailHelp" className="text-danger form-text">
          {errors.username}
        </small>
      </div>
      <div className="form-group">
        <label>Email address</label>
        <input
          type="text"
          className="form-control"
          id="email"
          name="EmailInput"
          aria-describedby="emailHelp"
          placeholder="Email"
          onChange={changeHandler}
        />
        <small id="emailHelp" className="text-danger form-text">
          {errors.email}
        </small>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
        />
        <small id="passworderror" className="text-danger form-text">
          {errors.password}
        </small>
      </div>
      <div className="form-group">
        <label>Submit password</label>
        <input
          type="password"
          className="form-control"
          id="submitPassword"
          placeholder="Submit password"
          onChange={changeHandler}
        />
        <small id="passworderror" className="text-danger form-text">
          {errors.submitPassword}
        </small>
      </div>
      Already have an account? <Link to='/login'>Sign In</Link>
      <br />
      <button onClick={submitForm} className="btn btn-primary">
        Sign Up
      </button>
    </Container>
    // </div>
    // <div className="d-flex flex-column align-items-center">
    //   <h3 className="d-flex align-items-center justify-content-center">Sign Up</h3>
    //   <Form style={{ width: '20rem', paddingTop: '2rem' }} onSubmit={handleSubmit}>
    //     <Form.Group style={{ display: "flex", flexDirection: 'column' }}>
    //       <Form.Label>Username</Form.Label>
    //       <InputGroup hasValidation>
    //         <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
    //         <Form.Control
    //           type="text"
    //           placeholder="Username"
    //           aria-describedby="inputGroupPrepend"
    //           value={userData.username}
    //           onChange={(e) => handleChange(e, 'username')}
    //           required
    //         />
    //         <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
    //       </InputGroup>

    //       <Form.Label>E-mail</Form.Label>
    //       <Form.Control
    //         type="email"
    //         placeholder="E-mail"
    //         value={userData.email}
    //         onChange={(e) => handleChange(e, 'email')}
    //         required
    //       />
    //       <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>

    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type="password"
    //         placeholder="Password"
    //         value={userData.password}
    //         onChange={(e) => handleChange(e, 'password')}
    //         required
    //       />
    //       <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

    //       <Form.Label>Submit Password</Form.Label>
    //       <Form.Control
    //         type="password"
    //         placeholder="Submit Password"
    //         value={userData.submitPassword}
    //         onChange={(e) => handleChange(e, 'submitPassword')}
    //         required
    //       />
    //       <Form.Control.Feedback type="invalid">{errors.submitPassword}</Form.Control.Feedback>
    //       <Button type="submit" className="mt-2">Sign Up</Button>
    //     </Form.Group>
    //     {/* <div className="mb-3">
    //       <label>Username</label>
    //       <input
    //         type="text"
    //         className="form-control"
    //         placeholder="Enter username"
    //         onChange={(e) => handleChange(e, 'username')}
    //       />
    //     </div>
    //     <div className="mb-3">
    //       <label>E-mail</label>
    //       <input
    //         type="email"
    //         className="form-control"
    //         placeholder="Enter email"
    //         onChange={(e) => handleChange(e, 'email')}
    //       />
    //     </div>
    //     <div className="mb-3">
    //       <label>Password</label>
    //       <input
    //         type="password"
    //         className="form-control"
    //         placeholder="Enter password"
    //         onChange={(e) => handleChange(e, 'password')}
    //       />
    //     </div>
    //     <div className="mb-3">
    //       <label>Submit password</label>
    //       <input
    //         type="password"
    //         className="form-control"
    //         placeholder="Submit password"
    //         onChange={(e) => handleChange(e, 'password')}
    //       />
    //     </div>
    //     <div className="d-grid">
    //       <button type="submit" className="btn btn-primary" onClick={() => signUp()}>
    //         Sign Up
    //       </button>
    //     </div> */}
    //     <p className="forgot-password text-right">
    //       Already have an account? <Link to='/login'>Sign In</Link>
    //     </p>
    //   </Form>
    // </div>
  )
}

export default SignUp
