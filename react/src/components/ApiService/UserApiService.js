import axios from 'axios';

const USER_URL = 'http://15.164.214.226:8080'; //spring boot 접속 url

class UserApiService {
  registerUser(User) {
    return axios.post(USER_URL + '/join', User);
  }
  login(User) {
    return axios.post('http://15.164.214.226:8080/login', User);
  }
  JWTCheck(token) {
    return axios.get(USER_URL + '/user/jwtcheck', {
      headers: { Authorization: token, 'Content-Type': 'application/json' },
    });
  }
  getUserDetails(token) {
    return axios.get(USER_URL + '/user/details', {
      headers: { Authorization: token, 'Content-Type': 'application/json' },
    });
  }
}

export default new UserApiService();
