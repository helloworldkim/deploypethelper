import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import './LoginForm.css';
import UserApiService from '../ApiService/UserApiService';
let emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  componentDidMount() {
    this.checkJWTToken();
  }
  checkJWTToken = () => {
    let JWT = sessionStorage.getItem('Authorization');
    console.log(JWT);
    if (JWT === null) {
      return;
    }
    alert('이미로그인하셨습니다');
    //홈경로로 보냄
    this.props.history.push('/');
  };
  onChangeValues = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  login = () => {
    let email = this.state.email;
    let password = this.state.password;
    if (email === '') {
      alert('이메일을 입력해주세요');
      return;
    }
    if (!emailRegExp.test(email)) {
      alert('이메일 형식이 아닙니다');
      return;
    }
    if (password === '') {
      alert('비밀번호를 입력해주세요');
      return;
    } //유저객체생성
    let User = {
      username: this.state.email,
      password: this.state.password,
    };
    UserApiService.login(User)
      .then((res) => {
        let data = res.data;
        console.log('데이터값:', res.data);
        //아이디 또는 비밀번호로 조회했을때 db에 값이 없을경우 비회원 이라는 값이 리턴됨
        if (data === '비회원') {
          alert('회원이 아닙니다');
          return;
        }
        if (data === '정보확인요망') {
          alert('입력하신 정보가 틀렸습니다.');
          return;
        }
        //비회원이 아닐경우 JWT토큰을 받음 JWT토근을 session에 저장함
        sessionStorage.setItem('Authorization', res.data.Authorization);
        let JWT = sessionStorage.getItem('Authorization');
        console.log(JWT);
        //홈경로로 보냄
        alert('로그인성공');
        window.location.assign('/'); //redirect형식으로 보내버림
        // this.props.history.push('/'); 이전 경로가 없을경우에는 오류떠서 안됨
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="paper">
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoFocus
            onChange={this.onChangeValues}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            onChange={this.onChangeValues}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
            children="로그인"
            onClick={this.login}
          />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?(아직안됨)
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default LoginForm;
