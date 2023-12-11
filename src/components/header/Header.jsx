import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../redux/reducers/userReducer';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
import { UserAPI } from './../../apis/UserAPI';
import { getDataAction } from './../../redux/reducers/userReducer';
import styles from './Header.module.css'

const Header = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state => {
    return state?.user?.user
  }))
  const userInfo = useSelector((state) => {
    return state.user
  })
  useEffect(() => {
    if (localStorage.getItem("token")) {
      UserAPI.getInfo().then(res => {
        if (res)
          dispatch(getDataAction(res))
      })
    }
  }, [])
  const signOut = () => {
    localStorage.removeItem('token')
    dispatch(logoutAction())
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand><Link className={styles.link} to='/'>User Clustering</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link><Link className={styles.link} to='/parse-excel'>Parser</Link></Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          {userInfo?.token !== "" ?
            <>
              <Link to='/profile' className='m-1'>{userData.userName}</Link>
              <Button
                onClick={() => signOut()}>Sign Out</Button>
            </>
            :
            <Link to='/login'>Sign In</Link>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default Header; 