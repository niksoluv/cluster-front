import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Root from './components/Root';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/signIn/SignIn';
import Header from './components/header/Header';
import rootReducer from './redux/reducers/rootReducer';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ToastContainer } from 'react-toastify';
import { ParseExcel } from './components/ParseExcel';

const store = createStore(rootReducer)

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/parse-excel' element={<ParseExcel />} />
          <Route path='/' element={<Root />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
