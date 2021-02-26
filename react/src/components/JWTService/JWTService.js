import UserApiService from '../ApiService/UserApiService';

class JWTService {
  //두개를 합쳐서 회원권한이 필요할때 로그인 했는지 JWT토큰이 현재 유효한지 검증하는 메소드를 생성
  validateUser(JWT) {
    this.checkLogin(JWT);
    let result = this.tokenCheck(JWT);
    console.log('토큰유효성 정보:', result);
    return result;
  }

  //JWT 토큰 저장되어있는지 확인 후 없으면 false를 리턴하고 로그인페이지로 보낸다
  checkLogin(JWT) {
    if (JWT === null) {
      alert('로그인 후 이용가능합니다');

      let login = '/login';
      window.location.assign(login);
      return false;
    }
  }

  //JWT 토큰을 넘겨받아 유효성 검사를 시행하는 메소드
  //토큰만료, 비정상적인접근, 정상토큰    3가지값 return
  tokenCheck = (JWT) => {
    console.log(JWT);
    UserApiService.JWTCheck(JWT)
      .then((res) => {
        console.log(res);
        let tokenCheckResult = res.data;
        //토큰 만료의 경우
        if (tokenCheckResult === '토큰만료') {
          console.log('토큰만료됨');
          // 토큰만료됬다는 데이터가 오면 로그인페이지로 강제이동
          // 토큰이 저장된 세션 지우고
          alert('다시 로그인해주세요');
          sessionStorage.removeItem('Authorization');
          let login = '/login';
          window.location.assign(login);
          return;
        }

        //서명이 다르게 되어있는 토큰의 경우 비정상적인접근 이라고 반환받음
        if (tokenCheckResult === '비정상적인접근') {
          console.log('비정상적인접근');
          sessionStorage.removeItem('Authorization');
          let login = '/login';
          window.location.assign(login);
          return;
        }
        //토큰을 체크하고 해당 토큰의 유효값을 반환함
        //위의 경우가 아닐땐 정상토큰 을 리턴함
        return tokenCheckResult;
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default new JWTService();
