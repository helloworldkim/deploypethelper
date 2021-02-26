import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import PetFinder from './components/PetFinder';
import Register from './components/User/Register';
import LoginForm from './components/User/LoginForm';
import Logout from './components/User/Logout';
import Board_write from './components/board/Board_write';
import Board_list from './components/board/Board_list';
import Board_details from './components/board/Board_details';
import MyHome from './components/MyHome';

const JWT = sessionStorage.getItem('Authorization');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false,
    };
  }

  render() {
    console.log(JWT);
    // JWT토큰 없을때
    if (JWT === null) {
      return (
        <>
          <BrowserRouter>
            <nav className="navbar navbar-expand-sm bg-light">
              <ul className="navbar-nav">
                <li className="nav-item m-2">
                  <Link to="/">Home</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/login">로그인</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/register">회원가입</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/board">게시판</Link>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route exact path="/" component={MyHome}></Route>
              <Route path="/login" component={LoginForm}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/board" component={Board_list}></Route>
            </Switch>
          </BrowserRouter>
        </>
      );
      //있을때
    } else {
      return (
        <>
          <BrowserRouter>
            <nav className="navbar navbar-expand-sm bg-light">
              <ul className="navbar-nav">
                <li className="nav-item m-2">
                  <Link to="/">Home</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/board">게시판</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/pets">유기동물 정보 조회하기</Link>
                </li>
                <li className="nav-item m-2">
                  <Link to="/logout">로그아웃 페이지</Link>
                </li>
              </ul>
            </nav>
            <Switch>
              <Route exact path="/" component={MyHome}></Route>
              <Route path="/login" component={LoginForm}></Route>
              <Route path="/logout" component={Logout}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/board" component={Board_list}></Route>
              <Route path="/board_write" component={Board_write}></Route>
              <Route path="/board_details" component={Board_details}></Route>
              <Route path="/pets" component={PetFinder}></Route>
            </Switch>
          </BrowserRouter>
        </>
      );
    }
  }
}

export default App;
